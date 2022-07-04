import {firestore,database} from "./init.js"

async function start(){
	console.log("✅ Process started")
	const db = (await database.ref("/1700/questions").limitToFirst(10).get()).val()
	const store = firestore.collection("MCQs")
	await Promise.all(db.map(async (question,index) => {
		await store.doc(`${index}`).set(question)
		console.log(`Created doc : ${index}`)
	}))
}




start()
