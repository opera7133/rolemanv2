import { Client, Message, IntentsBitField, ColorResolvable, EmbedBuilder, TextChannel } from "discord.js";
import * as dotenv from 'dotenv';
import cron from 'node-cron';

dotenv.config()

export const bot = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.GuildMessageReactions,
    IntentsBitField.Flags.MessageContent,
  ],
});

bot.once("ready", async () => {
  console.log("ログインしました");
  cron.schedule('0 0 24 12 *', () => {
    christmas({ cid: process.env.CHANNEL_ID })
  })
  cron.schedule('0 0 1 3 *', () => {
    update({ cid: process.env.CHANNEL_ID, gid: process.env.GUILD_ID })
  })
});

const prefix = "!!";

bot.on("messageCreate", (message: Message) => {
  if (message.author.bot) return;
  if (bot.user && message.mentions.has(bot.user.id)) {
    const role = message.guild?.roles.cache.find(r => r.name === "部員");
    const role2 = message.guild?.roles.cache.find(r => r.name === "見学");
    if (role && !(message.member?.roles.cache.find(r => r.name === "元部員"))) {
      message.reply(`${message.author.username} に部員ロールを付与しました。`)
      message.member?.roles.add(role)
      if (role2) {
        message.member?.roles.remove(role2)
      }
    } else {
      message.reply(`${message.author.username} はすでに部員ロールを持っています。`)
    }
  }
  if (message.content.indexOf(prefix) !== 0) return;
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift()?.toLowerCase();
  if (command === "update") {
    if (message.member?.roles.cache.find(r => r.name === "ほぼAdmin")) {
      update({ message })
    } else {
      const warnEmbed = new EmbedBuilder()
        .setColor(0xFFCD30)
        .setTitle('権限がありません')
        .setDescription("あなたはこのコマンドを実行する権限を持っていません")
        .setThumbnail('https://dl.wmsci.com/image/40px-warn.png')
      message.channel.send({ embeds: [warnEmbed] })
    }
  }
  if (command === "christmas") {
    if (message.member?.roles.cache.find(r => r.name === "ほぼAdmin")) {
      christmas({ message })
    } else {
      const warnEmbed = new EmbedBuilder()
        .setColor(0xFFCD30)
        .setTitle('権限がありません')
        .setDescription("あなたはこのコマンドを実行する権限を持っていません")
        .setThumbnail('https://dl.wmsci.com/image/40px-warn.png')
      message.channel.send({ embeds: [warnEmbed] })
    }
  }
  if (command === "about") {
    const infoEmbed = new EmbedBuilder()
      .setColor(0x0076FF)
      .setTitle('このBotについて')
      .setDescription(`技術科部のメンバーのロールを自動更新してくれたりするBotです。\n\n製作者：${process.env.npm_package_author}\nバージョン：${process.env.npm_package_version}`)
      .setThumbnail('https://dl.wmsci.com/image/40px-info.png')
    message.channel.send({ embeds: [infoEmbed] })
  }
  if (command === "help") {
    const helpEmbed = new EmbedBuilder()
      .setColor(0x0076FF)
      .setTitle('使い方')
      .setThumbnail('https://dl.wmsci.com/image/40px-info.png')
      .addFields(
        { name: '@TCLBロール管理V2', value: '部員ロールを付与' },
        { name: '!!update', value: '学年を更新' },
        { name: '!!help', value: 'このページ' },
        { name: '!!about', value: 'このプログラムについて' },
        { name: '!!exit', value: '終了' },
        { name: 'その他', value: '季節イベント' },
      )
    message.channel.send({ embeds: [helpEmbed] })
  }
});

bot.on("interactionCreate", async (interaction: any) => {
  if (!interaction.isCommand()) {
    return;
  }
  const { commandName } = interaction;
  if (commandName === 'update') {
    if (interaction.member?.roles.cache.find((r: any) => r.name === "ほぼAdmin")) {
      update({ interaction })
    } else {
      const warnEmbed = new EmbedBuilder()
        .setColor(0xFFCD30)
        .setTitle('権限がありません')
        .setDescription("あなたはこのコマンドを実行する権限を持っていません")
        .setThumbnail('https://dl.wmsci.com/image/40px-warn.png')
      interaction.error({ embeds: [warnEmbed] })
    }
  }
  if (commandName === 'christmas') {
    if (interaction.member?.roles.cache.find((r: any) => r.name === "ほぼAdmin")) {
      christmas({ interaction })
    } else {
      const warnEmbed = new EmbedBuilder()
        .setColor(0xFFCD30)
        .setTitle('権限がありません')
        .setDescription("あなたはこのコマンドを実行する権限を持っていません")
        .setThumbnail('https://dl.wmsci.com/image/40px-warn.png')
      interaction.error({ embeds: [warnEmbed] })
    }
  }
  if (commandName === "about") {
    const infoEmbed = new EmbedBuilder()
      .setColor(0x0076FF)
      .setTitle('このBotについて')
      .setDescription(`技術科部のメンバーのロールを自動更新してくれたりするBotです。\n\n製作者：${process.env.npm_package_author}\nバージョン：${process.env.npm_package_version}`)
      .setThumbnail('https://dl.wmsci.com/image/40px-info.png')
    interaction.reply({ embeds: [infoEmbed] })
  }
  if (commandName === "help") {
    const helpEmbed = new EmbedBuilder()
      .setColor(0x0076FF)
      .setTitle('使い方')
      .setThumbnail('https://dl.wmsci.com/image/40px-info.png')
      .addFields(
        { name: '@TCLBロール管理V2', value: '部員ロールを付与' },
        { name: '!!update', value: '学年を更新' },
        { name: '!!help', value: 'このページ' },
        { name: '!!about', value: 'このプログラムについて' },
        { name: '!!exit', value: '終了' },
        { name: 'その他', value: '季節イベント' },
      )
    interaction.reply({ embeds: [helpEmbed] })
  }
})

const update = ({ message, interaction, cid, gid }: { message?: Message, interaction?: any, cid?: string, gid?: string }) => {
  const now = new Date().getFullYear()
  if (message) {
    const third = message.guild?.roles.cache.find(r => r.name === "現3年生");
    third?.edit({ name: `${now - 1964}期(${now})卒業生`, color: "Purple" })
    const second = message.guild?.roles.cache.find(r => r.name === "現2年生");
    second?.edit({ name: "現3年生" })
    const first = message.guild?.roles.cache.find(r => r.name === "現1年生");
    first?.edit({ name: "現2年生" })
    let firstColor = "" as ColorResolvable
    if (first?.hexColor.toLowerCase() === "#f1c40f") {
      firstColor = "Blue"
    } else if (first?.hexColor.toLowerCase() === "#e91e63") {
      firstColor = "Gold"
    } else {
      firstColor = "LuminousVividPink"
    }
    message.guild?.roles.create({ name: "現1年生", color: firstColor })
    const updateEmbed = new EmbedBuilder()
      .setColor(0x0076FF)
      .setTitle('ロールを更新しました')
      .setDescription('メンバーの学年ロールを自動更新しました。')
      .setThumbnail('https://dl.wmsci.com/image/40px-info.png')
    message.channel.send({ embeds: [updateEmbed] })
  } else if (cid && gid) {
    const guild = bot.guilds.cache.get(gid)
    const channel = bot.channels.cache.get(cid) as TextChannel
    const third = guild?.roles.cache.find(r => r.name === "現3年生");
    third?.edit({ name: `${now - 1964}期(${now})卒業生`, color: "Purple" })
    const second = guild?.roles.cache.find(r => r.name === "現2年生");
    second?.edit({ name: "現3年生" })
    const first = guild?.roles.cache.find(r => r.name === "現1年生");
    first?.edit({ name: "現2年生" })
    let firstColor = "" as ColorResolvable
    if (first?.hexColor.toLowerCase() === "#f1c40f") {
      firstColor = "Blue"
    } else if (first?.hexColor.toLowerCase() === "#e91e63") {
      firstColor = "Gold"
    } else {
      firstColor = "LuminousVividPink"
    }
    guild?.roles.create({ name: "現1年生", color: firstColor })
    const updateEmbed = new EmbedBuilder()
      .setColor(0x0076FF)
      .setTitle('ロールを更新しました')
      .setDescription('メンバーの学年ロールを自動更新しました。')
      .setThumbnail('https://dl.wmsci.com/image/40px-info.png')
    channel?.send({ embeds: [updateEmbed] })
  } else if (interaction) {
    const third = interaction.guild?.roles.cache.find((r: any) => r.name === "現3年生");
    third?.edit({ name: `${now - 1964}期(${now})卒業生`, color: "Purple" })
    const second = interaction.guild?.roles.cache.find((r: any) => r.name === "現2年生");
    second?.edit({ name: "現3年生" })
    const first = interaction.guild?.roles.cache.find((r: any) => r.name === "現1年生");
    first?.edit({ name: "現2年生" })
    let firstColor = "" as ColorResolvable
    if (first?.hexColor.toLowerCase() === "#f1c40f") {
      firstColor = "Blue"
    } else if (first?.hexColor.toLowerCase() === "#e91e63") {
      firstColor = "Gold"
    } else {
      firstColor = "LuminousVividPink"
    }
    interaction.guild?.roles.create({ name: "現1年生", color: firstColor })
    const updateEmbed = new EmbedBuilder()
      .setColor(0x0076FF)
      .setTitle('ロールを更新しました')
      .setDescription('メンバーの学年ロールを自動更新しました。')
      .setThumbnail('https://dl.wmsci.com/image/40px-info.png')
    interaction.reply({ embeds: [updateEmbed] })
  }
}

const christmas = ({ message, interaction, cid }: { message?: Message, interaction?: any, cid?: string }) => {
  const christmasEmbed = new EmbedBuilder()
    .setColor(0x00D166)
    .setTitle('Foolay!')
    .setDescription(`明日はクリスマスです。\nみんなでクリスマスをお祝いしましょう！\n何かする予定はありますか？`)
    .setThumbnail('https://dl.wmsci.com/image/40px-christmas.png')
  const pollEmbed = new EmbedBuilder()
    .setColor(0x00D166)
    .setTitle('クリスマス予定ある？')
    .setDescription(`:regional_indicator_a:勉学に励む\n:regional_indicator_b:家でまったり\n:regional_indicator_c:PCで作業\n:regional_indicator_d:どっか行く\n:regional_indicator_e:ないんだな、それが\n:regional_indicator_f:その他`)
  if (message) {
    message.channel.send({ embeds: [christmasEmbed] })
    message.channel.send({ embeds: [pollEmbed] }).then(embedMessage => {
      embedMessage.react("🇦");
      embedMessage.react("🇧");
      embedMessage.react("🇨");
      embedMessage.react("🇩");
      embedMessage.react("🇪");
      embedMessage.react("🇫");
    })
  } else if (cid) {
    const channel = bot.channels.cache.get(cid) as TextChannel
    channel.send({ embeds: [christmasEmbed] })
    channel.send({ embeds: [pollEmbed] }).then(embedMessage => {
      embedMessage.react("🇦");
      embedMessage.react("🇧");
      embedMessage.react("🇨");
      embedMessage.react("🇩");
      embedMessage.react("🇪");
      embedMessage.react("🇫");
    })
  } else if (interaction) {
    interaction.reply({ content: "メッセージが送信されました", ephemeral: true })
    interaction.channel.send({ embeds: [christmasEmbed] })
    interaction.channel.send({ embeds: [pollEmbed] }).then((embedMessage: any) => {
      embedMessage.react("🇦");
      embedMessage.react("🇧");
      embedMessage.react("🇨");
      embedMessage.react("🇩");
      embedMessage.react("🇪");
      embedMessage.react("🇫");
    })
  }
}

async function run() {
  if (!process.env.BOT_TOKEN) {
    throw Error("Could not find BOT_TOKEN in your environment");
  }

  await bot.login(process.env.BOT_TOKEN);
}

run();
