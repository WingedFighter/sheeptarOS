const MetaRole = require('roles_meta');

class Builder extends MetaRole {
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

        // TODO: Better target selection
        const target = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
        if (!target) {
            return;
        }

        if (creep.pos.isNearTo(target)) {
            creep.build(target);
        } else {
            creep.moveTo(target);
        }
    }
}

module.exports = Builder;