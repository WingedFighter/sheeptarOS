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