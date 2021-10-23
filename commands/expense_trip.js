const {SlashCommandBuilder} = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
      .setName('expense_trip')
      .setDescription('Give out Trip Expense Options'),
  async execute(interaction) {
    await interaction.reply('Expense Trip Options: ');
  },
};

