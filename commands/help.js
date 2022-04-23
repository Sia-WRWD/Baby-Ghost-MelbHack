const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require("discord.js");
var fs = require("fs");

var help = fs.readFileSync("./assets/help.txt").toString('utf-8');
const commandList = help.split("\n").sort();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Replies with list of commands available'),
	async run({client, interaction}) {
        
		await interaction.channel.send(
            "The Command List have been sent to your private messages!"
        );

        const user = client.users.cache.get(interaction.member.user.id);

        const commandListEmbed = new MessageEmbed()
            .setTitle("Command List")
            .setDescription("List of Commands you can call for the bot to perform!")
        commandList.forEach(entry => {
            var data = entry.split(" - ");
            commandListEmbed.addField(data[0], data[1], false);
        });

        await user.send({ content: "Here are the requested commands:\n", embeds: [commandListEmbed] });

	},
}