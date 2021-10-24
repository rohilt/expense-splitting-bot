const {SlashCommandBuilder} = require('@discordjs/builders');
const {MessageEmbed} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
      .setName('expenses')
      .setDescription('Give out Trip Expense Options'),
  async execute(interaction) {
    const exampleEmbed = new MessageEmbed()
        .setColor('#0099ff')
        .setTitle('Some title')
        .setURL('https://discord.js.org/')
        .setAuthor('Some name', 'https://i.imgur.com/AfFp7pu.png', 'https://discord.js.org')
        .setDescription('Some description here')
        .setThumbnail('https://i.imgur.com/AfFp7pu.png')
        .addFields(
            {name: 'Inline title', value: 'Some value \nhere', inline: true},
            {name: 'Inline title', value: 'Some value \nhere', inline: true},
            {name: 'Inline title', value: 'Some value \nhere', inline: true},
        )
        .setImage('https://i.imgur.com/AfFp7pu.png')
        .setTimestamp()
        .setFooter('Some footer text here', 'https://i.imgur.com/AfFp7pu.png');

    interaction.channel.send({embeds: [exampleEmbed]});
    interaction.reply(
        // eslint-disable-next-line max-len
        'Okay, Here are the current transactions I\'ve kept track of for this trip',
    );
  },
};
