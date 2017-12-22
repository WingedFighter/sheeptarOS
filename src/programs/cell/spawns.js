class Spawns extends kernel.process {
    constructor (...args) {
        super(...args);
        this.priority = PRIORITIES_SPAWN;
    }

    getPriority () {
        return this.priority;
    }

    main () {
        if (!Game.rooms[this.meta.room]) {
            return this.suicide();
        }

        this.room = Game.rooms[this.meta.room];
        const spawns = this.room.find(FIND_MY_SPAWNS);

        for (let spawn of spawns) {
            if (spawn.spawning) {
                continue;
            }

            if (spawn.spawnCreep(this.room.getQueuedCreepBuild(), 'Test', { dryRun: true }) !== 0) {
                continue;
            }

            const creep = this.room.getQueuedCreep();
            if (!creep) {
                break;
            }
            const result = spawn.createCreep(creep.build, creep.name, {memory: creep.memory}); //Need to add creep class
            if (Number.isInteger(result)) {
                Logger.log(`ERROR: ${result} while spawning creep in ${this.meta.room}`, LOG_ERROR);
            } else {
                Logger.log(`Spawning creep ${creep.name} with build ${creep.build} from ${this.meta.room}`);
            }
        }
    }
}

module.exports = Spawns;