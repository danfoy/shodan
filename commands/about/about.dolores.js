const Dolores = require('../../dolores');
const command = new Dolores.Command({
    name: 'status',
    aliases: ['info', 'stats', 'about'],
    description: "Display information about Shodan and her host system's statistics",
    execute: about
});
command.setAccessLevel('anon');
module.exports = command;

const Discord = require('discord.js');
const Status = require('./Status');
const { parseSeconds } = require('../../classes/shodan');

function about(message) {

    // Load information from the Status class
    const status = new Status;

    // Host information
    const host = new Discord.MessageEmbed;

    host.setTitle(  `__**${status.host.hostname} on ${status.host.platformType} ` +
                    `${status.host.platformVersion} (${status.host.architecture})**__`);
    host.addField(  '**Host uptime**', `${Dolores.formatSeconds(parseSeconds(status.host.uptime))}`);
    host.addField(  '**Shodan instance age**', `${Dolores.formatSeconds(parseSeconds(status.process.uptime))}`)

    Dolores.send(message.channel, host);


    // Load information
    const load = new Discord.MessageEmbed;

    load.setTitle(  '__**Load**__');
    load.addField(  '**CPU**',
                    `\`${status.host.cpus[0].model}\`\n` +
                    `**${status.host.cpus.length}** logical cores\n` +
                    `Currently clocked at **${status.host.cpus[0].speed / 1000}GHz**\n\u200b\n` +
                    `**Load averages:**`);
    load.addField(  '**1 minute**', `${Math.round(status.host.loadAverages[0])}%`, true);
    load.addField(  '**5 minutes**', `${Math.round(status.host.loadAverages[1])}%`, true);
    load.addField(  '**15 minutes**', `${Math.round(status.host.loadAverages[2])}%`, true);
    load.addField(  '\n\u200b\n**RAM**',
                    `**${Math.floor(status.host.ram.free / 1024 / 1024)}MB** (excl. cache) ` +
                    `free of **${Math.floor(status.host.ram.total / 1024 / 1024 / 1024)}GB**`);

    Dolores.send(message.channel, load);
};
