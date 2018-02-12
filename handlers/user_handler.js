const db = require('../db');

async function checkExistense(login) {
    const { rows } = await db.query('SELECT * FROM users WHERE login=$1', [login]);
    return rows.length === 1;
}

module.exports = {
    signup: async (req, res) => {
        const { firstname, lastname, login, password } = req.body;
        if (await checkExistense(login)) {
            res.send("Login is already taken");
            return;
        };
        try {
            await db.query('INSERT INTO users (firstname, lastname, login, password) VALUES ($1, $2, $3, $4)', [firstname, lastname, login, password]);
        } catch (e) {
            console.error(e.stack);
            res.send({success: false});
            return;
        }
        res.send({success: true});
    },

    signin: async (req, res) => {
        const { login, password } = req.body;
        if (!(await checkExistense(login))) {
            res.send(`There is no user with login ${login}`);
            return;
        }
        const { rows } = await db.query('SELECT * FROM users WHERE login=$1 and password=$2', [login, password]);
        if (rows.length > 0) {
            res.send({success: true});
            return;
        }
        res.send({success: false});
    },

    getUsers: async (req, res) => {
        const { q: mask}  = req.query;
        const { rows } = await db.query(`SELECT * FROM users WHERE login like '%${mask}%'`);
        res.send(rows);
    }
}