class Mining extends kernel.process {
    constructor (...args) {
        super(...args);
        this.priority = PRIORITIES_MINING;
    }

    getPriority () {
        return this.priority;
    }

    main () {
        if (!Game.rooms[this.meta.room] || !Game.rooms[this.meta.room].controller.my) {
            return this.suicide();
        }

        if (!Memory.mining) {
            Memory.mining = {};
        }

        this.room = Game.rooms[this.meta.room];

        if (!Memory.mining[this.meta.room]) {
            Memory.mining[this.meta.room] = {};
        }

        for (let source of this.room.find(FIND_SOURCES)) {
            Memory.mining[this.meta.room][source.id] = {'max': source.maximumMiningCreeps(), 'assigned': []};
            Logger.log(`Starting up Mining Program for ${source.id} with ${source.maximumMiningCreeps()} creeps`, LOG_TRACE);
            this.launchProcessWithCreep(`mining_creep_${source.id}`, 'miner', this.meta.room,
                Memory.mining[this.meta.room][source.id]['max'], {'source': source.id});
        }
    }
}

module.exports = Mining;