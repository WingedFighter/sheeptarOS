const Scheduler = require('sos_scheduler');
const Process = require('sos_process');

global.BUCKET_EMERGENCY = 1000;
global.BUCKET_FLOOR = 2000;
global.BUCKET_CEILING = 9500;


const LAST_RESET = Game.time;
const CPU_MINIMUM = 0.6;
const CPU_BUFFER = 10;
const CPU_ADJUST = 0.05;
const CPU_RESET_BOOST = 60;
const SIMULATION_TICKS = 1000;
const MINIMUM_PROGRAMS = 0.3;
const PROGRAM_NORMALIZING_BURST = 2;

class Kernel {
    constructor() {
        global.kernel = this;

        if (!Memory.sos) {
            Memory.sos = {};
        }

        this.newreset = LAST_RESET === Game.time;
        this.simulation = !!Game.rooms['sim'];
        this.scheduler = new Scheduler();
        this.process = Process;

        this.tickCPULimit();
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

    canContinue() {
        if (this.simulation) {
            return true;
        }

        let current = Game.cpu.getUsed();

        if (current >= Game.cpu.tickLimit - CPU_BUFFER) {
            return false;
        }

        if (current < this.limit) {
            return true;
        }

        if (Game.cpu.bucket > BUCKET_FLOOR) {
            const total = this.scheduler.getProcessCount();
            const completed = this.scheduler.getCompletedProcessCount();
            if (completed / total < MINIMUM_PROGRAMS) {
                if (current < this.limit * PROGRAM_NORMALIZING_BURST) {
                    return true;
                }
            }
        }

        return false;
    }

    start () {
        Logger.log(`Initializing Kernel for tick ${Game.time}`, LOG_TRACE, 'kernel');
        if(!Memory.SCRIPT_VERSION || Memory.SCRIPT_VERSION !== SCRIPT_VERSION) {
            Logger.log(`New script upload detected: ${SCRIPT_VERSION}`, LOG_WARN);
            Memory.SCRIPT_VERSION = SCRIPT_VERSION;
            Memory.SCRIPT_UPLOAD = Game.time;
        }

        if (Game.time % 7 === 0) {
            this.cleanUp();
        }

        this.scheduler.shift();

        if (this.scheduler.getProcessCount() <= 0) {
            this.scheduler.launchProcess('player');
        }
    }

    cleanUp () {
        Logger.log('Cleaning memory', LOG_TRACE, 'kernel');
        let i;
        for (i in Memory.creeps) { // jshint ignore:line
            if (!Game.creeps[i]) {
                delete Memory.creeps[i];

            }
            /*
            // if process with name creep and meta tag with matching creep does not exist
            const creepProcesses = Memory.sos.processTable.index.filter(
                function (data) {
                    return data.n === 'creep' && data.m.creep === i;
                }
            );

            if (!creepProcesses || creepProcesses.length <= 0) {
                Game.creeps[i].recycle();
            }*/
        }
        // Clean elsewhere
    }

    run () {
        while(this.canContinue()) {
            const currentProcess = this.scheduler.getNextProcess();
            if (!currentProcess) {
                return;
            }
            Logger.defaultLogGroup = currentProcess.name;
            try {
                let name = currentProcess.name;
                Logger.log(`Running ${name} (pid ${currentProcess.pid})`, LOG_TRACE, 'kernel');
                currentProcess.run();
            } catch (e) {
                let message = 'Program Error Occurred\n';
                message += `process ${currentProcess.pid}: ${currentProcess.name}\n`;
                message += !!e && !!e.stack ? e.stack : e.toString();
                Logger.log(message, LOG_ERROR);
            }
            Logger.defaultLogGroup = 'default';
        }
    }

    shutdown () {
        const processCount = this.scheduler.getProcessCount();
        const completedCount = this.scheduler.memory.processTable.completed.length;

        Logger.log(`Processes Run: ${completedCount}/${processCount}`, LOG_INFO, 'kernel');
        Logger.log(`Tick Limit: ${Game.cpu.tickLimit}`, LOG_INFO, 'kernel');
        Logger.log(`Kernel Limit: ${this.limit}`, LOG_INFO, 'kernel');
        Logger.log(`CPU Used: ${Game.cpu.getUsed()}`, LOG_INFO, 'kernel');
        Logger.log(`Bucket: ${Game.cpu.bucket}`, LOG_INFO, 'kernel');

        Memory.runPercent = (completedCount/processCount).toFixed(4) * 100;
        Memory.tickLimit = Game.cpu.tickLimit;
        Memory.kernelLimit = this.limit;
        Memory.cpuUsed = Game.cpu.getUsed();
        Memory.bucket = Game.cpu.bucket;

    }

    static sigmoid (x) {
        return 1.0 / (1.0 + Math.exp(-x));
    }

    static sigmoidSkewed (x) {
        return this.sigmoid((x * 12.0) - 6.0);
    }
}

module.exports = Kernel;