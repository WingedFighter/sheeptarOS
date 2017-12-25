const MetaRole = require('role_meta');

class Repairer extends MetaRole {
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

        const target = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, { filter: function (structure) {
                return structure.hits < structure.hitsMax;
            }});
        if (!target) {
            creep.recycle();
            return;
        }
        if (creep.pos.isNearTo(target)) {
            creep.repair(target);
        } else {
            creep.moveTo(target);
        }
    }
}

module.exports = Repairer;