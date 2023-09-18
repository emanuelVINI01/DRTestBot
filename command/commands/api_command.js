// Rock, Paper and Scissors, I not named by this because my VSCode not work fine with 
// the lint if do that.

import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import Command from '../command.js'
import axios from 'axios';

export default class ApiCommand extends Command {


    constructor () {
        super(
            "api",
            new SlashCommandBuilder()
            .setName("api")
            .setDescription("Test bot API System")
        )
    }

    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     */
    async execute(interaction) {
        interaction.deferReply()
        const response = await axios.get("https://httpbin.org/uuid")
        interaction.editReply(`Result of API: ${response.data.uuid}`)
    }

}