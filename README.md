# user-event-sample

There is backend part of application which is positioned as calendar of user events.
Steps to launch application:
1. Intall npm manager.
2. Intall postgresql.
3. Create new database "task".
4. Apply next scripts for database "task".

```shell
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE users (  
   user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
   firstname TEXT,
   lastname TEXT,
   login TEXT,
   password TEXT
);

CREATE TABLE events ( 
  event_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title text,
  description text,
  from_date timestamp with time zone,
  to_date timestamp with time zone,
  creator_id UUID, 
  constraint fk_events_users
     foreign key (creator_id) 
     REFERENCES users (user_id)
);

CREATE TABLE participants ( 
  user_id UUID,
  event_id UUID,
  constraint fk_participants_users
     foreign key (user_id) 
     REFERENCES users (user_id),
  constraint fk_participants_events
     foreign key (event_id) 
     REFERENCES events (event_id)
);
```
5. Change password for postgres user in file config.js.
6. Run next commands in terminal in project folder:
```shell
npm i
npm start
```

You can work with app using browser for GET requests and specific utils for other types (curl, httpie).

# List of endpoints:
* POST /signup - create user
```shell
{
  firstname,
  lastname,
  login,
  password
}
```
* POST /signin - enter in application as a user
```shell
{
  login,
  password
}
```
* GET /users?q={q} - user search by login (if "q" is a substring of login,
then output the user)
* POST /events - add event
```shell
{
  title,
  description,
  fromDate,
  toDate,
  participantsIds: [] // user ids, who were added to current event
}
```
* GET /events?from_date={from_date}&to_date={to_date} - event list of user,
which he created himself or to which he was added. Search by date (date format
can be in ISO 8601)
* DELETE /events/{eventId} - Only creator can delete event.

# Examples of curl commands:
* signup:
curl -d '{"firstname":"John", "lastname":"Doe", "login":"jd", "password":"1234"}' -H "Content-Type: application/json" -XPOST "http://localhost:4000/signup"
* signin:
curl -d '{"login":"jd", "password":"1234"}' -H "Content-Type: application/json" -XPOST "http://localhost:4000/signin"

* addEvent:
curl -d '{"creator":"1b5b4c50-75e7-42d5-b77b-093d18d6daec", "title":"some event", "description": "event desc", "fromDate": "2018-05-16 15:36:38", "toDate": "2018-06-16 15:36:38", "participants": ["7d497f2b-99d8-4aec-8764-873cdba1b691", "cf0a325b-37f9-4ec3-b3a9-6ee94e65f7e6", "d3d97587-ed9a-4d05-ba34-d038fa1c9725"]}' -H "Content-Type: application/json" -XPOST "http://localhost:4000/events"
* removeEvent:
curl -d '{"creator":"1b5b4c50-75e7-42d5-b77b-093d18d6daec"}' -H "Content-Type: application/json" -XDELETE "http://localhost:4000/events/fbe24796-2153-493d-b591-71f957d7448c"
* getEvents:
localhost:4000/events?from_date='2018-05-16 15:36:38'&to_date='2018-06-16 15:36:38'&creator=1b5b4c50-75e7-42d5-b77b-093d18d6daec

# TODO:
1. There is no mechanism to identify user who send requests (jwt, cookies ... etc).
2. Needs to add checking for from-to dates. They have to be in appropriate order.
3. Potential danger is sql-injections via requests. Needs to look at orm decisions.
