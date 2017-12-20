class Respawn extends kernel.process {
    constructor (...args) {
        super(...args);
        this.priority = PRIORITIES_RESPAWN;
    }

    main () {
        if (Object.keys(Game.spawns).length > 0 || Object.keys(Game.creeps).length > 0) {
            return;
        }

        Logger.log('EVERYTHING IS DEAD, ABORT ABORT', LOG_FATAL);

        for (let roomname of Object.keys(Game.rooms)) {
            if (Game.rooms[roomname].controller && Game.rooms[roomname].controller.my) {
                Logger.log(`Unclaiming room ${roomname}`);
                Game.rooms[roomname].controller.unclaim();
            }
        }
        for (let siteID of Object.keys(Game.constructionSites)) {
            Game.constructionSites[siteID].remove();
        }
    }
}

module.exports = Respawn;