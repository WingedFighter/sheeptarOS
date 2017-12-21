class CreepDirector extends kernel.process {
    constructor (...args) {
        super(...args);
    }

    main () {
        if (!Game.creeps[this.meta.creep]) {
            if (!Room.isQueued(this.meta.creep)) {
                this.suicide();
            }
            return;
        }

        const creep = Game.creeps[this.meta.creep];
        if (creep.spawning) {
            return;
        }

        const role = creep.getRole();
        role.manageCreep(creep);
    }
}

module.exports = CreepDirector;