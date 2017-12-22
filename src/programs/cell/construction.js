class Construction extends kernel.process {
    constructor(...args) {
        super(...args);
        this.priority = PRIORITIES_CONSTRUCTION;
    }

    main () {
        if (!Game.rooms[this.meta.room] || !Game.rooms[this.meta.room].controller.my || Game.constructionSites.length === 0) {
            return this.suicide();
        }

        let roomIndex = 0;

        for (let c of Game.constructionSites) {
            if (Game.constructionSites[c].room.name === this.meta.room) {
                roomIndex++;
            }
        }

        if (roomIndex === 0) {
            return this.suicide();
        }

        this.launchProcessWithCreep(`builder_creep_${this.room.name}`, 'builder', this.meta.room,
            Math.max(1, roomIndex % 5));
    }
}