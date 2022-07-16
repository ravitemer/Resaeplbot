import { Scenes, Composer } from "telegraf"
const composer = new Composer()




const devFeatures = {
	"upload_files": async ({ ctx, dontEdit }) => {
		let documentCategories = await admin.materials.getCategories()
		documentCategories = Object.keys(documentCategories)
		await ctx[dontEdit ? "reply" : "editMessageText"]("Choose a category to upload to...", markup.inlineKeyboard([
			...documentCategories.map(cat => ([markup.button.callback(cat, `upload_file_cat_${cat}`)])),
			[markup.button.callback("🆕 Create category", `upload_file_cat_create`)],
			[markup.button.callback("⏪ Back", `back_to_main`)]
		]))
	},
}
const steps = [
	async (ctx) => {
		await ctx.reply("What can I do for you?", markup.inlineKeyboard([
			[
				markup.button.callback("⏫ Upload files", "dev_upload_files"),
			],
			[
				markup.button.webApp("Dev","https://telegram-nuxt.vercel.app/dev")
			],
		]))
		ctx.wizard.next()
	},
	composer
]
//======================== Actions ===================================
composer.action(/dev_.+/, async (ctx) => {
	const buttonId = ctx.match[0]
	const feature = buttonId.substr(4)
	ctx.answerCbQuery()
	await devFeatures[feature]({ ctx })
})
composer.action(/upload_file_cat_.+/, async (ctx) => {
	const buttonId = ctx.match[0]
	const category = buttonId.substr(16)
	ctx.answerCbQuery()
	if (category == "create") {
		const askingMsg = await ctx.reply("Send a category name as /createcat Categoryname", markup.forceReply())
		const { message_id } = askingMsg
		ctx.wizard.state.categoryAskingId = message_id;
	} else {
		await onCategoryClick({ ctx, category })
	}
})
composer.action(/upload_file_subcat_.+/, async (ctx) => {
	const buttonId = ctx.match[0]
	const subCategory = buttonId.substr(19)
	ctx.answerCbQuery()
	if (subCategory == "create") {
		const askingMsg = await ctx.reply("Send a subcategory name as /createsubcat subcategoryname", markup.forceReply())
		const { message_id } = askingMsg
		ctx.wizard.state.subCategoryAskingId = message_id;
	} else {
		await onSubCategoryClick({ ctx, subCategory })
	}
})
composer.action(/back_to_.+/,async ctx => {
	const buttonId = ctx.match[0]
	const destination = buttonId.substr(8)
	ctx.answerCbQuery()
	 if (destination == "main") {
		 await ctx.editMessageText("What can I do for you?", markup.inlineKeyboard([
			[
				markup.button.callback("⏫ Upload files", "dev_upload_files"),
			],
			[
				markup.button.webApp("Dev","https://telegram-nuxt.vercel.app/dev")
			],
		]))
	 } else if (destination == "cat") {
		 await devFeatures['upload_files']({ctx})
	 }
})


//=========================== Commands =================================
composer.command("createcat", async (ctx) => {
	const [command, category] = ctx.message.text.split(" ")
	if (!category) return ctx.reply('No category provided')
	admin.materials.createCategory({category})
	await devFeatures['upload_files']({ ctx, dontEdit: true })
})
composer.command("createsubcat", async (ctx) => {
	const [command, subCategory] = ctx.message.text.split(" ")
	if (!subCategory) return ctx.reply('No category provided')
	const category = ctx.wizard.state.category
	admin.materials.createSubCategory({subCategory,category})
	await onCategoryClick({ ctx, category, dontEdit: true })
})
//============================= Events ============================
composer.on("document", async ctx => {
	const file_id = ctx.message.document.file_id
	const filename = ctx.message.document.file_name
	let { category, subCategory } = ctx.wizard.state
	if (!category || !subCategory) {
		return ctx.reply(`Please choose a category and subcategory`)
	}
	if (file_id) {
		admin.materials.saveFile({category,subCategory, filename, file_id })
		ctx.reply(`Successfully stored ${filename} in ${category}.${subCategory}`)
	} else {
		await ctx.reply("🤖 file_id doesnot exist")
	}
})

composer.use(async (ctx) => {
	ctx.reply("Left dev mode")
	ctx.scene.leave()
})
//============================================================


const scene = new Scenes.WizardScene('dev', ...steps);
export default scene;






//=========================================================
async function onCategoryClick({ ctx, category, dontEdit }) {
	let subCategories = await admin.materials.getSubCategories(category)
	 subCategories = Object.entries(subCategories).filter(([k,v]) => k != "_meta")
	ctx.wizard.state.category = category

		await ctx[dontEdit ? "reply" : "editMessageText"](`Choose a subcategory in ${category}`, markup.inlineKeyboard([
			...subCategories.map(([subcat,value]) => ([markup.button.callback(subcat + " - " + emojify`${value.files && Object.values(value.files).length || 0}`, `upload_file_subcat_${subcat}`)])),
			[markup.button.callback("🆕 Create a subcategory", `upload_file_subcat_create`)],
			[markup.button.callback("⏪ Back", `back_to_cat`)]
		]))
}

async function onSubCategoryClick({ ctx, subCategory }) {
	// const subCategoryDb = admin.utils.fsdb.get(`documents.${ctx.wizard.state.category}.${subCategory}`)
	// let newSubCategoryDb = []
	// if (!subCategoryDb) newSubCategoryDb = []
	// else newSubCategoryDb = subCategoryDb
	ctx.wizard.state.subCategory = subCategory
	await ctx.reply(`Okay...Storing in ${ctx.wizard.state.category}.${subCategory}`)
}





