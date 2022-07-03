import { Scenes, Composer } from "telegraf"
const composer = new Composer()
const category1 = {
	"cat1": {
		name: "Category 1",
		submenu: {
			text: "These are questions in category 1",
			keyboard: [
				{
					"cat1-1": {
						name: "Category1 - 1 ",
						handler: async ({ ctx }) => {
							ctx.answerCbQuery()
							ctx.reply("You clicked category1 -1")
						}
					}
				},
				{
					"cat1-2": {
						name: "Category1 - 2 ",
						handler: async ({ ctx }) => {
							ctx.answerCbQuery()
							ctx.reply("You clicked category1 -2")
						}
					}
				},
				{
					"cat1-3": {
						name: "Category1 - 3 ",
						handler: async ({ ctx }) => {
							ctx.answerCbQuery()
							ctx.reply("You clicked category1 -3")
						}
					}
				},
				utils.menuBackButton("back_cat1")
			]
		},
	}
}
const category2 = {
	"cat2": {
		name: "Category 2",
		submenu: {
			text: "These are question in category 2",
			keyboard: [
				{
					"cat2-1": {
						name: "Category2 - 1 ",
						handler: async ({ ctx }) => {
							ctx.answerCbQuery()
							ctx.reply("You clicked category2 -1")
						}
					}
				},
				{
					"cat2-2": {
						name: "Category2 - 2 ",
						handler: async ({ ctx }) => {
							ctx.answerCbQuery()
							ctx.reply("You clicked category2 -2")
						}
					}
				},
				{
					"cat2-3": {
						name: "Category2 - 3 ",
						handler: async ({ ctx }) => {
							ctx.answerCbQuery()
							ctx.reply("You clicked category2 -3")
						}
					}
				},
				utils.menuBackButton("back_cat2")
			]
		}

	}
}

const menu = {
	text: "These are the most common question asked grouped into categories",
	keyboard: [
		category1,
		category2,
	]
}

utils.powerMenuComposer({ composer, menu: menu })
const steps = [
	async (ctx) => {
		await utils.sendMenu({ ctx, menuData: menu })
		await ctx.wizard.next()
	},
	composer,
]
const scene = new Scenes.WizardScene('faqs', ...steps);
export default scene;


