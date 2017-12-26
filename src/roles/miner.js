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

    findTarget (creep) {
        const spawn = creep.pos.findClosestByRange(FIND_MY_SPAWNS, {filter: function (structure) {
                return structure.energy < structure.energyCapacity
            }});
        if (spawn) {
            this.isSpawn = true;
            return spawn;
        }
        const ext = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
            filter: function (structure) {
                return structure.structureType === STRUCTURE_EXTENSION && structure.energy < structure.energyCapacity
            }
        });
        if (ext) {
            this.isSpawn = true;
            return ext;
        }
        const container = creep.pos.findClosestByRange(FIND_STRUCTURES, {filter: function (structure) {
                return structure.structureType === STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] < structure.storeCapacity
            }});
        if (container) {
            this.isSpawn = false;
            return container;
        }

        return false;
    }

    manageCreep (creep) {
        if (creep.ticksToLive < 50) {
            creep.recycle();
            return;
        }

        if (this.refill(creep)) {
            return;
        }

        // TODO: Better miner storage (return to other structures based on economy)
        const target = this.findTarget(creep);
        if (!this.isSpawn) {
            if (target && target.store[RESOURCE_ENERGY] < target.storeCapacity) {
                if (creep.pos.isNearTo(target)) {
                    creep.transfer(target, RESOURCE_ENERGY);
                } else {
                    creep.moveTo(target);
                }
            } else {
                creep.upgradeAtController();
            }
        } else {
            if (target && target.energy < target.energyCapacity) {
                if (creep.pos.isNearTo(target)) {
                    creep.transfer(target, RESOURCE_ENERGY);
                } else {
                    creep.moveTo(target);
                }
            } else {
                creep.upgradeAtController();
            }
        }
    }
}

module.exports = Miner;