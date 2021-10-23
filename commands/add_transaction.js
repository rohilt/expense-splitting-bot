const {SlashCommandBuilder} = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
      .setName('add_transaction')
      .setDescription('Adds Transaction Event for Trip!'),
  async execute(interaction) {
    await interaction.reply('Insert Transaction :  ');
  },
};
