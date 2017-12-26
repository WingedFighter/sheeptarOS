const MetaRole = require('roles_meta');

class Upgrader extends MetaRole{
    constructor () {
        super();
    }

    getBuild () {
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

        creep.upgradeAtController();
    }
}

module.exports = Upgrader;