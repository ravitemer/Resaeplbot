import { Composer } from "telegraf"
const composer = new Composer()

composer.action("materials_back_to_cat", async ctx => {
	ctx.answerCbQuery()
	const obj = ctx.session.categoriesObj || {}
	await ctx.editMessageText(obj.text, obj.keyboard)
})


composer.action(/materials_cat_but_.+/, async (ctx) => {
	ctx.answerCbQuery()
	const buttonId = ctx.match[0]
	const category = buttonId.substr(18)
	ctx.session.currentCategory = category
	let subCategories = await admin.materials.getSubCategories(category)
	subCategories = Object.entries(subCategories).filter(([key,value]) => {
		return key != "_meta"
	}).map(([key, value]) => {
		return [
			markup.button.callback(`${key} - ` + emojify`${value.files && Object.values(value.files).length || 0}`, `materials_subcat_but_${key}`)
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
	const category = ctx.session.currentCategory
	if (!category) return
	const subCategory = buttonId.substr(21)
	const subCategoryItems = Object.values(ctx.session.materials[category][subCategory].files) || []
	if (subCategoryItems.length > 0) {
		await Promise.all(subCategoryItems.map(async ({ filename, file_id }) => {
			await ctx.replyWithDocument(file_id, { protect_content: true, })
		}))
	} else {
		await ctx.reply(`Sorry... No files found in this category`)
	}
})

export default composer;
