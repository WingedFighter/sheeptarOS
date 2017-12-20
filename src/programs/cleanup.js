const TIMEOUT = 75000;

class Cleanup extends kernel.process {
    constructor (...args) {
        super(...args);
        this.priority = PRIORITIES_MAINTENANCE;
    }

    main () {
        if (!Memory.construction) {
            Memory.construction = {};
        }
        const sites = Object.keys(Memory.construction);
        for (let id of sites) {
            if (!Game.constructionSites[id]) {
                delete Memory.construction[id];
                continue;
            }

            if (Game.time - Memory.construction[id] >= TIMEOUT) {
                Game.constructionSites[id].remove()
            }
        }

        const siteIds = Object.keys(Game.constructionSites);
        for (let id of siteIds) {
            if (!Memory.construction[id]) {
                Memory.construction[id] = Game.time;
            }
        }
    }
}

module.exports = Cleanup;