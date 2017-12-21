Room.prototype.getEconomicLevel = function () {
    // Basic for now, only based on total energy storage
    // Eventually change so that it tracks current amount mined per tick and
    // How long it takes to get from source to spawn/extension
    if (this.energyCapacityAvailable < 550) {
        return ECONOMIC_LEVEL.UNSTABLE;
    }
    if (this.energyCapacityAvailable < 1000) {
        return ECONOMIC_LEVEL.DEVELOPING;
    }
    if (this.energyCapacityAvailable < 5000) {
        return ECONOMIC_LEVEL.STABLE;
    }
    if (this.energyCapacityAvailable < 10000) {
        return ECONOMIC_LEVEL.STRONG;
    }
    return ECONOMIC_LEVEL.BURSTING;
};