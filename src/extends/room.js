Room.getCells = function () {
    if (!Memory.cellList || Object.keys(Memory.cellList).length < 0) {
        Memory.cellList = {};
        for (let roomname of Object.keys(Game.rooms)) {
            const room = Game.rooms[roomname];
            if (room.controller && room.controller.my) {
                Memory.cellList[roomname] = {};
            }
        }
    }

    return Object.keys(Memory.cellList);
};

Room.removeCell = function(roomname) {
    if (Memory.cellList &&  Memory.cellList[roomname]) {
        delete Memory.cellList[roomname];
        Logger.log(`Removing cell ${roomname}`);
    }
};

Room.prototype.queueCreep = function (role, options = {}) {
    const name = (role + '_' + (new Date().getTime())).toString();

    if (!options.priority) {
        options.priority = SPAWN_DEFAULT_PRIORITY;
    }

    if (!Memory.spawnqueue) {
        Memory.spawnqueue = {};
    }

    if (!Memory.spawnqueue.index) {
        Memory.spawnqueue.index = {};
    }

    if (!Memory.spawnqueue.index[this.name]) {
        Memory.spawnqueue.index[this.name] = {};
    }
    options.role = role;
    Memory.spawnqueue.index[this.name][name] = options;
    return name;
};