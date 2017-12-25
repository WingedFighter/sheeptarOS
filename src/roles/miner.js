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
        const container = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {filter: function (structure) {
                return structure.structureType === STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] < structure.storeCapacity
            }});
        const spawn = creep.pos.findClosestByRange(FIND_MY_SPAWNS);
        if (container && spawn && container.pos.getRangeTo(creep.pos) - spawn.pos.getRangeTo(creep.pos) > 0) {
            this.isSpawn = false;
            return container;
        } else {
            this.isSpawn = true;
            if (spawn.energy < spawn.energyCapacity) {
                return spawn;
            } else {
                return creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
                    filter: function (structure) {
                        return structure.structureType === STRUCTURE_EXTENSION && structure.energy < structure.energyCapacity
                    }
                });
            }
        }
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
                const cont = creep.room.controller;
                if (cont.my && creep.pos.isNearTo(cont)) {
                    creep.upgradeController(cont);
                } else if (cont.my) {
                    creep.moveTo(cont);
                }
            }
        } else {
            if (target && target.energy < target.energyCapacity) {
                if (creep.pos.isNearTo(target)) {
                    creep.transfer(target, RESOURCE_ENERGY);
                } else {
                    creep.moveTo(target);
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
}

module.exports = Miner;