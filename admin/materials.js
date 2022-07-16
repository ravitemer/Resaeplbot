import {get,set,push} from "./firebase/database.js";

async function getCategories(){
	return (await get("materials/categories")) || {}
}

async function getSubCategories(category){
	return (await get(`materials/categories/${category}`)) || {}
}

async function sendCategories({ctx}){
		let materials = await getCategories()
		let categories = Object.entries(materials).map(([key, value]) => {
			return [
				markup.button.callback(`${key}`, `materials_cat_but_${key}`)
			]
		})
		const obj = {
			text: "Choose from the following categories...",
			keyboard: markup.inlineKeyboard(categories),
		}
		ctx.session.categoriesObj = obj
		ctx.session.materials = materials
		await ctx.reply(obj.text, obj.keyboard)
}


async function saveFile({category,subCategory, filename, file_id }){
	await push(`materials/categories/${category}/${subCategory}/files`,{
		filename,file_id
	})
}

async function createCategory({category}){
	await set(`materials/categories/${category}`,{
		_meta : {
			id : category
		}
	})
}

async function createSubCategory({category,subCategory}){
	await set(`materials/categories/${category}/${subCategory}`,{
		_meta : {
			category,
			subCategory
		}
	})
}











export default {
	getCategories,
	getSubCategories,
	sendCategories,
	createCategory,
	createSubCategory,
	saveFile
}