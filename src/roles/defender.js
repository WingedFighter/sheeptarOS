const MetaRole = require('roles_meta');

class Defender extends MetaRole {
    constructor () {
        super();
    }

    getBuild () {
        return [ATTACK, MOVE];
    }

    manageCreep (creep) {

        // TODO: Better target selection
        const target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (!target) {
            // TODO: Add recycle
            return;
        }

        if (creep.pos.isNearTo(target)) {
            creep.attack(target);
        } else {
            creep.moveTo(target);
        }
    }
}

module.exports = Defender;