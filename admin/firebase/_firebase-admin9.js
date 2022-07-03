import  admin from "firebase-admin";
import serviceAccount from "./firebase-service-secret.json";

const app = admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: "https://test-558-default-rtdb.firebaseio.com"
});
const auth = app.auth()
const database = app.database()
const firestore = app.firestore()
