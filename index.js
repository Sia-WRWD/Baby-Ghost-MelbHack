require('dotenv').config();
const fs = require('node:fs');
const { Client, Intents, Collection } = require('discord.js');

const token = process.env.token;

const client = new Client({
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_VOICE_STATES
	]
});

client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

//Get Command Files
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);

    client.commands.set(command.data.name, command);
}

client.on('ready', async () => {
    console.log(`Logged in as ${client.user.tag}`);
})

//Actions
client.on('interactionCreate', async interaction => {
    async function handleCommand() {
        if (!interaction.isCommand()) return;

        const command = client.commands.get(interaction.commandName);

        if (!command) return;

        try {
            await command.run({ client, interaction });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'There was an error while executing the command!', ephemeral: true });
        }
    }

    handleCommand();
});

// Login to Discord with your client's token
client.login(token);