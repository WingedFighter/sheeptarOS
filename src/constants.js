if (!Memory.username) {
    Memory.username = 'wingedfighter';
}

global.USERNAME = Memory.username;

global.PRIORITIES_SPAWN = 3;
global.PRIORITIES_DEFAULT = 6;
global.PRIORITIES_UPGRADING = 7;
global.PRIORITIES_CELL = 7;
global.PRIORITIES_MINING = 7;
global.PRIORITIES_REPAIR = 8;
global.PRIORITIES_CONSTRUCTION = 8;
global.PRIORITIES_PLAYER = 8;
global.PRIORITIES_HAULING = 9;
global.PRIORITIES_MAINTENANCE = 12;
global.PRIORITIES_RESPAWN = 12;

global.SPAWN_DEFAULT_PRIORITY = 4;

global.PRIORITIES_DEFENSE_INITIALIZATION = 0;
global.PRIORITIES_CREEP_DEFAULT = 4;

global.MINERALS_EXTRACTABLE = [
    RESOURCE_HYDROGEN,
    RESOURCE_OXYGEN,
    RESOURCE_UTRIUM,
    RESOURCE_LEMERGIUM,
    RESOURCE_KEANIUM,
    RESOURCE_ZYNTHIUM,
    RESOURCE_CATALYST
];

global.ECONOMIC_LEVEL = {
    UNSTABLE : 0,
    DEVELOPING : 1,
    STABLE : 2,
    STRONG : 3,
    BURSTING : 4
};

// DEFCON 1 is safe, DEFCON 5 is imminent respawn
global.DEFCON = {
    ONE : 'ONE',
    TWO : 'TWO',
    THREE : 'THREE',
    FOUR : 'FOUR',
    FIVE : 'FIVE'
};

global.PRIORITIES_DEFENSE = {
    'ONE' : 3,
    'TWO' : 3,
    'THREE' : 2,
    'FOUR' : 1,
    'FIVE' : 0
};