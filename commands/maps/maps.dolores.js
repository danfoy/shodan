const Dolores = require('../../dolores');
const ApexMapsPlaylist = require('./ApexMapsPlaylist');
const { MessageEmbed } = require('discord.js');
const command = new Dolores.Command({
    name: 'map',
    aliases: ['rotation'],
    description:    'Get information on map rotations for Apex Legends',
    standalone: 'Get the current map for Battle Royale mode',
    execute: getMap
});
command.setAccessLevel('anon');

module.exports = command;

const maps = ["World's Edge", "King's Canyon", "Olympus"];
const durations = [90, 60, 60, 120, 90, 120];
const seasonStartTime = new Date('2021-08-10T17:00:00Z');
const battleRoyale = new ApexMapsPlaylist(maps, durations, seasonStartTime);

function getMap(message, args = []) {
    const current = battleRoyale.currentMap;
    const next = battleRoyale.nextMap;

    const response = new MessageEmbed({
        title: `Current Map: ${current.map}`,
        description: `*${current.timeRemaining} minutes remaining*`,
        footer: {
            text: `Next: ${next.map} for ${next.duration} minutes`
        }
    });

    return Dolores.send(message.channel, response);
}
