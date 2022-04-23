const { SlashCommandBuilder } = require('@discordjs/builders');
const http = require('https');
const { MessageEmbed } = require('discord.js');
var joke = '';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('joke')
		.setDescription('Replies with a joke!'),
	// .addStringOption(option =>
	// 	option.setName('type')
	// 		.setDescription('The type of jokes')
	// 		.setRequired(true)
	// .addChoice("programming", "programming")
	// .addChoice("anime", "anime")
	// .addChoice("general", "general")
	// .addChoice("knock", "knock")
	// .addChoice("food", "food")
	// .addChoice("anime", "anime")
	// .addChoice("dad", "dad")),
	async run({ client, interaction }) {
		// const type = interaction.options.getString("type");

		// switch(type) {
		// 	case 'programming':
		// 		break;
		// 	case 'funny':
		// 		break;
		// 	case 'dad':
		// 		break;

		var url = "https://daily-jokes.herokuapp.com/api/jokes";
		http.get(url, res => {
			let data = '';
			res.on('data', chunk => {
				data += chunk;
			});
			res.on('end', () => {
				data = JSON.parse(data);

				var totalResults = data.length;
				var indexResults = Math.floor(Math.random() * totalResults)

				joke = Object.values(data[indexResults]);

				var resEmbed = new MessageEmbed()
					.setTitle("Random Joke")
					.setURL("https://github.com/jkbkupczyk/jokes-api")
					.addFields(
						{
							name: `Random Joke`,
							value:
								`
                                    \"${joke[2]}\"
                                    - ||*${joke[3]}*||
                                `
						}
					)
					.setImage("https://i.makeagif.com/media/9-30-2015/sp1zbj.gif")
					.setFooter({ text: 'Random Jokes', iconURL: 'https://cdn.wccftech.com/wp-content/uploads/2021/12/Face-with-tears-of-joy-2.jpg' });

				interaction.channel.send({ embeds: [resEmbed] });
			});
		}).on('error', err => {
			console.log(err.message);
		});
	},
}