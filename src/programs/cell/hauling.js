class Hauling extends kernel.process {
    constructor (...args) {
        super(...args);
        this.priority = PRIORITIES_HAULING;
    }

    getPriority () {
        return this.priority;
    }

    main () {
        if (!Game.rooms[this.meta.room]) {
            return this.suicide();
        }

        const containers = Game.rooms[this.meta.room].find(FIND_STRUCTURES, {filter: function (structure) {
                return structure.structureType === STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] > 0
            }});

        this.launchProcessWithCreep(`hauler_creep_${this.meta.room}`, 'hauler', this.meta.room,
            Math.max(1, Math.round(containers.length / 2)));
    }
}

module.exports = Hauling;