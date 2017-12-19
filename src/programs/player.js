// Top level program
const PRIORITIES_PLAYER = 1;
class Player extends kernel.process {
    constructor(...args) {
        super(...args);
        this.priority = PRIORITIES_PLAYER;
    }

    main () {

    }
}

module.exports = Player;