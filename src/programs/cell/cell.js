class Cell extends kernel.process {
    constructor(...args) {
        super(...args);
        this.priority = PRIORITIES_CELL;
    }

    main () {
        if (!Game.rooms[this.meta.room] || !Game.rooms[this.meta.room].controller.my) {
            Room.removeCell(this.meta.room);
            return this.suicide();
        }
        this.room = Game.rooms[this.meta.room];

        const spawns = this.room.find(FIND_MY_SPAWNS);
        if (spawns.length <= 0) {
            // TODO: Add to code to make spawns
            Logger.log(`No Spawns exist in room ${this.meta.room}`, LOG_WARN);
            return;
        }

        // Since Spawns exist, launch spawn program for this room
        this.launchChildProcess(`${this.meta.room}_spawns`, 'cell_spawns');

        // Start Mining Process
        this.launchChildProcess(`${this.meta.room}_mining`, 'cell_mining');

        let economicLevel = Game.rooms[this.meta.room].getEconomicLevel();
        switch (economicLevel) {
            case ECONOMIC_LEVEL.UNSTABLE:
                break;
            case ECONOMIC_LEVEL.DEVELOPING:
                break;
            case ECONOMIC_LEVEL.STABLE:
                break;
            case ECONOMIC_LEVEL.STRONG:
                break;
            case ECONOMIC_LEVEL.BURSTING:
                break;
            default:
                break;
        }
    }
}

module.exports = Cell;