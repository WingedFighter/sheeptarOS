const MetaRole = require('roles_meta');

class Miner extends MetaRole {
    constructor () {
        super();
    }

    getBuild() {
        return [WORK, CARRY, MOVE];
    }

    manageCreep (creep) {
        if (creep.ticksToLive < 50) {
            //TODO: Add recycle
        }

        if (creep.refill()) {
            return;
        }

        // TODO: Better miner behaivor (return to other structures based on economy)
        const spawn = creep.pos.findClosestByRange(FIND_MY_SPAWNS);
        if (spawn) {
            if (creep.pos.isNearTo(spawn)) {
                creep.transfer(spawn, RESOURCE_ENERGY);
            } else {
                creep.moveTo(spawn);
            }
        } else {
            const cont = creep.room.controller;
            if (cont.my && creep.pos.isNearTo(cont)) {
                creep.upgrade(cont);
            } else if (cont.my) {
                creep.moveTo(cont);
            }
        }
    }
}

module.exports = Miner;