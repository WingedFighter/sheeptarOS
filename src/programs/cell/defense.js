class Defense extends kernel.process {
    constructor (...args) {
        super(...args);
        this.priority = PRIORITIES_DEFENSE_INITIALIZATION;
    }

    getPriority () {
        return this.priority;
    }

    main () {
        this.room = Game.rooms[this.meta.room];

        if (!this.room || !this.room.controller.my) {
            return this.suicide();
        }

        this.DEFCON = this.room.getDEFCON();
        this.priority = PRIORITIES_DEFENSE[this.DEFCON];

        if (this.DEFCON === DEFCON.ONE) {
            return this.suicide();
        }

        const hostileCreeps = this.room.find(FIND_HOSTILE_CREEPS);

        // Only responds to hostile creeps atm
        switch (this.DEFCON) {
            case DEFCON.ONE:
            case DEFCON.TWO:
            case DEFCON.THREE:
            case DEFCON.FOUR:
            case DEFCON.FIVE:
                this.launchProcessWithCreep(`defense_creep_${this.meta.room}`, 'defender', this.meta.room,
                    Math.max(Math.round(hostileCreeps.length / 2), 1), {priority: 1});
                break;
        }
    }
}

module.exports = Defense;