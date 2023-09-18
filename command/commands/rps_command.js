// Rock, Paper and Scissors, I not named by this because my VSCode not work fine with 
// the lint if do that.

import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import Command from '../command.js'

export default class RPSCommand extends Command {

    options = ["Rock", "Paper", "Scissor"]

    constructor () {
        super(
            "rps",
            new SlashCommandBuilder()
            .setName("rps")
            .setDescription("Play Rock-Paper-Scissors against me")
            .addStringOption(option => 
                option
                .setName("choice")
                .setDescription("Your choice in game")
                .addChoices(
                    {
                        "name": "Rock",
                        "value": "Rock"
                    },
                    {
                        "name": "Paper",
                        "value": "Paper"
                    },
                    {
                        "name": "Scissor",
                        "value": "Scissors"
                    }
                ).setRequired(true)
            )
        )
    }

    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     */
    async execute(interaction) {
        const selectedOptionNumber = this.options.indexOf(
            interaction.options.getString("choice")
        )
        const optionNumber = Math.floor(Math.random() * 3)
        const option = this.options[
            optionNumber
        ]
        let status = "tied"
        if (optionNumber != selectedOptionNumber) {
            switch (optionNumber) {
                case 0: {
                    if (selectedOptionNumber == 1) {
                        status = "won"
                    }
                    break
                } 
                case 1: {
                    if (selectedOptionNumber == 0) {
                        status = "won"
                    }
                    break
                }
                case 2: {
                    if (selectedOptionNumber == 1) {
                        status = "won"
                    }
                    break
                }
                default: {
                    status = "lost"
                }
            }
        }
        interaction.reply(`I selected \`${option}\` and ${status} of you!`)
    }

}