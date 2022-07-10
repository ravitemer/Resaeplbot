import FirebaseCustomAdmin from "./firebase/index.js";
const { Auth, Firestore } = FirebaseCustomAdmin;
import CryptoJS from "crypto-js"
const { Users } = Firestore;


async function toggleReferralNotifications({ uid, shouldEnable }) {
	try {
		await Users.updateUserDocument({
			uid, update: {
				notifyReferrals: shouldEnable ,
			}
		})
	} catch (e) {
		error(e)
	}
}
async function get({uid}){
	return await Users.getUserDocument({uid})
}
async function create({ uid, user, ctx, startPayload }) {
	try {
		log("Creating user account")
		await Auth.createUserAccount({
			uid,
			user
		})
		ctx.log(`Checking whether ${uid} previously used the bot : storeDoc`)
		const userDocument = await Users.getUserDocument({ uid })
		if (!userDocument) {
			log(`This is your first time using the bot.`)
			//Referral logic
			if (startPayload) {
				log(`Start payload found : ${startPayload}`)
				const referrer = startPayload.trim()
				if (uid !== referrer) {
					log(`Referrer : ${referrer} is not same as current : ${uid}`)
					const referrerDocument = await Users.getUserDocument({ uid: referrer })
					if (referrerDocument) {
						log(`Referrer is an existing user. So genuine referral link`)

						//Store current user in store
						const createdUser = await Users.createReferee({ uid, user, referrer: referrer })
						ctx.reply(`🎊 🥳 You are referred by @${referrer}! Your trail has been extended by ${process.env.REFERRAL_BONUS || 1} ${parseInt(process.env.REFERRAL_BONUS || 1) > 1 ? "days" : "day"}. 
Enjoy unlimited access until ${dayjs(createdUser.expiryDate).format('DD/MM/YYYY')}`)

						// Update referrer`s Store
						const updateOperation = await Users.updateReferrer({ uid, oldDocument: referrerDocument,referredTime : user.createdAt })
						if (referrerDocument.notifyReferrals !== false && updateOperation.success) {
							ctx.telegram.sendMessage(referrerDocument.chatId, `
🎊 🥳 Your referral link has been used by @${uid}! Your trail is now extended by ${process.env.REFERRAL_BONUS || 1} ${parseInt(process.env.REFERRAL_BONUS || 1) > 1 ? "days" : "day"}.
Enjoy unlimited access until ${dayjs(updateOperation.expiryDate).format('DD/MM/YYYY')}.
              `)
						}
					} else {
						error(`Referrer does not exist`)
						await Users.createReferee({ uid, user, referrer: null })
					}
				} else {
					error(`Referrer and referee should not be same`)
					await Users.createReferee({ uid, user, referrer: null })
				}
			} else {
				log(`No start payload - Not from a referral link`)
				await Users.createReferee({ uid, user, referrer: null })
			}
		} else {
			log(`This is not the first time you used this bot. Don't worry, Your data is there 😅`)
		}
	} catch (e) {
		error(e)
	}
}

async function del({ uid }) {
		log(`Deleting ${uid} from auth. All claims will be lost`)
		await Auth.deleteUserAccount({uid})
		await Users.deleteUserDocument({ uid })
		log(`Deleted ${uid} : All data wiped`)
}

async function handle({ uid, user, ctx, startPayload }) {
	try {
		log("Checking whether user already there")
		const [userAuthRec, doc] = await Promise.all([
			Auth.getUserAccount({uid}),
			Users.getUserDocument({uid})
		] 
		)
		if (doc && userAuthRec){
			log(`Found user with auth uid and store doc: ${uid}`)	
			await ctx.replyWithHTML(`
Hey! It seems you knew me already🤖. Thanks for visiting me again.
`)
		} else {
			await create({uid,user,ctx,startPayload})
		}
	} catch (e) {
		error(e)
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
			const token = await Auth.auth.createCustomToken(uid, claims)
			return token
		}
	} catch (e) {
		error(e)
	}

}
export async function isAllowed({uid}){
	if (!uid) return error('No uid provided')
	try {
		const userDoc = await get({uid})
		if (!userDoc) return error("No user found")
		const expiryDate = (userDoc.expiryDate && userDoc.expiryDate.toDate) && userDoc.expiryDate.toDate()
		if (!expiryDate) return error("No expiry date")
		return dayjs().isBefore(dayjs(expiryDate))
	} catch (e){
		error(e)
	}
}
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


export default {
	create,
	del,
	toggleReferralNotifications,
	handle,
	get,
	sendFirebaseToken,
	isFromTelegram,
	isAllowed,
}