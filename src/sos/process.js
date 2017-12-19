class Process {
    constructor (pid, name, meta, parent) {
        this.pid = pid;
        this.name = name;
        this.meta = meta;
        this.parent = parent;
    }

    get Priority () {
        return this.priority || DEFAULT_PRIORITY;
    }

    clean () {
        if (this.meta.children) {
            for (let label in this.meta.children) {
                if (!kernel.scheduler.isPIDActive(this.meta.children[label])) {
                    delete this.meta.children[label];
                }
            }
        }

        if (this.meta.processes) {
            for (let label in this.meta.processes) {
                if (!kernel.scheduler.isPIDActive(this.meta.processes[label])) {
                    delete this.meta.processes[label];
                }
            }
        }
    }

    launchChildProcess (label, name, data = {}) {
        if (!this.meta.children) {
            this.meta.children = {};
        }
        if (this.meta.children[label]) {
            return true;
        }
        this.meta.children[label] = kernel.scheduler.launchProcess(name, data, this.pid);
        return this.meta.children[label];
    }

    getChildProcessPID (label) {
        if (!this.meta.children) {
            return false;
        }
        if (!this.meta.children[label]) {
            return false;
        }
        return this.meta.children[label];
    }

    isChildProcessRunning (label) {
        const pid = this.getChildProcessPID(label);
        if (!pid) {
            return false;
        }
        return kernel.scheduler.isPIDActive(pid);
    }

    launchProcess (label, name, data = {}) {
        if (!this.meta.processes) {
            this.meta.processes = {};
        }

        if (this.meta.processes[label]) {
            return true;
        }
        this.meta.processes[label] = kernel.scheduler.launchProcess(name, data);
        return this.meta.processes[label];
    }

    getProcessPID (label) {
        if (!this.meta.processes) {
            return false
        }
        if (!this.meta.processes[label]) {
            return false
        }
        return this.meta.processes[label]
    }

    isProcessRunning (label) {
        const pid = this.getProcessPID(label);
        if (!pid) {
            return false;
        }
        return kernel.scheduler.isPIDActive(pid);
    }

    suicide () {
        return kernel.scheduler.kill(this.pid);
    }

    run () {
        this.clean();
        this.main();
    }
}

module.exports = Process;