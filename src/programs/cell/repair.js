class Repair extends kernel.process {
    constructor (...args) {
        super(...args);
        this.priority = PRIORITIES_REPAIR;
    }

    getPriority () {
        return this.priority;
    }

    main () {
        this.room = Game.rooms[this.meta.room];

        if (!this.room || !this.room.controller.my) {
            return this.suicide();
        }

        const repairList = this.room.find(FIND_STRUCTURES, {filter: function (structure) {
                return structure.my && structure.hits < structure.hitsMax;
            }});
        if (repairList && repairList.length > 0) {
            this.launchProcessWithCreep(`repairer_creep_${this.meta.room}`, 'repairer', this.meta.room,
                Math.max(1, Math.round(repairList.length / 10)));
        }
    }
}

module.exports = Repair;