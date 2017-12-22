class Construction extends kernel.process {
    constructor(...args) {
        super(...args);
        this.priority = PRIORITIES_CONSTRUCTION;
    }

    getPriority () {
        return this.priority;
    }

    main () {
        if (!Game.rooms[this.meta.room] || !Game.rooms[this.meta.room].controller.my) {
            return this.suicide();
        }

        let roomIndex = 0;

        for (let c in Game.constructionSites) {
            if (Game.constructionSites[c].room.name === this.meta.room) {
                roomIndex++;
            }
        }

        if (roomIndex === 0) {
            return;
        }

        this.launchProcessWithCreep(`builder_creep_${this.meta.room}`, 'builder', this.meta.room,
            Math.max(1, Math.round(roomIndex / 5)));
    }
}

module.exports = Construction;