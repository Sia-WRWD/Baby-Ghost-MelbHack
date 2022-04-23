const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('quiz')
        .setDescription('Replies with a quiz!')
        .addStringOption(option =>
            option.setName('type')
                .setDescription('The type of quiz')
                .setRequired(true)
                .addChoice("History", "history")
                .addChoice("Geography", "geography")
                .addChoice("Computer Science", "computer science")
                .addChoice("Mathematics", "mathematics")
                .addChoice("Movies", "movies")
                .addChoice("Books", "books")
                .addChoice("Music", "music"))
        .addStringOption(option =>
            option.setName('difficulty')
                .setDescription('Difficulty of the quiz')
                .setRequired(true)
                .addChoice('Easy', 'easy')
                .addChoice('Medium', 'medium')
                .addChoice('Hard', 'hard')),
    async run({ client, interaction }) {

        var type = interaction.options.getString('type');
        const difficulty = interaction.options.getString('difficulty');
        var category = '';

        switch (type) {
            case 'history':
                category = 23;
                break;
            case 'geography':
                category = 22;
                break;
            case 'computer science':
                category = 18;
                break;
            case 'mathematics':
                category = 19;
                break;
            case 'movies':
                category = 11;
                break;
            case 'books':
                category = 10;
                break;
            case 'music':
                category = 12;
                break;
        }

        var url = `https://opentdb.com/api.php?amount=1&category=${category}&difficulty=${difficulty}&type=multiple`;
        const response = await fetch(url);
        const data = await response.json();

        var incorrectAnswers = data.results[0].incorrect_answers;
        var correctAnswer = data.results[0].correct_answer;
        var startingIndex = Math.floor(Math.random() * 3);
        var answers = [];

        incorrectAnswers.forEach(option => {
            answers.push(option);
        })

        answers.splice(startingIndex, 0, correctAnswer);

        function convert(string) {
            return string.replace(/&#(?:x([\da-f]+)|(\d+));/ig, function (_, hex, dec) {
                return String.fromCharCode(dec || +('0x' + hex))
            })
        }

        var resEmbed = new MessageEmbed()
            .setTitle(`${type} quiz`)
            .setURL("https://opentdb.com/api_config.php")
            .addFields(
                {
                    name: convert(`${data.results[0].question} You have 20 seconds to answer, copy and paste the correct answer!`),
                    value: convert(
                        `
                            [a] ${answers[0]}
                            [b] ${answers[1]}
                            [c] ${answers[2]}
                            [d] ${answers[3]}
                        `)
                }
            )
            .setImage("https://c.tenor.com/JfFIxtoErUkAAAAM/frye-stare.gif")
            .setFooter({ text: `${type} quiz`, iconURL: 'https://c.tenor.com/JfFIxtoErUkAAAAM/frye-stare.gif' });

        console.log(correctAnswer);

        const filter = response => {
            return correctAnswer.toLowerCase() == response.content.toLowerCase();
        };

        interaction.reply({ embeds: [resEmbed] }, { fetchReply: true })
            .then(() => {
                interaction.channel.awaitMessages({ filter, max: 1, time: 20000, errors: ['time'] })
                    .then(collected => {
                        interaction.followUp(`${collected.first().author} got the correct answer!`);
                    })
                    .catch(collected => {
                        interaction.followUp(`Sadge, you ran out of time! The correct answer is ${correctAnswer}`);
                    })
            })

    },
}