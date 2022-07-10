import jwt from "jsonwebtoken";
import {auth} from "./firebase/init.js"
import FSDB from "file-system-db";
const fsdb =  new FSDB()



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
	fsdb
	
}