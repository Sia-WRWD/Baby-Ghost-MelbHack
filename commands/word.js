const { SlashCommandBuilder } = require('@discordjs/builders');
const http = require('https');
const { MessageEmbed } = require('discord.js');
var word = '';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('word')
		.setDescription('Replies with a word!'),
	async run({ client, interaction }) {

		var url = "https://random-words-api.vercel.app/word";
		http.get(url, res => {
			let data = '';
			res.on('data', chunk => {
				data += chunk;
			});
			res.on('end', () => {
				data = JSON.parse(data);

				word = Object.values(data);

				var resEmbed = new MessageEmbed()
					.setTitle("Word of the Day!")
					.setURL("https://github.com/mcnaveen/Random-Words-API")
					.addFields(
						{
							name: `${word[0].word}`,
							value:
								`
                                    Definition: \"${word[0].definition}\"
                                    Pronunciation: *${word[0].pronunciation}*
                                `
						}
					)
					.setImage("https://c.tenor.com/q007-hs_gxwAAAAM/cute-plus-one.gif")
					.setFooter({ text: 'New Word', iconURL: 'https://c.tenor.com/q007-hs_gxwAAAAM/cute-plus-one.gif' });

				interaction.channel.send({ embeds: [resEmbed] });
			});
		}).on('error', err => {
			console.log(err.message);
		});
	},
}