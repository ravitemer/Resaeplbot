import {initializeApp} from "firebase/app";
import {getDatabase, ref, set, get, update, push, onValue} from "firebase/database";

const firebaseConfig = {
	apiKey: "AIzaSyDiHX-1gxvke-HIj6WGxuOWEkEl9K57xk0",
	authDomain: "test-558.firebaseapp.com",
	databaseURL: "https://test-558-default-rtdb.firebaseio.com",
	projectId: "test-558",
	storageBucket: "test-558.appspot.com",
	messagingSenderId: "712415353562",
	appId: "1:712415353562:web:233dae7162a314a420e3e3",
};

const app = initializeApp(firebaseConfig);
const rtdb = getDatabase(app);


export class FirebaseDB {
	constructor() {
		// this.url = url;
		this.db = rtdb;
	}
	//get data from firebase
	async getItem(path) {
		// eslint-disable-next-line no-useless-catch
		try {
			let data = (await get(ref(this.db, path))).val();
			return data;
		} catch (error) {
			throw error;
		}
	}
	//listen to firebase
	async listen(path, action) {
		try {
			const pathRef = ref(this.db, path);
			onValue(pathRef, async (snapshot) => {
				const data = snapshot.val();
				await action(data);
			});
		} catch (error) {
			throw error;
		}
	}
	//set data to firebase
	async setItem(path, data) {
		try {
			return await set(ref(this.db, path), data);
		} catch (error) {
			throw error;
		}
	}
	//push data to firebase
	async pushItem(path, data) {
		try {
			const postRef = push(ref(this.db, path));
			return await set(postRef, data);
		} catch (e) {
			throw e;
		}
	}
	//delete data from firebase
	async deleteItem(path) {
		try {
			return await set(ref(this.db, path), null);
		} catch (error) {
			throw error;
		}
	}

	//update data to firebase
	async updateItem(path, data) {
		try {
			return await update(ref(this.db, path), data);
		} catch (error) {
			throw error;
		}
	}
}