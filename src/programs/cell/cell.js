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
        this.launchChildProcess('spawns', 'cell_spawns');
        // For now, launch Miner for every source in room
        this.launchProcessWithCreep(`${this.meta.room}_miner`, 'miner', this.meta.room);
    }
}

module.exports = Cell;