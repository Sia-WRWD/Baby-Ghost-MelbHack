const { SlashCommandBuilder } = require('@discordjs/builders');
const http = require('https');
const { MessageEmbed } = require('discord.js');
var fQuote = '';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('quote')
        .setDescription('Replies with a random quote!')
        .addStringOption(option =>
            option.setName('type')
                .setDescription('The type of quotes')
                .setRequired(true)
                .addChoice("inspirational", "inspirational")
                .addChoice("programming", "programming")
                .addChoice("anime", "anime")),
    async run({ client, interaction }) {

        const type = interaction.options.getString('type');

        switch (type) {
            case 'anime':
                var url = "https://animechan.vercel.app/api/random";
                http.get(url, res => {
                    let data = '';
                    res.on('data', chunk => {
                        data += chunk;
                    });
                    res.on('end', () => {
                        data = JSON.parse(data);
                        fQuote = Object.values(data);

                        var animeName = fQuote[0].toLowerCase();

                        switch (animeName.indexOf) {
                            case ",":
                                var animeName = animeName.replace(/,/g, '');
                                animeName = animeName.replace(/ /g, '-');
                                animeName = encodeURI(animeName.toLowerCase());
                            case "*":
                                var animeName = animeName.replace(/\*/g, '');
                                animeName = animeName.replace(/ /g, '-');
                                animeName = encodeURI(animeName.toLowerCase());
                                break;
                            default:
                                var animeName = animeName.replace(/ /g, '-');
                                animeName = encodeURI(animeName.toLowerCase());
                                break;
                        }

                        var resEmbed = new MessageEmbed()
                            .setTitle("Anime Quote")
                            .setURL("https://animechan.vercel.app/")
                            .addFields(
                                {
                                    name: `Query: ${type}`,
                                    value:
                                        `
                                    \"${fQuote[2]}\"
                                    - *${fQuote[1]} from [${fQuote[0]}](https://www.anime-planet.com/anime/${animeName})*
                                `
                                }
                            )
                            .setImage("https://media0.giphy.com/media/QmH8OnsBQvC4yn8BnX/giphy.gif")
                            .setFooter({ text: 'Anime Quotes', iconURL: 'https://github.com/rocktimsaikia/anime-chan/raw/main/images/animechan_logo.png' });

                        interaction.channel.send({ embeds: [resEmbed] });
                    });
                }).on('error', err => {
                    console.log(err.message);
                });

                break;
            case 'programming':
                var url = "https://programming-quotes-api.herokuapp.com/Quotes/random";
                http.get(url, res => {
                    let data = '';
                    res.on('data', chunk => {
                        data += chunk;
                    });
                    res.on('end', () => {
                        data = JSON.parse(data);
                        fQuote = Object.values(data);

                        var resEmbed = new MessageEmbed()
                            .setTitle("Programming Quote")
                            .setURL("https://programming-quotes-api.herokuapp.com/index.html")
                            .addFields(
                                {
                                    name: `Query: ${type}`,
                                    value:
                                        `
                                    \"${fQuote[2]}\"
                                    - *${fQuote[1]}*
                                `
                                }
                            )
                            .setImage("https://c.tenor.com/i_K3zWsgcG8AAAAi/hacker-pepe.gif")
                            .setFooter({ text: 'Programming Quotes', iconURL: 'https://c.tenor.com/i_K3zWsgcG8AAAAi/hacker-pepe.gif' });

                        interaction.send({ embeds: [resEmbed] });
                    });
                }).on('error', err => {
                    console.log(err.message);
                });

                break;
            case 'inspirational':
                var url = "https://inspirational-quotes-api.herokuapp.com/quotes";
                http.get(url, res => {
                    let data = '';
                    res.on('data', chunk => {
                        data += chunk;
                    });
                    res.on('end', () => {
                        data = JSON.parse(data);

                        var totalResults = data.length;
                        var indexResults = Math.floor(Math.random() * totalResults)

                        fQuote = Object.values(data[indexResults]);

                        var resEmbed = new MessageEmbed()
                            .setTitle("Inspirational Quote")
                            .setURL("https://github.com/bmumz/inspirational-quotes-api")
                            .addFields(
                                {
                                    name: `Query: ${type}`,
                                    value:
                                        `
                                    \"${fQuote[1]}\"
                                    - *${fQuote[2]}*
                                `
                                }
                            )
                            .setImage("https://www.incimages.com/uploaded_files/image/1920x1080/getty_615524918_379849.jpg")
                            .setFooter({ text: 'Inspirational Quotes', iconURL: 'https://www.incimages.com/uploaded_files/image/1920x1080/getty_615524918_379849.jpg' });

                        interaction.channel.send({ embeds: [resEmbed] });
                    });
                }).on('error', err => {
                    console.log(err.message);
                });

                break;
            default:
                break;
        }
    },
}