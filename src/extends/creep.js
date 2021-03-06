Creep.getRole = function (roleName) {
    let Role = require('roles_' + roleName);
    return new Role();
};

Creep.getRoleFromName = function (creepName) {
    return Creep.getRole(creepName.split('_', 1)[0]);
};

Creep.findAssignedCreeps = function (id) {
    return _.filter(Object.keys(Game.creeps), function(o) {
        if (o.includes(id)) return o;
    });
};

Creep.prototype.getRole = function () {
    let roleType = this.memory.role ? this.memory.role : this.name.split('_', 1)[0];
    return Creep.getRole(roleType);
};

Creep.prototype.upgradeAtController = function () {
    const target = this.room.controller;

    if (this.pos.isNearTo(target)) {
        this.upgradeController(target);
    } else {
        this.moveTo(target);
    }
};

Creep.prototype.recycle = function () {
    const spawn = this.pos.findClosestByRange(FIND_STRUCTURES, {filter: function (structure) {
            return structure.structureType === STRUCTURE_SPAWN;
        }});
    if (!spawn) {
        this.suicide();
        return;
    }
    if (this.pos.isNearTo(spawn.pos)) {
        spawn.recycleCreep(this);
    } else {
        this.moveTo(spawn);
    }
};

Creep.prototype.refill = function () {
    if (this.carry[RESOURCE_ENERGY] <= 0) {
        this.memory.refill = true;
    }
    if (this.carry[RESOURCE_ENERGY] === this.carryCapacity) {
        delete this.memory.refill;
    }
    if (!this.memory.refill) {
        return false;
    }

    // Check for storage or terminal

    // Check for dropped energy
    const drops = this.room.find(FIND_DROPPED_RESOURCES, {filter: function (resource) {
            return resource.resourceType === RESOURCE_ENERGY;
        }});

    if (drops.length > 0) {
        const target = this.pos.findClosestByRange(drops);
        if (this.pos.isNearTo(target)) {
            this.pickup(target);
        } else {
            this.moveTo(target);
        }
        return true;
    }

    // Check for containers
    const container = this.pos.findClosestByRange(FIND_STRUCTURES, {filter: function (structure) {
            return structure.structureType === STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] > 0
        }});
    if (container) {
        if (this.pos.isNearTo(container)) {
            this.withdraw(container, RESOURCE_ENERGY);
        }
    }

    // Harvest
    const source = this.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
    if (source && this.getActiveBodyparts(WORK) > 0) {
        if (this.pos.isNearTo(source)) {
            this.harvest(source);
        } else {
            this.moveTo(source);
        }
        return true;
    }

    return true;
};