/* eslint-disable max-len */
const {SlashCommandBuilder, userMention} = require('@discordjs/builders');
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
    const embed = {
      color: 0xff9a26,
      description: 'Recorded Expenses for Trip',
      thumbnail: {
        url: 'https://i.ibb.co/pwCNnfB/money-transfer-icon-40389-1.png',
      },
      timestamp: new Date(),
      footer: {
        text: 'React with :thumbsup: to be part of the Trip',
      },
    };
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
      await interaction.reply({
        content: `New Trip Created : ${eventName}\n*React to this message if you are part of this event*`,
        embeds: [{
          ...embed,
          title: eventName,
        }],
      });
      const msg = await interaction.fetchReply();
      await msg.pin();
      // console.log(msgId);
      return new Event(eventName, msg);
    } else if (interaction.options.getSubcommand() === 'report') {
      return event;
    } else if (interaction.options.getSubcommand() === 'end') {
      return event;
    } else if (interaction.options.getSubcommand() === 'record') {
      if (!event) {
        await interaction.reply({
          content: 'It looks like there isn\'t currently an event. Start an event first before recording transactions.',
          ephemeral: true,
        });
        return event;
      }
      // console.log(userMention(interaction.options.getUser('user').id));
      const {amount, description, user} = {
        amount: interaction.options.getNumber('amount'),
        description: interaction.options.getString('description'),
        user: interaction.options.getUser('user'),
      };
      event.addTxn(
          amount,
          description,
          user,
      );
      await interaction.reply({
        content: `Alright, got it. ${userMention(user.id)} paid \$${amount} for ${description}.`,
      });
      return event;
    }

    // interaction.channel.send({embeds: [exampleEmbed]});
    // interaction.reply(
    // eslint-disable-next-line max-len
    // 'Okay, Here are the current transactions I\'ve kept track of for this trip',
    // );
  },
};
