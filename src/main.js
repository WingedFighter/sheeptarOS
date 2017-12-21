require('version');
require('constants');

const SosLogger = require('sos_logger');
global.Logger = new SosLogger;


const SosKernel = require('sos_kernel');

require('extends_room');
require('extends_economy');
require('extends_creep');
require('extends_source');

module.exports.loop = function() {
    const kernel = new SosKernel();
    kernel.start();
    kernel.run();
    kernel.shutdown();
};