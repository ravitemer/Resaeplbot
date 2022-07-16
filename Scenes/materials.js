import { Scenes, Composer } from "telegraf"

const composer = new Composer()


//=============== STEPS =====================
const steps = [
	async (ctx) => {
		let materials = await admin.materials.getCategories()
		let categories = Object.entries(materials).map(([key, value]) => {
			return [
				markup.button.callback(`${key}`, `materials_cat_but_${key}`)
			]
		})
		const obj = {
			text: "Choose from the following categories...",
			keyboard: markup.inlineKeyboard(categories),
		}
		ctx.wizard.state.categoriesObj = obj
		ctx.wizard.state.materials = materials
		await ctx.reply(obj.text, obj.keyboard)
		ctx.wizard.next()
	},
	composer,
]
//================ Power =================
composer.action("materials_back_to_cat", async ctx => {
	const obj = ctx.wizard.state.categoriesObj || {}
	await ctx.editMessageText(obj.text, obj.keyboard)
})





composer.action(/materials_cat_but_.+/, async (ctx) => {
	ctx.answerCbQuery()
	const buttonId = ctx.match[0]
	const category = buttonId.substr(18)
	ctx.wizard.state.currentCategory = category
	let subCategories = await admin.materials.getSubCategories(category)
	subCategories = Object.entries(subCategories).map(([key, value]) => {
		return [
			markup.button.callback(`${key}`, `materials_subcat_but_${key}`)
		]
	})
	subCategories.push([
		markup.button.callback("⏪ Back", "materials_back_to_cat")
	])
	await ctx.editMessageText(`Choose a subcategory from ${category}`, markup.inlineKeyboard(subCategories))
})

composer.action(/materials_subcat_but_.+/, async ctx => {
	ctx.answerCbQuery()
	const buttonId = ctx.match[0]
	const category = ctx.wizard.state.currentCategory
	if (!category) return
	const subCategory = buttonId.substr(21)
	const subCategoryItems = ctx.wizard.state.materials[category][subCategory] || []
	if (subCategoryItems.length > 0) {
		await Promise.all(subCategoryItems.map(async ({ filename, file_id }) => {
			await ctx.replyWithDocument(file_id, { protect_content: true, })
		}))

	} else {
		await ctx.reply(`Sorry... No files found in this category`)
	}
})

//============ Default =============

//=============== SCENE ======================
const scene = new Scenes.WizardScene('materials', ...steps);

scene.leave(async (ctx) => {
	const msgs = ctx.wizard.state.deletableMsgs
	if (msgs.length > 0) {
		await Promise.all(msgs.map(async msg => ctx.telegram.deleteMessage(msg.chat_id, msg.message_id)))
		delete ctx.wizard.state.deletableMsgs
	}
})

export default scene;
//==================== UTILS =======================
// function createDocumentsMenu({ data }) {
// 	const menu = {
// 		text: "Choose from the following categories..."
// 	}
// 	let keyboard = []
// 	for (let [key, value] of Object.entries(data)) {
// 		key = key.split(" ").join("-")
// 		keyboard.push({
// 			[`doc_cat_${key}`]: {
// 				name: key,
// 				submenu: createSubMenu({ data: value, category: key })
// 			}
// 		})
// 	}
// 	menu.keyboard = keyboard
// 	return menu
// }

// function createSubMenu({ data, category }) {
// 	const menu = {
// 		text: `Choose from categories in ${category}`
// 	}
// 	let keyboard = []
// 	for (let [key, value] of Object.entries(data)) {
// 		key = key.split(" ").join("-")
// 		keyboard.push({
// 			[`doc_subcat_${key}`]: {
// 				name: `${key} - ` + emojify`${value.length}`,
// 				handler: async ({ ctx }) => {
// 					const uid = ctx.callbackQuery.from.username
// 					await utils.emoji({
// 						ctx,
// 						done: async ({ message_id, chat_id }) => {
// 							const isAllowed = await admin.user.isAllowed({ uid })
// 							if (isAllowed === true) {
// 								ctx.answerCbQuery()
// 								if (value.length > 0) {
// 									await Promise.all(value.map(async ({ filename, file_id }) => {
// 										await ctx.replyWithDocument(file_id, { protect_content: true, })
// 									}))

// 								} else {
// 									await ctx.reply(`Sorry... No files found in this category`)
// 								}
// 							}else {
// 								await ctx.reply(`Oops! You have limited access. Click /subscription for further information.`)
// 							}
// 						}
// 					})

// 				}
// 			}
// 		})
// 	}
// 	keyboard.push(utils.menuBackButton("back_to_cat"))
// 	menu.keyboard = keyboard
// 	return menu
// }