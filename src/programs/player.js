// Top level program
class Player extends kernel.process {
    constructor(...args) {
        super(...args);
        this.priority = PRIORITIES_PLAYER;
    }

    getPriority () {
        return this.priority;
    }

    main () {
        // Launch Respawner
        this.launchChildProcess('respawn', 'respawn');

        // Launch Memory Cleanup (remove old construction sites)
        this.launchChildProcess('cleanup', 'cleanup');

        // Get a list of cells
        const cells = Room.getCells();
        // Launch Cell program for each cell, in the future this will also be where to handle clusters
        for (let roomname of cells) {
            if (Game.rooms[roomname] && Game.rooms[roomname].controller && Game.rooms[roomname].controller.my) {
                this.launchChildProcess(`room_${roomname}`, 'cell_cell', {
                    'room': roomname
                });
            }
        }
    }
}

module.exports = Player;