const db = require('../db');

module.exports = {
    addEvent: async (req, res) => {
        // creator is a dummy for current situation, in real app we need to get data about creator from another place.
        const { creator, title, description, fromDate, toDate, participants } = req.body;
        const client = await db.getConnect();
        try {
            await client.query('BEGIN');
            const {rows} = await client.query(
                'INSERT INTO events (creator_id, title, description, from_date, to_date) VALUES ($1, $2, $3, $4, $5) RETURNING event_id',
                [creator, title, description, fromDate, toDate]
            );
            if (participants.length > 0) {
                let eventId = rows[0].event_id;
                let partValues = participants.reduce((prev, memberId) => {
                    if (memberId === creator) return prev;
                    return [`('${eventId}', '${memberId}')`, ...prev];
                }, []);
                let str = `INSERT INTO participants (event_id, user_id) VALUES ${partValues.join(',')}`;
                await client.query(str);
            } 
            await client.query('COMMIT');
        } catch (e) {
            await client.query('ROLLBACK');
            console.error(e.stack);
            res.send({success: false});
            return;
        } finally {
            client.release();
        }
        res.send({success: true});
    },

    getEvents: async (req, res) => {
        // creator is a dummy for current situation, in real app we need to get data about creator from another place.
        const { from_date: from, to_date: to, creator } = req.query;
        const { rows } = await db.query(
            'SELECT DISTINCT e.event_id, e.title, e.description, e.from_date, e.to_date FROM events e, participants p WHERE e.from_date >= $1 AND e.to_date <= $2 AND (e.creator_id=$3 OR (e.event_id=p.event_id AND p.user_id=$4))',
            [from, to, creator, creator]
        );
        res.send(rows);
    },

    removeEvent: async (req, res) => {
        // creator is a dummy for current situation, in real app we need to get data about creator from another place.
        const { creator } = req.body;
        const { eventId } = req.params;
        const { rows } = await db.query('SELECT * FROM events WHERE event_id=$1 AND creator_id=$2', [eventId, creator]);
        if (rows.length < 1) {
            res.send({success: false});
            return;
        }
        const client = await db.getConnect();
        try {
            await client.query('BEGIN');
            await client.query('DELETE FROM participants WHERE event_id=$1', [eventId]);
            await client.query('DELETE FROM events WHERE event_id=$1', [eventId]);
            await client.query('COMMIT');
        } catch (e) {
            await client.query('ROLLBACK');
            console.error(e.stack);
            res.send({success: false});
            return;
        } finally {
            client.release();
        }
        res.send({success: true});
    }
}