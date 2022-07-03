//==============9=====================
import  admin from "firebase-admin";
import serviceAccount from "./firebase-service-secret.json";

const app = admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: "https://test-558-default-rtdb.firebaseio.com"
});
export const auth = app.auth()
export const database = app.database()
export const firestore = app.firestore()


//============== 11 =======not working========

// import { initializeApp, applicationDefault, cert } from 'firebase-admin/app';
// import {getAuth} from "firebase-admin/auth";
// import {getDatabase} from "firebase-admin/database";
// import { getFirestore } from 'firebase-admin/firestore';
// import serviceAccount from "./firebase-service-secret.json";

// const admin = initializeApp({
// 	credential: cert(serviceAccount),
// 	databaseURL: "https://test-558-default-rtdb.firebaseio.com"	
// })
// const auth = getAuth(admin)
// const firestore = getFirestore(admin)
// const database = getDatabase(admin) 

