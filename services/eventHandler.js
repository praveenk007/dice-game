class EventHandler {
    constructor(event) {
        this._event = event;
    }

    processEvent(query) {
        this._event.processEvent(query);
    }

    get result() {
        return this._event.result;
    }
}

module.exports = EventHandler