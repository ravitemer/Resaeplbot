import { Scenes,Composer } from "telegraf"
const composer = new Composer()


const plab2Features = {
	'materials' : async ({ctx}) => {
		ctx.answerCbQuery()
		await admin.materials.sendCategories({ctx})
	},
}

const steps = [
	async (ctx) => {
		let msg = await ctx.replyWithHTML(`
These are features that come with /plab2
  `, markup.inlineKeyboard(
			[
				[
				markup.button.callback("📚 Materials","plab2_materials"),
				],
			]
		))
		ctx.wizard.next()
	},
	composer,
]
composer.action(/plab2_.+/,async (ctx) => {
	const buttonId = ctx.match[0]
	const feature = buttonId.substr(6)
	await plab2Features[feature]({ctx})
})
const scene = new Scenes.WizardScene('plab2', ...steps);
export default scene;