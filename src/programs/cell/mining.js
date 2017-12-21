const sourceInfo = require('lib_sourceInfo');

class Mining extends kernel.process {
    constructor(...args) {
        super(...args);
        this.priority = PRIORITIES_MINING;
    }

    main () {
        if (!Game.rooms[this.meta.room] || !Game.rooms[this.meta.room].controller.my) {
            return this.suicide();
        }

        if (!Memory.mining || !Memory.mining[this.meta.room]) {
            Memory.mining[this.meta.room] = {};
            for (let source of this.room.find(FIND_SOURCES)) {
                Memory.mining[this.meta.room].push(source.id, {'max': source.maximumMiningCreeps(), 'assigned': []});
                Logger.log(`Starting up Mining Program for ${source.id} with ${source.maximumMiningCreeps()} creeps`);
            }
        }

        this.room = Game.rooms[this.meta.room];

        let energySources = Memory.mining[this.meta.room];

        for (let s of energySources) {
            for (let c of energySources[s]['assigned']) {
                if (!Game.creeps[energySources[s]['assigned'][c]]) {
                    energySources[s]['assigned'] = energySources[s]['assigned'].splice(c, 1);
                }
            }
            let offset = energySources[s]['max'] - energySources[s]['assigned'].length;
            if (offset > 0) {
                this.launchProcessWithCreep(`${s}_mining_creep`, 'miner', energySources[s]['max'], {
                    'source': s
                });
                energySources[s]['assigned'] = Creep.findAssignedCreeps(s);
            }
        }

        Memory.mining[this.meta.room] = energySources;
    }
}

module.exports = Mining;