
// I always make using TypeScript, but I can't do based in description
// Imagine this is a interface

import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';

export default class Command {

    /**
     * 
     * @param {String} name 
     * @param {SlashCommandBuilder} data 
     */
    constructor(name, data) {
       this.name = name
       this.data = data
    }

    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     */
    async execute(interaction) {
        throw new Error("TODO")
    }

 


}