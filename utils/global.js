import {FirebaseDB} from "./db.js";
import {Seventeen} from "./1700.js";
import Utilities from "./utils.js";
import {Markup} from "telegraf"
import axios from 'axios'
import admin from "../admin/index.js"
import Keyboards from "./keyboards.js"
import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime.js'
dayjs.extend(relativeTime)

global.utils = { }
for (let utilFunc in Utilities){
  global.utils[utilFunc] = Utilities[utilFunc]
}

async function wait(ctx,type){
  await ctx.replyWithChatAction(type)
}

const logsObj = utils.consoleLoggerFactory(console)
for (let level in logsObj){
    global[level] = logsObj[level]
}

const isDev = () => process.env.NODE_ENV == "development"

function emojify(strings,...args){
	let numbers = {
		"0" : "0️⃣",
		"1" : "1️⃣",
		"2" : "2️⃣",
		"3" : "3️⃣",
		"4" : "4️⃣",
		"5" : "5️⃣",
		"6" : "6️⃣",
		"7" : "7️⃣",
		"8" : "8️⃣",
		"9" : "9️⃣",
	}
	const str = `${args[0]}`
	return str.replace(/[0-9]/g,(match) => {
		return numbers[match]
	})
}


export default {
  db : new FirebaseDB(),
  sev : new Seventeen(),
  //❗️ Important
  composers : {},
  stickers : {
    "matrix" : "CAACAgIAAxkBAAIF0GKwsxeG28C9veSUY3ytWSU5cSkiAAL6EAACoccoSDllduuTWAejKAQ",
    "greeter" : "CAACAgIAAxkBAAIGwmKw05QBpryeZkuqohIMCfnCtn0XAAKHFQACPQ9QSd6bZv3Wx6O_KAQ",
    "1700" : "CAACAgIAAxkBAAIHMWKxcPizfGNhAkBNiXSgmKI4TNlzAAIXGQACsYgZSmi-eK9wtUfkKQQ",
  },
  wait,
  axios,
  markup : Markup,
  isDev,
  ...Keyboards,
  admin, 
  dayjs,
	emojify,
}