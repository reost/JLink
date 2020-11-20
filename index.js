const TelegramBot = require('node-telegram-bot-api')
const axios = require('axios')
const cheerio = require('cheerio')
const he = require('he')

const token = 'YOUR_BOT_TOKEN'

const bot = new TelegramBot(token, {polling: true})

const url = 'https://javdoe.tv/search.html?q='

const url2 = 'https://www2.javhdporn.net/video/'

bot.onText(/\/start/, (msg) => {
	bot.sendMessage(msg.chat.id, "Welcome")
});

bot.onText(/\/jav/, (msg) => {
	const arg = msg.text.split(" ")
	if(arg.length > 2 || arg.length < 2) return bot.sendMessage(msg.chat.id, "Penggunaah Salah\n\npenggunaan : /jav [kode]")
	axios(url+arg[1])
	.then(response => {
		const html = response.data
		const $ = cheerio.load(html)
		const buttons = $('a.lg-button')
		if(!buttons) return bot.sendMessage(msg.chat.id, "Kode tidak ditemukan")
		const a = buttons[0].attribs.href
		const data = a.replace("https://api.123lnk.com/?redirect=1&key=d1af76c1970f88488f7719b291daed45&link=", "");
		const photo = $('meta[property="og:image"]')[0].attribs.content
		const title = $('li.active')[0].children[0].data
		bot.sendPhoto(msg.chat.id, photo, {caption : `JAV Code : ${arg[1]}\n\nTitle : ${title}\n\nLink download : ${data}`})
	})
	.catch(error => {
		bot.sendMessage(msg.chat.id, "Error : "+error.reason)
	})
})

bot.onText(/\/jap/, (msg) => {
	const arg = msg.text.split(" ")
	if(arg.length > 2 || arg.length < 2) return bot.sendMessage(msg.chat.id, "Penggunaah Salah\n\npenggunaan : /jap [kode]")
	axios(url2+arg[1], {maxRedirects : 0})
	.then(response => {
		const html = response.data
		const $ = cheerio.load(html)
        const data = $('script.yoast-schema-graph')
		const dataObj = data[0].children[0].data
		const parsed = JSON.parse(dataObj)
		const embeded = parsed['@graph'][3].embedURL
		const thumbnail = parsed['@graph'][3].thumbnailUrl
		const title = he.decode(parsed['@graph'][3].name)
		bot.sendPhoto(msg.chat.id, thumbnail, {caption : `JAV Code : ${arg[1]}\n\nTitle : ${title}\n\nLink download : https://9xbud.com/${embeded}`})
	})
	.catch(error => {
		bot.sendMessage(msg.chat.id, "Error / kode tidak ditemukan")
	})
})
