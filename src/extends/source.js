Source.prototype.validMiningLocations = function() {
    this.validLocations = [];
    for (let x = -1; x < 2; x++) {
        for (let y = -1; y < 2; y++) {
            this.validLocations.push(this.room.lookForAt(LOOK_TERRAIN, this.pos.x + x, this.pos.y + y).length === 0);
        }
    }
    return this.validLocations;
};

Source.prototype.maximumMiningCreeps = function () {
    this.validMiningLocations();

    let max = 0;

    for (let valid of this.validLocations) {
        if (valid) {
            max++;
        }
    }

    return max;
};