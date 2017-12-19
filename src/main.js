require('version');

const SosLogger = require('sos_logger');
global.Logger = new SosLogger;


const SosKernel = require('sos_kernel');

module.exports.loop = function() {
    const kernel = new SosKernel();
    kernel.start();
    kernel.run();
    kernel.shutdown();
};