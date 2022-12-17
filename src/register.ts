import { REST, Routes, SlashCommandBuilder } from 'discord.js'
import dotenv from 'dotenv'

dotenv.config()

const commands = [
  new SlashCommandBuilder().setName('update').setDescription('Update Grade Roles').setDescriptionLocalization("ja", "学年ロールを更新"),
  new SlashCommandBuilder().setName('christmas').setDescription('Christmas Poll').setDescriptionLocalization("ja", "クリスマス用"),
  new SlashCommandBuilder().setName('about').setDescription('About this bot').setDescriptionLocalization("ja", "このBotについて"),
  new SlashCommandBuilder().setName('help').setDescription('How to use this bot').setDescriptionLocalization("ja", "このBotの使い方"),
].map(command => command.toJSON());;

const token: string = process.env.BOT_TOKEN ?? 'a'
const appid: string = process.env.APP_ID ?? "a"

const rest = new REST({ version: '9' }).setToken(token);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(Routes.applicationCommands(appid), {
      body: commands,
    });

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();