const Dolores = require('../../dolores');
const command = new Dolores.Command({
    name: 'apex',
    aliases: ['legends'],
    description: 'Generate a randomized Apex Legends squad',
    usage:
        `Tag or name up to two other players and I will work out the squad size myself, ` +
        `using you as the first player by default. ` +
        `Alternatively use a squad type keyword as the first option, and I will autofill ` +
        `any empty slots for you. You can also use this mode to generate squads for ` +
        `other players, excluding yourself from the lineup.\n\u200b\n` +
        `Squad type keyword can be any of the following:\n` +
        '- `squads`, or `squad`, `legends`, `team`, `trios`, `trio`\n' +
        '- `duos` or `duo`\n' +
        '- `solo` or `legend`, `solos`',
    standalone:
        'Generate one random legend',
    execute: roll
});
command.setAccessLevel('anon');
command.addOption('[squad type]', 'select squad size (see keywords below)');
command.addOption('[teammate(s)]', 'teammate names or tags, space-separated');
command.addExample('apex squad wraith_ttv gamer420', 'Generate a 3-player squad for you, `wraith_ttv`, and `gamer420`');
command.addExample('apex solo Delores', 'Generates a solo squad for player `Delores`')
module.exports = command;

const { legends }   = require('../../data/legends.json');
const {MessageEmbed, MessageAttachment} = require('discord.js');
const { parse } = require('dotenv');

// Generate a random squad with specified number of legends
function randomSquad(size) {
    const availableLegends = [...legends];
    let roster = [];
    for (let i = 0; size > i; i++) {
        const randomIndex = Math.floor(Math.random() * availableLegends.length);
        roster.push(availableLegends[randomIndex]);
        availableLegends.splice(randomIndex, 1);
    };
    return roster;
};

function parseCommand(message, args) {

    // Attempt to parse a squad size from keywords
    const parseSizeKeyword = (args) => {
        const keywords = {
            trios:  ['legends', 'squads', 'squad', 'team', 'trios', 'trio'],
            duos:  ['duos', 'duo'],
            solos:  ['solos', 'solo', 'legend']
        }
        // Array.includes() won't accept undefined as an argument
        const firstArg = args[0] ? args[0].toLowerCase() : false;
        if (keywords.trios.includes(firstArg)) return 3;
        if (keywords.duos.includes(firstArg)) return 2;
        if (keywords.solos.includes(firstArg)) return 1;
        return false;
    };
    const parsedSize = parseSizeKeyword(args);

    let players = [...args];
    if (parsedSize) players.shift(); // Remove size keyword

    // Prepend command user if there are free slots in the squad
    if ( !parsedSize || parsedSize > players.length)
        players.unshift(`<@${message.author.id}>`);

    const squadSize = parsedSize || players.length || 1;

    let fullSquad = Array(squadSize);
    for (let i = 0; i < squadSize; i++) {
        fullSquad[i] = players[i] ? players[i] : null;
    }

    return fullSquad;
};

const getLegendThumbnail = (legend) =>
    new MessageAttachment(`./Resources/Apex/Legends/${legend}.png`);

function generateEmbeds(squad) {
    const squadColours = ['#d78d18', '#31a1a0', '#66a103'];
    const legends = randomSquad(squad.length);
    return Array.from(squad, (player, index) => {
        const legend = legends[index];
        return {
            embed: new MessageEmbed({
                title: legend.name,
                thumbnail: {
                    url: `attachment://${legend.name}.png`,
                },
                color: squadColours[index],
                description: player || legend.tagline,
            }),
            files: [getLegendThumbnail(legend.name)],
        };
    });
};

function roll(message, args = []) {
    const players = parseCommand(message, args);
    const embeds = generateEmbeds(players);
    embeds.forEach(embed => message.channel.send(embed));
};

