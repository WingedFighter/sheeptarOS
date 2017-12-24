const MetaRole = require('roles_meta');

class Miner extends MetaRole {
    constructor () {
        super();
    }

    getBuild() {
        return [WORK, CARRY, MOVE];
    }

    refill (creep) {
        if (creep.carry[RESOURCE_ENERGY] <= 0) {
            creep.memory.refill = true;
        }
        if (creep.carry[RESOURCE_ENERGY] === creep.carryCapacity) {
            delete creep.memory.refill;
        }
        if (!creep.memory.refill) {
            return false;
        }

        const source = Game.getObjectById(creep.memory.source);
        if (source) {
            if (creep.pos.isNearTo(source)) {
                creep.harvest(source);
            } else {
                creep.moveTo(source);
            }
            return true;
        }
        return true;
    }

    manageCreep (creep) {
        if (creep.ticksToLive < 50) {
            creep.recycle();
        }

        if (this.refill(creep)) {
            return;
        }

        // TODO: Better miner storage (return to other structures based on economy)
        const spawn = creep.pos.findClosestByRange(FIND_MY_SPAWNS);
        if (spawn && spawn.energy < spawn.energyCapacity) {
            if (creep.pos.isNearTo(spawn)) {
                creep.transfer(spawn, RESOURCE_ENERGY);
            } else {
                creep.moveTo(spawn);
            }
        } else {
            const cont = creep.room.controller;
            if (cont.my && creep.pos.isNearTo(cont)) {
                creep.upgradeController(cont);
            } else if (cont.my) {
                creep.moveTo(cont);
            }
        }
    }
}

module.exports = Miner;