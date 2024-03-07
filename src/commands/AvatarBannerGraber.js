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
    client.on('error', error => {
        console.error('The WebSocket encountered an error:', error);
    });
    
    const LogChannel = client.channels.cache.get(process.env.LOG_CHANNEL)
    const interactingUser = interaction.user.globalName;
    const interTargetID = await interaction.options.getUser('user').fetch();
    const interTargetCache = interaction.guild.members.cache.get(interaction.options.get('user').value);

    if (!interaction.isChatInputCommand()) return;
    console.log(`--- ${interactingUser} has used the grabber on ${interTargetID.displayName} ---`);
    console.log(`avatar id: ${interTargetID.avatar}`);
    console.log(`banner id: ${interTargetID.bannerURL()}`);
    console.log('-------------------------------------------------------------------------------')

    const interTargetType = interaction.options.getString('type');
    const type = OptionsData.find((option) => option.id === interTargetType);

    const SuccessAvatarEmbed = new EmbedBuilder()
     .setTitle("Success")
     .setThumbnail(interTargetID.avatarURL({dynamic: true, size: 4096}))
     .setDescription(`${interTargetCache.user}'s avatar grabbed`)
     .setColor(5763719);

    const SuccessBannerEmbed = new EmbedBuilder()
     .setTitle("Success")
     .setImage(interTargetID.bannerURL({dynamic: true, size: 4096}))
     .setDescription(`${interTargetCache.user}'s banner grabbed`)
     .setColor(5763719);

    const ErrorEmbed = new EmbedBuilder()
     .setTitle("Error")
     .setDescription(`${interTargetCache.user} doesn't have an avatar or banner`)
     .setColor(15548997);
    
    const GetAvatarEmbed = new EmbedBuilder()


    if (type.name === 'avatar') {
            console.log(`interacted with avatar\n-------------------------------------------------`)
        interaction.reply({ embeds: [SuccessAvatarEmbed], ephemeral: true })
        
        LogChannel.send({embeds: [
            GetAvatarEmbed
                .setTitle('Graber Log')
                .setFields(
                    {name:'Where command used', value:`${interaction.guild.name} - ${interaction.channel.name}: ${interaction.channel}`},
                    {name:'Author', value:`${interaction.user.displayName}: ${interaction.user}`},
                    {name:'What user choosed', value:`${type.name}`},
                    {name:'Grabbed from', value:`${interTargetCache.user}`}
                )
                .setThumbnail(interaction.guild.iconURL())
                .setImage(interTargetID.avatarURL({dynamic: true, size: 4096}))
        ]})
        return;
    } else if (type.name === 'banner' && interTargetID.banner !== (undefined || null) ) {
            console.log(`interacted with banner\n-------------------------------------------------`);
        interaction.reply({ embeds: [SuccessBannerEmbed], ephemeral: true });
        
        LogChannel.send({embeds: [
            GetAvatarEmbed
                .setTitle('Graber Log')
                .setFields(
                    {name:'Where command used', value:`${interaction.guild.name} - ${interaction.channel.name}: ${interaction.channel}`},
                    {name:'Author', value:`${interaction.user.displayName}: ${interaction.user}`},
                    {name:'What user choosed', value:`${type.name}`},
                    {name:'Grabbed from', value:`${interTargetCache.user}`}
                )
                .setThumbnail(interaction.guild.iconURL())
                .setImage(interTargetID.bannerURL({dynamic: true, size: 4096}))
        ]})
        return;
    } 
    else {
            console.log(`-------------------------------------------------`)
        interaction.reply({ embeds: [ErrorEmbed], ephemeral: true });
        
        LogChannel.send({embeds: [
            GetAvatarEmbed
                .setTitle('Graber Log')
                .setFields(
                    {name:'Where command used', value:`${interaction.guild.name} - ${interaction.channel.name}: ${interaction.channel}`},
                    {name:'Author', value:`${interaction.user.displayName}: ${interaction.user}`},
                    {name:'What user choosed', value:`${type.name}`},
                    {name:'Content', value:`user have no banner`},
                    {name:'Grabbed from', value:`${interTargetCache.user}`}
                )
                .setThumbnail(interaction.guild.iconURL())
        ]})
        return;
    };

};

/** @type {import('commandkit').CommandOptions} */
const options = {
    devOnly: false,
};
module.exports = { data, run, options}

client.login(process.env.TOKEN)