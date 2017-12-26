class Upgrading extends kernel.process {
    constructor (...args) {
        super(...args);
        this.priority = PRIORITIES_UPGRADING;
    }

    getPriority () {
        return this.priority;
    }

    main () {
        if (!Game.rooms[this.meta.room]) {
            return this.suicide();
        }

        this.launchProcessWithCreep(`upgrader_creep_${this.meta.room}`, 'upgrader', this.meta.room, 1);
    }
}

module.exports = Upgrading;