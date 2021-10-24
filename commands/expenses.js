/* eslint-disable guard-for-in */
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
      event = new Event(eventName, null);
      await interaction.reply({
        content: `New Trip Created : ${eventName}\n*React to this message if you are part of this event*`,
        embeds: [this.getEmbed(event)],
      });
      const msg = await interaction.fetchReply();
      await msg.pin();
      event.pinnedMsg = msg;
      // console.log(msgId);
      return event;
    } else if (interaction.options.getSubcommand() === 'report') {
      return event;
    } else if (interaction.options.getSubcommand() === 'end') {
      event.pinnedMsg = await event.pinnedMsg.edit({embeds: [{
        ...this.getEmbed(event),
        description: 'This event is complete',
      }]});
      await interaction.reply(`Okay, ending the trip ${event.name} now`);
      event.pinnedMsg = await event.pinnedMsg.fetch();
      const reactedUsers = await event.pinnedMsg.reactions.resolve('👍').users.fetch().then((userList) => {
        return userList;
      });
      const allUserIds = Array.from(reactedUsers.keys());
      const simplifiedTxns = event.getSimplifyingTxns(allUserIds);
      simplifiedTxns.forEach((txn) => {
        reactedUsers.get(txn.whoPays).send(`You owe ${userMention(txn.whoOwes)} \$${txn.amount.toFixed(2)}`);
        reactedUsers.get(txn.whoOwes).send(`You are owed \$${txn.amount.toFixed(2)} from ${userMention(txn.whoPays)}`);
      });
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
          user.id,
      );
      await interaction.reply({
        content: `Alright, got it. ${userMention(user.id)} paid \$${amount.toFixed(2)} for ${description}.`,
      });
      event.pinnedMsg = await event.pinnedMsg.edit({embeds: [this.getEmbed(event)]});
      return event;
    }

    // interaction.channel.send({embeds: [exampleEmbed]});
    // interaction.reply(
    // eslint-disable-next-line max-len
    // 'Okay, Here are the current transactions I\'ve kept track of for this trip',
    // );
  },
  getEmbed(event) {
    return {
      color: 0xff9a26,
      title: event.name,
      description: 'Recorded Expenses for Trip',
      timestamp: new Date(),
      fields: event.txns.length > 0 ? [
        {
          name: 'Paid By',
          value: event.txns.map((txn) => userMention(txn.whoPaid)).join('\n'),
          inline: true,
        },
        {
          name: 'Description',
          value: event.txns.map((txn) => txn.description).join('\n'),
          inline: true,
        },
        {
          name: 'Amount',
          value: event.txns.map((txn) => `\$${txn.amount.toFixed(2)}`).join('\n'),
          inline: true,
        },
      ] : null,
      footer: {
        icon_url: 'https://i.ibb.co/pwCNnfB/money-transfer-icon-40389-1.png',
        text: 'React with :thumbsup: to be part of the Trip',
      },
    };
  },
};
