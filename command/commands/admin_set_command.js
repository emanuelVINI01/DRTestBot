// Rock, Paper and Scissors, I not named by this because my VSCode not work fine with 
// the lint if do that.

import { SlashCommandBuilder, ChatInputCommandInteraction, PermissionsBitField } from 'discord.js';
import Command from '../command.js'
import ServerRepository from '../../data/server_repository.js';

export default class AdminSetCommand extends Command {


    /**
     * 
     * @param {ServerRepository} serverRepository 
     */
    constructor (serverRepository) {
        super(
            "admin-set",
            new SlashCommandBuilder()
            .setName("admin-set")
            .setDescription("Set values of bot data system")
            .addSubcommand(subcommand => 
                subcommand.setName("join-channel")
                    .setDescription("Set the channel of join message will be sent")
                    .addChannelOption(option => 
                        option.setName("channel")
                        .setDescription("Channel")
                        .setRequired(true)    
                    )
            )
            .addSubcommand(subcommand => 
                subcommand.setName("join-message")
                    .setDescription("Set the message will be sent on member join")
                    .addStringOption(option => 
                        option.setName("message")
                        .setDescription("Message")   
                        .setRequired(true)     
                    )
            )
        )
        this.serverRepository = serverRepository
    }

    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     */
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            interaction.reply({
                ephemeral: true,
                content: "You not have permission to do that."
            })
            return
        }
        interaction.reply({
            ephemeral: true,
            content: "The information has been change successfully."
        })
        this.serverRepository.select(interaction.guild.id, serverData => {
            switch (interaction.options.getSubcommand()) {
                case "join-channel": {
                    serverData.joinChannel = interaction.options.getChannel("channel").id
                }
                case "join-message": {
                    serverData.joinMessage = interaction.options.getString("message")
                }
                default: {
                    this.serverRepository.save(serverData)
                }
            }
        })
        
    }

}