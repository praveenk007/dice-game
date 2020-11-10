const { sessions } = require('./inMemory');

var sessionData = require('./inMemory').sessions;

class SessionHandler {

    get(session_id) {
        return sessionData[session_id];
    }

    add(session_id, session) {
        sessionData[session_id] = session;
        console.log(`session ${session_id} created`)
    }

    update(session_id, patch) {
        let session = this.get(session_id);
        for(var key in patch) {
            session[key] = patch[key];
        }
        console.log(this.get(session_id));
    }

    remove(session_id) {
        delete sessionData[session_id];
    }
}

module.exports = SessionHandler;