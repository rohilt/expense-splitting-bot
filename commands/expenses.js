/* eslint-disable max-len */
const {SlashCommandBuilder} = require('@discordjs/builders');
const {MessageEmbed} = require('discord.js');
const Event = require('../event');

module.exports = {
  data:
    new SlashCommandBuilder()
        .setName('expenses')
        .setDescription('Manage group expenses efficiently')
        .addSubcommand((subcommand) => subcommand
            .setName('status')
            .setDescription('Get the current status'))
        .addSubcommand((subcommand) => subcommand
            .setName('start')
            .setDescription('Start a new event')
            .addStringOption((option) => option
                .setName('event')
                .setDescription('The name of the event')
                .setRequired(true)))
        .addSubcommand((subcommand) => subcommand
            .setName('report')
            .setDescription('Get current transactions recorded'))
        .addSubcommand((subcommand) => subcommand
            .setName('end')
            .setDescription('End the current event'))
        .addSubcommand((subcommand) => subcommand
            .setName('record')
            .setDescription('Record a new transaction')
            .addUserOption((option) => option
                .setName('user')
                .setDescription('The user who paid for this transaction')
                .setRequired(true))
            .addStringOption((option) => option
                .setName('description')
                .setDescription('The description of the transaction')
                .setRequired(true))
            .addNumberOption((option) => option
                .setName('amount')
                .setDescription('The amount in this transaction')
                .setRequired(true))),
  // - modify [id] [who] [description] [amount]
  // - delete [id]
  async execute(interaction, event) {
    if (!interaction.isCommand() || interaction.commandName !== 'expenses') return;
    if (interaction.options.getSubcommand() === 'status') {
      if (event) {
        await interaction.reply({
          content: `There is an ongoing event ${event.name}, with ${event.txns.length} transactions`,
          ephemeral: true,
        });
      } else {
        await interaction.reply({
          content: 'There is currently no ongoing event. Use the command \`/expenses start [name]\` to start an event.',
          ephemeral: true,
        });
      }
      return event;
    } else if (interaction.options.getSubcommand() === 'start') {
      if (event) {
        interaction.reply({
          content: `It looks like the event ${event.name} has already started.`,
          ephemeral: true,
        });
        return event;
      }
      const eventName = interaction.options.getString('event');
      const startEmbed = new MessageEmbed()
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
      await interaction.reply({
        content: `Starting the event ${eventName} now! React to this message if you are part of this event.`,
        embeds: [startEmbed],
      });
      const msgId = (await interaction.fetchReply()).id;
      console.log(msgId);
      return new Event(eventName, msgId);
    } else if (interaction.options.getSubcommand() === 'report') {
      return event;
    } else if (interaction.options.getSubcommand() === 'end') {
      return event;
    } else if (interaction.options.getSubcommand() === 'record') {
      // const newTxn = {
      //   whoPaid: interaction.options.getUser(user),

      // };
      // event.txns.push(newTxn);
      return event;
    }

    // interaction.channel.send({embeds: [exampleEmbed]});
    // interaction.reply(
    // eslint-disable-next-line max-len
    // 'Okay, Here are the current transactions I\'ve kept track of for this trip',
    // );
  },
};