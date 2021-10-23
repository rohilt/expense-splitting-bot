const {SlashCommandBuilder} = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
      .setName('ping')
      .setDescription('Wakes up the bot for a quickie'),
  async execute(interaction) {
    await interaction.reply('I AM ALIVEEEEE');
    await interaction.followUp('FEEEEEEEEEEEED MEEEEEEEEEEE');
  },
};
