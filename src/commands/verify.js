require('dotenv').config();
const {Client, IntentsBitField, ApplicationCommandOptionType, EmbedBuilder, RoleSelectMenuBuilder, ActionRowBuilder, ComponentType} = require('discord.js');

/** @type {import('commandkit').CommandData} */
const data = {
    name: 'verify',
    description: 'verification',
    options: [
        {
            name: 'user',
            description: 'user to verify',
            type: ApplicationCommandOptionType.User,
            required: true,
        },
    ],
};

const client = new Client({ 
  intents: [
      IntentsBitField.Flags.Guilds,
      IntentsBitField.Flags.GuildMembers,
      IntentsBitField.Flags.GuildMessages,
      IntentsBitField.Flags.MessageContent,
  ] 
});

/** @param {import('commandkit').SlashCommandProps} param0 */
async function run ({interaction, client}){
  if(!interaction.isChatInputCommand()) return;
  
  const LogChannel = client.guilds.cache.get(process.env.GUILD_ID).channels.cache.get(process.env.LOG_CHANNEL)
  console.log(LogChannel.id)

  const interTargetID = interaction.options.get('user').value;
  const interTargetCache = interaction.guild.members.cache.get(interTargetID);
  const interUserAvatar = interTargetCache.user.avatar;
  // Embeds
  const SuccessEmbed = new EmbedBuilder()
    .setTitle("Verification")
    .setImage(`https://cdn.discordapp.com/avatars/${interTargetID}/${interUserAvatar}`)
    .setDescription(`${interTargetCache.user} has been verified!`)
    .setColor(5763719);

  const RemovedEmbed = new EmbedBuilder()
    .setTitle("Verification")
    .setDescription(`Role has been removed!`)
    .setColor(15548997);

  const ChangeEmbed = new EmbedBuilder()
    .setTitle("Verification")
    .setDescription('Role has been changed!')
    .setColor(3447003);
  
  const WrongRoleEmbed = new EmbedBuilder()
    .setTitle("ERROR")
    .setDescription('Wrong role selected!')
    .setColor(15548997);

  const NoRolesSelectedEmbed = new EmbedBuilder()
    .setTitle("ERROR")
    .setDescription('no roles selected!')
    .setColor(15548997);

  const roleMenu = new RoleSelectMenuBuilder()
    .setCustomId("interaction.id")
    .setMinValues(0)
    .setMaxValues(1);

      
    // Main
  const actionRow = new ActionRowBuilder().addComponents(roleMenu);

  const reply = await interaction.reply({ components: [actionRow] });

  const collector = reply.createMessageComponentCollector({
    ComponentType: ComponentType.RoleSelect,
    filter: (i) =>
      i.user.id === interaction.user.id && i.customId === "interaction.id",
    time: 60_000,
  });

  collector.on("collect", (interaction) => {
    var VerifyResult = null;

    if (!interaction.values.length) {
      interaction.reply({ embeds: [NoRolesSelectedEmbed], ephemeral: true });
      return;
    };

    const UnverifiedRole = process.env.UNVERIFIED_ROLE_ID;
    const BoyRole = process.env.BOY_ROLE_ID;
    const GirlRole = process.env.GIRL_ROLE_ID;

    if (interaction.values[0] != BoyRole && interaction.values[0] != GirlRole) {
      interaction.reply({ embeds: [WrongRoleEmbed], ephemeral: true });
      console.log(interaction.values[0])
      const DenieEmbed = new EmbedBuilder()
      .setTitle('Verify Log')
      .addFields(
        {name:'Author', value:`${interaction.user}`},
        {name:'Selected', value:'Wrong Role'},
        {name:'Verify target', value:`${interTargetCache.user}`},
        {name:'Result', value:'❌ Denied'}
      )

      LogChannel.send({embeds: [DenieEmbed]});
      return;
    } 
    else 
    {
      switch (interTargetCache.roles.cache.has(BoyRole) && interaction.values[0]){
        case BoyRole:
          interTargetCache.roles.remove(BoyRole);
          interTargetCache.roles.add(UnverifiedRole);
          interaction.reply({ embeds: [RemovedEmbed], ephemeral: true });

          VerifyResult = '❌ Removed';
        break;
        case GirlRole:
          interTargetCache.roles.remove(BoyRole);
          interTargetCache.roles.add(GirlRole);
          interaction.reply({ embeds: [ChangeEmbed], ephemeral: true });

          VerifyResult = 'ℹ️ Changed';
        break;
      };

      switch (interTargetCache.roles.cache.has(GirlRole) && interaction.values[0]) {
        case BoyRole:
          interTargetCache.roles.remove(GirlRole);
          interTargetCache.roles.add(BoyRole);
          interaction.reply({ embeds: [ChangeEmbed], ephemeral: true });

          VerifyResult = 'ℹ️ Changed';  
        break;
        case GirlRole:
          interTargetCache.roles.remove(GirlRole);
          interTargetCache.roles.add(UnverifiedRole);
          interaction.reply({ embeds: [RemovedEmbed], ephemeral: true });

          VerifyResult = '❌ Removed';
        break;
      };

      switch (interTargetCache.roles.cache.has(UnverifiedRole) && interaction.values[0]) {
        case BoyRole:
          interTargetCache.roles.remove(UnverifiedRole);
          interTargetCache.roles.add(BoyRole);
          interaction.reply({ embeds: [SuccessEmbed], ephemeral: true });

          VerifyResult = '✅ Success';
        break;
        case GirlRole:
          interTargetCache.roles.remove(UnverifiedRole);
          interTargetCache.roles.add(GirlRole);
          interaction.reply({ embeds: [SuccessEmbed], ephemeral: true });
          
          VerifyResult = '✅ Success';
        break;
      };
    
      const selectedRole = interaction.guild.roles.cache.get(interaction.values[0])
      const SelectorEmbed = new EmbedBuilder()
      .setTitle('Verify Log')
      .addFields(
        {name:'Author', value:`${interaction.user}`},
        {name:'Selected', value:`${selectedRole}`},
        {name:'Verify target', value: `${interTargetCache.user}`},
        {name:'Result', value:`${VerifyResult}`}
      )

      LogChannel.send({embeds: [SelectorEmbed]});
    };
  });
};

/** @type {import('commandkit').CommandOptions} */
const options = {
    devOnly: true,
}
module.exports = {data, run, options};

client.login(process.env.TOKEN)