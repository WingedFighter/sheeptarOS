global.BUCKET_EMERGENCY = 1000;
global.BUCKET_FLOOR = 2000;
global.BUCKET_CEILING = 9500;


const LAST_RESET = Game.time;
const CPU_MINIMUM = 0.6;
const CPU_BUFFER = 10;
const CPU_ADJUST = 0.05;
const CPU_RESET_BOOST = 60;
const SIMULATION_TICKS = 1000;

class Kernel {
    constructor() {
        global.kernel = this;

        if (!Memory.sos) {
            Memory.sos = {};
        }

        this.newreset = LAST_RESET === Game.time;

        if (this.tickCPULimit() === 0) {
            // Something to do with Emergency Stop
        }
    }

    tickCPULimit () {
        if (!Game.cpu.limit) {
            this.limit = SIMULATION_TICKS;
        }else if (Game.cpu.bucket < BUCKET_EMERGENCY) {
            this.limit = 0;
        }else if (Game.cpu.bucket < BUCKET_FLOOR) {
            this.limit = Game.cpu.limit * CPU_MINIMUM;
        } else if (Game.cpu.bucket > BUCKET_CEILING) {
            this.limit = Game.cpu.tickLimit - CPU_BUFFER;
        } else {
            const bucketRange = BUCKET_CEILING - BUCKET_FLOOR;
            const depthInRange = (Game.cpu.bucket - BUCKET_FLOOR) / bucketRange;
            const minToAllocate = Game.cpu.limit * CPU_MINIMUM;
            const maxToAllocate = Game.cpu.limit;
            this.limit = (minToAllocate + this.sigmoidSkewed(depthInRange) * (maxToAllocate - minToAllocate)) * (1 - CPU_ADJUST);
            if (this.newreset) {
                this.limit += CPU_RESET_BOOST;
            }
        }
        return this.limit;
    }

    start () {

    }

    cleanUp () {

    }

    run () {

    }

    shutdown () {

    }

    static sigmoid (x) {
        return 1.0 / (1.0 + Math.exp(-x));
    }

    static sigmoidSkewed (x) {
        return this.sigmoid((x * 12.0) - 6.0);
    }
}

module.exports = Kernel;