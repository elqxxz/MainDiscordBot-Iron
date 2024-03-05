const { Client, IntentsBitField, ApplicationCommandOptionType, EmbedBuilder,} = require('discord.js');
const OptionsData = require('../data/GraberOptions.json');

const client = new Client({ 
    intents: [
        IntentsBitField.Flags.Guilds, 
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ] 
});

/** @type {import('commandkit').CommandData} */
const data = {
    name: 'get-avatar',
    description: 'get avatar of a user',

    options: [
        {
            name: 'type',
            description: 'avatar or banner',
            type: ApplicationCommandOptionType.String,
            autocomplete: true,
            required: true,
        },
        {
            name: 'user',
            description: 'user to get avatar or banner',
            type: ApplicationCommandOptionType.User,
            required: true,
        },
    ],
};

/** @param {import('commandkit').SlashCommandProps} param0 */
async function run({interaction}) {
    const LogChannel = client.guilds.cache.get(process.env.GUILD_ID).channels.cache.get(process.env.LOG_CHANNEL);
    const interactingUser = interaction.user.globalName;
    const interTargetID = interaction.options.get('user').value;
    const interTargetCache = interaction.guild.members.cache.get(interTargetID);


    if (!interaction.isChatInputCommand()) return;
        console.log(`--- ${interactingUser} has used the grabber on ${interTargetCache.displayName} ---`);
        console.log(`avatar id: ${interTargetCache.user.avatar}`);

    const guild = await client.guilds.fetch(process.env.GUILD_ID);
    const Fetched = guild.members.fetch(interTargetID);

    const interTargetAvatar = interTargetCache.user.avatar;
    const interTargetBanner = (await Fetched).user.banner;
        console.log(`banner id: ${interTargetBanner}`);
        //console.log(Fetched)

    const interTargetType = interaction.options.getString('type');
    const type = OptionsData.find((option) => option.id === interTargetType);

    const SuccessAvatarEmbed = new EmbedBuilder()
     .setTitle("Success")
     .setImage(`https://cdn.discordapp.com/avatars/${interTargetID}/${interTargetAvatar}`)
     .setDescription(`${interTargetCache.user.displayName}'s avatar grabbed`)
     .setColor(5763719);

    const SuccessBannerEmbed = new EmbedBuilder()
     .setTitle("Success")
     .setImage(`https://cdn.discordapp.com/banners/${interTargetID}/${interTargetBanner}`)
     .setDescription(`${interTargetCache.user.displayName}'s banner grabbed`)
     .setColor(5763719);

    const ErrorEmbed = new EmbedBuilder()
     .setTitle("Error")
     .setDescription(`${interTargetCache.user.displayName} doesn't have an avatar or banner`)
     .setColor(15548997);
    
    const GetAvatarEmbed = new EmbedBuilder()
     .setTitle('Graber Log')
     .setFields(
         {name:'Author', value:`${interaction.user}`},
         {name:'What user got', value:`${type.name}`},
         {name:'Grabbed from', value:`${interTargetCache.user}`}
     );

    if (type.name === 'avatar') {
            console.log(`interacted with avatar\n-------------------------------------------------`)
        interaction.reply({ embeds: [SuccessAvatarEmbed], ephemeral: true })
        
        LogChannel.send({embeds: [GetAvatarEmbed]})
        return;
    } else if (type.name === 'banner' && interTargetBanner !== undefined) {
            console.log(`interacted with banner\n-------------------------------------------------`);
        interaction.reply({ embeds: [SuccessBannerEmbed], ephemeral: true });
        
        LogChannel.send({embeds: [GetAvatarEmbed]})
        return;
    } 
    else {
            console.log(`-------------------------------------------------`)
        interaction.reply({ embeds: [ErrorEmbed], ephemeral: true });
        
        LogChannel.send({embeds: [GetAvatarEmbed]})
    };

};

/** @type {import('commandkit').CommandOptions} */
const options = {
    devOnly: false,
};
module.exports = { data, run, options}

client.login(process.env.TOKEN)