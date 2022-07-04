import { Scenes,Composer } from "telegraf"
const composer = new Composer()


const plab1Features = {
	'mocks' : async ({ctx}) => {
		await ctx.reply("You clicked on mocks")
	},
	'materials' : async ({ctx}) => {
		await ctx.reply("You clicked on materials")
	},
}
const webapps = [
	[
		markup.button.webApp("📈 Progress", "https://telegram-nuxt.vercel.app/1700"),
	],
	[
		markup.button.webApp("🔖 Bookmarks", "https://telegram-nuxt.vercel.app/1700/bookmarks"),
	],
	[
		markup.button.webApp("🙇🏻‍♂️ Revision", "https://telegram-nuxt.vercel.app/1700/revision"),
	]
]

const steps = [
	async (ctx) => {
		let msg = await ctx.replyWithHTML(`
These are features that come with /plab1
  `, markup.inlineKeyboard(
			[
...webapps,
				[
				markup.button.callback("⏱ Mocks","plab1_mocks"),
				],
				[
				markup.button.callback("📚 Materials","plab1_materials"),
				],
			]
		))
		ctx.wizard.next()
	},
	composer,
]
composer.action(/plab1_.+/,async (ctx) => {
	const buttonId = ctx.match[0]
	const feature = buttonId.substr(6)
	console.log(feature)
	await plab1Features[feature]({ctx})
})
const scene = new Scenes.WizardScene('plab1', ...steps);
export default scene;