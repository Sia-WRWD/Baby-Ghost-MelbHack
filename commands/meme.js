const { SlashCommandBuilder } = require('@discordjs/builders');
const http = require('https');
const { MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('meme')
		.setDescription('Replies with a meme!')
		.addStringOption(option =>
			option.setName('type')
				.setDescription('The type of jokes')
				.setRequired(true)
				.addChoice("memes", "memes")
				.addChoice("wholesome", "wholesomememes")
				.addChoice("dank", "dankmemes")
				.addChoice("economy", "memeeconomy")),
	async run({ client, interaction }) {
		const type = interaction.options.getString("type");

		var url = `https://meme-api.herokuapp.com/gimme/${type}/10`;
		http.get(url, res => {
			let data = '';
			res.on('data', chunk => {
				data += chunk;
			});
			res.on('end', () => {
				data = JSON.parse(data);

				var totalResults = data.memes.length;
				var indexResults = Math.floor(Math.random() * totalResults)
				var finalResult = data.memes[indexResults];

				var authorLink = `https://www.reddit.com/user/${finalResult.author}/`

				var resEmbed = new MessageEmbed()
					.setTitle("Have a Meme")
					.setURL("https://github.com/D3vd/Meme_Api")
					.addFields(
						{
							name: `query: ${type}`,
							value: 
								`
									\"${finalResult.title}\"
									*(Credit: [${finalResult.author}](${authorLink}))*
								`
						}
					)
					.setImage(finalResult.url)
					.setFooter({ text: `Dank Memes`, iconURL: 'https://i.pinimg.com/originals/b4/85/69/b4856907e8237ec660bb3975908b2337.jpg' });

				interaction.channel.send({ embeds: [resEmbed] });
			});
		}).on('error', err => {
			console.log(err.message);
		});
	},
}