class Cell extends kernel.process {
    constructor(...args) {
        super(...args);
        this.priority = PRIORITIES_CELL;
    }

    getPriority () {
        return this.priority;
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
        this.launchChildProcess(`spawns_${this.meta.room}`, 'cell_spawns', {
            'room': this.room.name
        });

        // Start Mining Process
        this.launchChildProcess(`mining_${this.meta.room}`, 'cell_mining', {
            'room': this.room.name
        });

        this.launchChildProcess(`construction_${this.meta.room}`, 'cell_construction', {
            'room': this.room.name
        });

        this.launchChildProcess(`repair_${this.meta.room}`, 'cell_repair', {
            'room': this.room.name
        });

        const containers = this.room.find(FIND_MY_STRUCTURES, {filter: function (structure) {
                return structure.structureType === STRUCTURE_CONTAINER
            }});

        if (containers && containers.length > 0) {
            this.launchProcessWithCreep(`hauler_creep_${this.meta.room}`, 'hauler', this.meta.room,
                Math.max(1, Math.round(containers.length / 2)));
        }

        if (this.room.getDEFCON() === DEFCON.ONE) {
            return;
        }

        this.launchChildProcess(`defense_${this.meta.room}`, 'cell_defense', {
            'room': this.room.name
        });
    }
}

module.exports = Cell;