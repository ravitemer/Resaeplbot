import { auth} from "./init.js";

//========================== Auth ===================================

async function createUserAccount({uid,user}) {
	try {
		log("Creating user in auth")
		const userAuthRec = await auth.createUser({
			uid,
			displayName: `${user.firstName} ${user.lastName}`,
		})
		log(`Created user with auth uid : ${uid}`)
		return userAuthRec;
	} catch (e) {
		if (e.code === "auth/uid-already-exists") {
			warn("User already there")
			return await getUserAccount({ uid})
		} else {
			error(e)
			return null;
		}
	}
}

async function getUserAccount({uid}){
	try {
			const userAuthRec = await auth.getUser(uid)
			return userAuthRec
	} catch (e) {
		if (e.code === "auth/user-not-found") {
			warn("User not found")
			return null;
		} else {
			error(e.message)
			return null;
		}
	}
}

async function deleteUserAccount({uid}){
	try {
		log(`Deleting ${uid} from auth. All claims will be lost`)
		await auth.deleteUser(uid)
		log(`Deleted ${uid} : All data wiped`)
	} catch (e) {
		if (e.code === "auth/user-not-found") {
			log(`No user record found to delete`)
		} else {
			error(e)
		}
	}
}
//======================================================================




export default {
	createUserAccount,
	getUserAccount,
	deleteUserAccount,
	auth,
}