const os        = require('os');
const process   = require ('process');

class Status {
    constructor() {
        this.host = {
            hostname: os.hostname,
            platformType: os.type,
            platformVersion: os.release,
            architecture: os.arch,
            uptime: os.uptime, 
            loadAverages: os.loadavg(),
            cpus: os.cpus(),
            ram: {
                total: os.totalmem,
                free: os.freemem
            }
        };
        this.process = {
            uptime: process.uptime()
        };
    };
};

module.exports = Status;