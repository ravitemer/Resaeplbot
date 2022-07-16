import { database } from "./init.js";



export async function get(path){
	try {
		const ref = database.ref(path)
		const data = await ref.once("value")
		return data.val()
	} catch (e) {
		console.error(e)
	}
}


export async function set(path,data){
	try {
		const ref = database.ref(path)
		await ref.set(data)
	} catch (e) {
		console.error(e)
	}
}

export async function del(path){
	try {
		const ref = database.ref(path)
		await ref.set(null)
	} catch (e) {
		console.error(e)
	}
}
export async function push(path,data){
	try {
		const ref = database.ref(path)
		await ref.push().set(data)
	} catch (e) {
		console.error(e)
	}
}

export async function update(path,data){
	try {
		const ref = database.ref(path)
		await ref.update(data)
	} catch (e) {
		console.error(e)
	}
}



export default {
	get,
	set,
	update,
	del,
	push
}