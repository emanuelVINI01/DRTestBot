import RPSCommand from "./command/commands/rps_command.js"
import ServerRepository from "./data/server_repository.js"
import UserRepository from "./data/user_repository.js"
import { Client, REST, GatewayIntentBits, Routes } from 'discord.js'
import { RecurrenceRule, scheduleJob } from 'node-schedule'
import * as config from "./config.json" assert { type: "json" }
import * as mysql from 'mysql'
import ApiCommand from "./command/commands/api_command.js"
import AdminSetCommand from "./command/commands/admin_set_command.js"

const { token, database } = config.default

const connection = mysql.createConnection(database)

/**
 * @type {ServerRepository}
 */

const serverRepository = new ServerRepository(connection)
serverRepository.createTable()

const userRepository = new UserRepository(connection)
userRepository.createTable()


const commands = [
    new RPSCommand(),
    new ApiCommand(),
    new AdminSetCommand(serverRepository)
]

const commandsData = []
commands.forEach(command => {
    console.log(`Successfully loaded command ${command.name}`)
    commandsData.push(
        command.data.toJSON()
    )
})


const bot = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers]
})

bot.on("ready", async () => {
    const rest = new REST().setToken(token);

    await rest.put(
        Routes.applicationCommands(bot.application.id), {
        body: commandsData
    }
    )
})

bot.on("messageCreate", async event => {
    userRepository.select(event.author.id, userData => {
        userData.messageCount += 1
        userRepository.save(userData)
    })

})

bot.on("guildMemberAdd", async event => {
    serverRepository.select(event.guild.id, serverData => {
        if (serverData.joinChannel != "0" && serverData.joinMessage != "") {
            const channel = event.guild.channels.cache.get(serverData.joinChannel)
            if (channel != null) {
                channel.send(
                    serverData.joinMessage.replace("@user", `<@${event.user.id}>`)
                )
            }
        }
    })

})

bot.on("interactionCreate", async event => {
    if (event.isCommand()) {
        commands.filter(command => command.name == event.commandName).forEach(command => {
            command.execute(event)
        })
    }
})

bot.login(token)

const sendorAll = () => {
    bot.guilds.cache.forEach(guild => {
        serverRepository.select(guild.id, serverData => {
            if (serverData.joinChannel != "0" && serverData.joinMessage != "") {
                const channel = guild.channels.cache.get(serverData.joinChannel)
                if (channel != null) {
                    channel.send(
                        serverData.joinMessage.replace("@user", `Repeating Scheduler`)
                    )
                }
            }
        })
    })
}


let rule = new RecurrenceRule();

rule.second = 0;
rule.minute = 4;
rule.hour = 0;


scheduleJob(rule, function () {
    sendForAll()
});

console.log("Bot working!")