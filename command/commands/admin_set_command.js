// Rock, Paper and Scissors, I not named by this because my VSCode not work fine with 
// the lint if do that.

import {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    PermissionsBitField
} from 'discord.js';
import Command from '../command.js'
import ServerRepository from '../../data/server_repository.js';

export default class AdminSetCommand extends Command {


    /**
     * 
     * @param {ServerRepository} serverRepository 
     */
    constructor(serverRepository, intervals) {
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
            ).addSubcommand(subcommand =>
                subcommand.setName("time-message")
                .setDescription("Set the time when message will send (in minutes)")
                .addIntegerOption(option =>
                    option.setName("time")
                    .setDescription("Time")
                    .setMinValue(1)
                    .setRequired(true)
                )
            )
        )
        this.serverRepository = serverRepository
        this.intervals = intervals
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
        await interaction.reply({
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
                case "time-message": {
                    console.log(serverData)
                    if (serverData.joinChannel == '0') {
                        interaction.editReply("The join channel not has set.")
                        return
                    }
                    if (serverData.joinMessage == '') {
                        interaction.editReply("The message not has set.")
                        return
                    }
                    const time = interaction.options.getInteger("time")
                    let lastInterval = this.intervals.filter((i) => i.id === serverData.id)[0]
                    if (lastInterval != undefined) {
                        clearInterval(lastInterval.intervalId)
                    } else {
                        lastInterval = {
                            "id": serverData.id
                        }
                        this.intervals.push(
                            lastInterval
                        )
                    }
                    const guild = interaction.guild
                    const intervalId = setInterval(() => {
                        guild.channels.cache.get(serverData.joinChannel).send(
                            serverData.joinMessage.replace("@user", "Scheduler Interval")
                        )
                    }, time * 1000 * 60)
                    lastInterval.intervalId = intervalId

                    serverData.timeMessage = time
                }
                default: {

                    
                    this.serverRepository.save(serverData)
                }
            }
        })

    }

}