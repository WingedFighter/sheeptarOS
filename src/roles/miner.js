const MetaRole = require('roles_meta');

class Miner extends MetaRole {
    constructor () {
        super();
    }

    getBuild() {
        return ['WORK', 'CARRY', 'MOVE'];
    }

    manageCreep (creep) {
        if (creep.ticksToLive < 50) {
            //TODO: Add recycle
        }

        let refill;
        if (!creep.memory.isRefilling) {
            refill = creep.memory.isRefilling = false;
        }
        if (!refill && creep.carry.energy === 0) {
            refill = true;
        }
        if (refill && creep.carry.energy === creep.carryCapacity) {
            refill = false;
        }
        if (refill) {
            let target = creep.pos.findClosestByPath(FIND_SOURCES);
            if (creep.harvest(target) === ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
        } else {
            let spawn = creep.pos.findClosestByPath(FIND_MY_SPAWNS);
            if (spawn.energy < spawn.energyCapacity) {
                if (creep.transfer(spawn, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            } else {
                if (creep.upgrade(creep.room.controller) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller);
                }
            }
        }
    }
}

module.exports = Miner;