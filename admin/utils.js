import jwt from "jsonwebtoken";
import CryptoJS from "crypto-js"
import {auth} from "./firebase/init.js"
import FirebaseAdmin from "./firebase/index.js";
// const {Auth} = FirebaseAdmin


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
export function isFromTelegram(telegramInitData){
	const initData = new URLSearchParams(telegramInitData);
	const hash = initData.get("hash");
	const user = initData.get("user")

	let dataToCheck = [];

	initData.sort();
	initData.forEach((val, key) => key !== "hash" && dataToCheck.push(`${key}=${val}`));

	const secret = CryptoJS.HmacSHA256(process.env.TELEGRAM_BOT_TOKEN, "WebAppData");
	const _hash = CryptoJS.HmacSHA256(dataToCheck.join("\n"), secret).toString(CryptoJS.enc.Hex);

	const isFromTele = _hash === hash;
	return {
		isGenuine: isFromTele,
		user: JSON.parse(user)
	}
}


export function verifyJWT(token) {
	try {
		const data = jwt.verify(token, process.env.JWT_SECRET_KEY)
		return data
	} catch (e) {
		console.log(e)
		return null
	}
}
export async function sendFirebaseToken(user) {
	let uid = user.username
	if (!uid) throw new Error("NO UID Sent")
	try {
		const user = await Auth.getUserAccount({uid})
		let claims = {
			admin: false,
		}
		if (user) {
			claims = user.customClaims
			const token = await auth.createCustomToken(uid, claims)
			return token
		}
	} catch (e) {
		error(e)
	}

}
//===================================================================================

export default {
	verifyJWT,
	isFromTelegram,
	extendFirebaseTime,
	extendTelegramTime,
	sendReferralLink,
	sendFirebaseToken,
	
}