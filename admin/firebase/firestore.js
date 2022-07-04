import { firestore } from "./init.js";
import {extendFirebaseTime,extendTelegramTime} from "../utils.js"
//Collection users;
async function createUserDocument({ uid, user }) {
	try {
		log(`Adding ${uid} to datastore`)
		const userDocument = await firestore.collection(`Users`).doc(uid).set(user)
		log(`${uid} created in datastore`)
		return userDocument
	} catch (e) {
		error(e)
		return null;
	}
}

async function getUserDocument({ uid }) {
	try {
		const doc = await firestore.collection("Users").doc(uid).get()
		if (!doc.exists()) return null
		return doc.data()
	} catch (e) {
		error(e)
		return null
	}
}

async function updateUserDocument({ uid, update }) {
	try {
		return await firestore.collection("Users").doc(uid).update(update)
	} catch (e) {
		error(e)
		return null
	}

}

async function deleteUserDocument({ uid }) {
	try {
		log(`Deleting ${uid} from datastore`)
		await firestore.collection("Users").doc(uid).delete()
		log(`${uid} deleted datastore`)
	} catch (e) {
		error(e)
	}
}

///////////////////////////////////////////////////////////////////////////////////

async function createReferee({ uid, user, referrer }) {
	if (referrer) {
		const totalDays = parseInt(process.env.FREE_TRIAL_PERIOD || 10) + parseInt(process.env.REFERRAL_BONUS || 5)
		const currentUserExpiryDate = extendTelegramTime(user.createdAt, totalDays)
		return await createUserDocument({
			uid,
			user: {
				...user,
				expiryDate: currentUserExpiryDate,
				referredBy: referrer,
			}
		})
	} else {
		return await createUserDocument({
			uid, user: {
				...user,
				expiryDate: extendTelegramTime(user.createdAt, parseInt(process.env.FREE_TRIAL_PERIOD || 10)),
			}
		})
	}
}

async function updateReferrer({ uid, oldDocument, referredTime }) {
	const oldReferrals = oldDocument.referrals

	if (!oldReferrals) oldReferrals = []
	if (oldReferrals.length < (process.env.MAX_REFERRALS_ALLOWED || 20)) {
		const newReferrals = [
			...oldReferrals,
			{
				referred: referee,
				at: referredTime,
			},
		]
		const newExpiryDate = extendFirebaseTime(oldDocument.expiryDate, parseInt(process.env.REFERRAL_BONUS || 1))
		await updateUserDocument({
			uid, update: {
				expiryDate: newExpiryDate,
				referrals: newReferrals,
			}
		})
		return {
			success : true,
			expiryDate : newExpiryDate
		}
	}
	return {
		success : false,
		expiryDate : oldDocument.expiryDate
	}
}














export default {
	Users: {
		createUserDocument,
		getUserDocument,
		deleteUserDocument,
		updateUserDocument,
		createReferee,
		updateReferrer,
	}

}