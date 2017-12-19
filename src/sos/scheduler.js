global.DEFAULT_PRIORITY = 6;

const MAX_PRIORITY = 16;
const MAX_PID = 9999999;
const WALL = 9;

class Scheduler {
    constructor() {
        if (!Memory.sos.scheduler) {
            Memory.sos.scheduler = {};
        }
        this.memory = Memory.sos.scheduler;

        this.processCache = {};
        if (!this.memory.processTable) {
            this.memory.processTable = {
                'index': {},
                'running': false,
                'completed': [],
                'queues': {}
            }
        }
    }

    shift() {
        for (let x = 0; x <= MAX_PRIORITY; x++) {
            // Merge at lowest
            if (x === 0 || x === WALL) {
                if (!this.memory.processTable.queues[x]) {
                    this.memory.processTable.queues[x] = [];
                }
                if (this.memory.processTable.queues[x + 1]) {
                    this.memory.processTable.queues[x] = this.memory.processTable.queues[x].concat(
                        this.memory.processTable.queues[x + 1]
                    );
                }
                continue;
            }

            // Don't merge from above to below
            if ((x + 1) === WALL) {
                continue;
            }

            // If did not get above wall, dont bother merging
            if (x >= WALL && this.memory.processTable.hitwall) {
                break;
            }

            //Replace current priority queue with one above it, or reset
            if (this.memory.processTable.queues[x + 1]) {
                this.memory.processTable.queues[x] = this.memory.processTable.queues[x + 1];
                this.memory.processTable.queues[x + 1] = [];
            } else {
                this.memory.processTable.queues[x] = [];
            }
        }

        // Add processes that did run back into the system
        if (this.memory.processTable.running) {
            this.memory.processTable.completed.push(this.memory.processTable.running);
            this.memory.processTable.running = false;
        }

        // Randomize to prevent error prone combinations
        const completed = _.shuffle(_.uniq(this.memory.processTable.completed));
        for (let pid of completed) {
            if (!this.memory.processTable.index[pid]) {
                continue
            }
            try {
                const priority = this.getPriorityForPID(pid);
                this.memory.processTable.queues[priority].push(pid);
            } catch (e) {
                delete this.memory.processTable.index[pid];
                Logger.log(e, LOG_ERROR);
            }
        }
        this.memory.processTable.hitwall = false;
        this.memory.processTable.completed = [];
    }

    getNextProcess () {
        // Reset any "running" pids
        if (this.memory.processTable.running) {
            this.memory.processTable.completed.push(this.memory.processTable.running);
            this.memory.processTable.running = false;
        }

        // Iterate through the queues until a pid is found.
        for (let x = 0; x <= MAX_PRIORITY; x++) {
            if (x >= WALL) {
                this.memory.processTable.hitwall = true;
            }
            if (!this.memory.processTable.queues[x] || this.memory.processes.queues[x].length <= 0) {
                continue;
            }

            this.memory.processTable.running = this.memory.processTable.queues[x].shift();

            // If process is dead dont use it
            if (!this.memory.processTable.index[this.memory.processTable.running]) {
                continue;
            }

            // If process has a parent that is dead kill
            if (this.memory.processTable.index[this.memory.processTable.running].p) {
                if (!this.isPIDActive(this.memory.processTable.index[this.memory.processTable.running].p)) {
                    this.kill(this.memory.processTable.running);
                    continue;
                }
            }

            return this.getProcessForPID(this.memory.processTable.running);
        }

        return false;
    }

    launchProcess (name, meta = {}, parent = false) {
        const pid = this.getNextPID();
        this.memory.processTable.index[pid] = {
            n: name,
            m: meta,
            p: parent
        };
        const priority = this.getPriorityForPID(pid);
        if (!this.memory.processTable.queues[priority]) {
            this.memory.processTable.queues[priority] = [];
        }
        this.memory.processTable.queues[priority].push(pid);
        return pid;
    }


    getNextPID () {
        if (!this.memory.lastPID) {
            this.memory.lastPID = 0;
        }
        while (true) {
            this.memory.lastPID++;
            if (this.memory.lastPID > MAX_PID) {
                this.memory.lastPID = 0;
            }
            if (this.memory.processTable.index[this.memory.lastPID]) {
                continue;
            }
            return this.memory.lastPID;
        }
    }

    isPIDActive (pid) {
        return !!this.memory.processTable.index[pid];
    }

    kill (pid) {
        if (this.memory.processTable.index[pid]) {
            delete this.memory.processTable.index[pid];
        }
    }

    getProcessCount () {
        return Object.keys(this.memory.processTable.index).length;
    }

    getCompletedProcessCount() {
        return this.memory.processTable.completed.length;
    }

    getPriorityForPID (pid) {
        if (!this.processCache[pid]) {
            const ProgramClass = this.getProgramClass(this.memory.processTable.index[pid].n);
            this.processCache[pid] = new ProgramClass(pid,
                this.memory.processTable.index[pid].n,
                this.memory.processTable.index[pid].m,
                this.memory.processTable.index[pid].p
            );
        }
        return this.processCache[pid];
    }

     getProgramClass(program) {
        return require(`programs_${program}`);
    }
}

module.exports = Scheduler;