import jwt from "jsonwebtoken";
import {auth} from "./firebase/init.js"
import FSDB from "file-system-db";
const fsdb =  new FSDB()

//=============================================================================
export async function sendReferralLink({ ctx }) {
	//await ctx.log(`Generating referral link for ${uid}`)
	//const token = jwt.sign(uid,process.env.JWT_SECRET_KEY)
	const info = `
Hey there! 
I found this amazing telegram bot that helps me with my PLAB preparation. You can use my link and get extra ${process.env.REFERRAL_BONUS} days of unlimited access.
https://t.me/${ctx.botInfo.username}?start=admin`
	await utils.emoji({
		ctx,
		emoji: "📣",
		done: async () => {
			// await ctx.replyWithPhoto("https://picsum.photos/300/300?random", { caption: info })
			await ctx.replyWithHTML(info)
			await ctx.reply("You get referral credits whenever a new user signup using the above link. You can share it anywhere not just telegram.")
		}
	})

}


//==================================================================================
export function extendFirebaseTime(oldExpiryDate, days) {
	let oldDate = (oldExpiryDate && oldExpiryDate.toDate) ? oldExpiryDate.toDate() : new Date()
	return dayjs(oldDate).add(days, "day").toDate()
}

export function extendTelegramTime(oldExpiryDate, days) {
	let oldDate = dayjs.unix(parseInt(oldExpiryDate))
	return oldDate.add(days, "day").toDate()
}





//=============================================================================


export function verifyJWT(token) {
	try {
		const data = jwt.verify(token, process.env.JWT_SECRET_KEY)
		return data
	} catch (e) {
		console.log(e)
		return null
	}
}
//===================================================================================

export default {
	verifyJWT,
	extendFirebaseTime,
	extendTelegramTime,
	sendReferralLink,
	fsdb
	
}