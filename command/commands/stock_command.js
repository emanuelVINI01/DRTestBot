// Rock, Paper and Scissors, I not named by this because my VSCode not work fine with 
// the lint if do that.

import {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    EmbedBuilder
} from 'discord.js';
import Command from '../command.js'
import axios from 'axios';

export default class StockCommand extends Command {


    key = ""

    /**
     * 
     * @param {string} key 
     */
    constructor(key) {
        super(
            "stock",
            new SlashCommandBuilder()
            .setName("stock")
            .setDescription("Test bot Stock API System")
            .addStringOption(option => option
                .setRequired(true)
                .setName("stock")
                .setDescription("Symbol of Stock, like: IBM or APPL")
            )
        )
        this.key = key
    }

    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     */
    async execute(interaction) {
        interaction.deferReply()
        const symbol = interaction.options.getString("stock", true)
        const response = await axios.get(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${this.key}`)
        const data = response.data["Global Quote"]
        if (data["01. symbol"] === undefined) {
            interaction.editReply(`Stock not found.`)
            return
        }
        interaction.editReply(
            {
                "embeds": [new EmbedBuilder()
                .setColor('Blue')
                .addFields({
                    name: "Open",
                    value: `${data["02. open"]}`
                }, {
                    name: "High",
                    value: `${data["03. high"]}`
                },                 {
                    name: "Price",
                    value: `${data["05. price"]}`
                }).toJSON()],
                "content": `About ${symbol}:`
            }
        )
    }

}