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

        const target = creep.room.controller;

        if (creep.pos.isNearTo(target)) {
            creep.upgradeController(target);
        } else {
            creep.moveTo(target);
        }
    }
}

module.exports = Upgrader;