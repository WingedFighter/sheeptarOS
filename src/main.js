require('version');

const SosLogger = require('sos_logger');
global.Logger = new SosLogger;


const SosKernel = require('sos_kernel');

module.exports.loop = function() {
    if(!Memory.SCRIPT_VERSION || Memory.SCRIPT_VERSION !== SCRIPT_VERSION) {
        Memory.SCRIPT_VERSION = SCRIPT_VERSION;
        console.log('New code updated');
    }
    const kernel = new SosKernel();
    kernel.start();
    kernel.run();
    kernel.shutdown();
};