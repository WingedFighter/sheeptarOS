const MAX_CID = 99999;

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

Room.prototype.getNextCreepID = function(role) {
    if (!Memory.sos.lastCID) {
        Memory.sos.lastCID = 0;
    }

    while (true) {
        Memory.sos.lastCID++;
        if (Memory.sos.lastCID > MAX_CID) {
            Memory.sos.lastCID = 0;
        }
        if (Game.creeps[(role + '_' + this.name + '_' + Memory.sos.lastCID).toString()]) {
            continue;
        }
        return Memory.sos.lastCID;
    }
};

Room.prototype.queueCreep = function (role, options = {}) {
    const name = (role + '_' + this.name + '_' + this.getNextCreepID(role)).toString();

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

Room.prototype.isQueued = function (name) {
    if (!Memory.spawnqueue || !Memory.spawnqueue.index || !Memory.spawnqueue.index[this.name]) {
        return false;
    }
    if (Memory.spawnqueue.index[this.name][name]) {
        return true;
    }
    return !!this.queued && this.queued.indexOf(name) >= 0;
};

// This version can be called without an object having to be created
Room.isQueued = function (name) {
    if (!Memory.spawnqueue || !Memory.spawnqueue.index) {
        return false;
    }
    const spawnrooms = Object.keys(Memory.spawnqueue.index);
    for (let room of spawnrooms) {
        if (Game.rooms[room] && Game.rooms[room].isQueued(name)) {
            return true;
        }
    }
    return false;
};

Room.prototype.getQueuedCreepBuild = function () {
    if (!Memory.spawnqueue || !Memory.spawnqueue.index || !Memory.spawnqueue.index[this.name]) {
        return false;
    }

    const creeps = Object.keys(Memory.spawnqueue.index[this.name]);
    if (creeps.length < 1) {
        return false;
    }

    const that = this;
    creeps.sort(function (a, b) {
        const aP = Memory.spawnqueue.index[that.name][a].priority ? Memory.spawnqueue.index[that.name][a].priority : SPAWN_DEFAULT_PRIORITY;
        const bP = Memory.spawnqueue.index[that.name][b].priority ? Memory.spawnqueue.index[that.name][b].priority : SPAWN_DEFAULT_PRIORITY;
        return aP - bP;
    });

    return Memory.spawnqueue.index[this.name][creeps[0]].build;

};


Room.prototype.getQueuedCreep = function() {
    if (!Memory.spawnqueue || !Memory.spawnqueue.index || !Memory.spawnqueue.index[this.name]) {
        return false;
    }

    const creeps = Object.keys(Memory.spawnqueue.index[this.name]);
    if (creeps.length < 1) {
        return false;
    }

    const that = this;
    creeps.sort(function (a, b) {
        const aP = Memory.spawnqueue.index[that.name][a].priority ? Memory.spawnqueue.index[that.name][a].priority : SPAWN_DEFAULT_PRIORITY;
        const bP = Memory.spawnqueue.index[that.name][b].priority ? Memory.spawnqueue.index[that.name][b].priority : SPAWN_DEFAULT_PRIORITY;
        return aP - bP;
    });

    const options = {};
    options.memory = Memory.spawnqueue.index[this.name][creeps[0]];
    const role = Creep.getRole(options.memory.role);
    options.build = role.getBuild();
    options.name = creeps[0];

    if (!this.queued) {
        this.queued = [];
    }
    this.queued.push(options.name);
    delete Memory.spawnqueue.index[this.name][creeps[0]];
    return options;
};

Room.prototype.getDEFCON = function () {
    const hostileCreeps = this.find(FIND_HOSTILE_CREEPS);
    const hostileConstruction = this.find(FIND_HOSTILE_CONSTRUCTION_SITES);
    const hostileSpawns = this.find(FIND_HOSTILE_SPAWNS);
    const hostileStructures = this.find(FIND_HOSTILE_STRUCTURES);

    if (hostileCreeps.length === 0 && hostileConstruction.length === 0 && hostileSpawns.length === 0 && hostileStructures.length === 0) {
        return DEFCON.ONE;
    } else if (hostileConstruction.length === 0 && hostileSpawns.length === 0 && hostileStructures.length === 0) {
        return DEFCON.TWO;
    } else if (hostileStructures.length === 0 && hostileSpawns.length === 0) {
        return DEFCON.THREE;
    } else  if (hostileSpawns.length === 0) {
        return DEFCON.FOUR;
    } else {
        return DEFCON.FIVE;
    }

};