const MetaRole = require('roles_meta');

class Hauler extends MetaRole {
    constructor () {
        super();
    }

    getBuild() {
        return [WORK, CARRY, MOVE];
    }

    manageCreep (creep) {
        if (creep.ticksToLive < 50) {
            creep.recycle();
            return;
        }

        if (creep.refill()) {
            return;
        }

        if (creep.room.energyAvailable < creep.room.energyCapacityAvailable) {
            const target = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {filter: function (structure) {
                    return (structure.structureType === STRUCTURE_EXTENSION || structure.structureType === STRUCTURE_SPAWN) &&
                        structure.energy < structure.energyCapacity
                }});
            if (!target) {
                creep.recycle();
                return;
            }
            if (creep.pos.isNearTo(target)) {
                creep.transfer(target, RESOURCE_ENERGY);
            } else {
                creep.moveTo(target);
            }
        }
    }
}