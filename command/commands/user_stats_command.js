// Rock, Paper and Scissors, I not named by this because my VSCode not work fine with 
// the lint if do that.

import {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    EmbedBuilder
} from 'discord.js';
import Command from '../command.js'
import axios from 'axios';
import UserRepository from '../../data/user_repository.js';

export default class UserStats extends Command {




    /**
     * 
     * @param {UserRepository} userRepo  
     */
    constructor(userRepo) {
        super(
            "userstats",
            new SlashCommandBuilder()
            .setName("userstats")
            .setDescription("User Stats view")
        )
        this.userRepo = userRepo
    }

    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     */
    async execute(interaction) {
        this.userRepo.select(interaction.user.id, (data) => {
            interaction.reply(`Message Count: ${data.messageCount}`)
        })
    }

}