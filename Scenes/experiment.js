import { Scenes, Composer } from "telegraf"
const composer = new Composer()

const firstMenu = {
	text: "This is the starting point",
	keyboard: [
		{
			"b-1": {
				name: "Button 1",
				submenu: {
					text: `This is the submenu`,
					keyboard: [
						{
							"b-1-1": {
								name: "Button-1-1",
								submenu : {
									text : 	`This is sub-sub-menu`,
									keyboard : [
										{
											"b-1-1-1" : {
												name : "b-1-1-1-"
											},
											"b-1-1-2" : {
												name : "b-1-1-2-"
											},
											"b-1-1-3" : {
												name : "b-1-1-3-"
											}
										},
										utils.menuBackButton("b-1-1")
									]
								}
							}
						},
						utils.menuBackButton("b-1")
					]
				}
			},
			"b-2": {
				name: "Button 2",
								submenu: {
					text: `This is the submenu`,
					keyboard: [
						{
							"b-2-1": {
								name: "Button-2-1",
								submenu : {
									text : 	`This is sub-sub-menu`,
									keyboard : [
										{
											"b-2-1-1" : {
												name : "b-1-1-1-"
											},
											"b-2-1-2" : {
												name : "b-1-1-2-"
											},
											"b-2-1-3" : {
												name : "b-2-1-3-"
											}
										},
										utils.menuBackButton("b-2-1")
									]
								}
							}
						},
						{
							"b-3-1": {
								name: "Button-3-1",
								submenu : {
									text : 	`This is sub-sub-menu`,
									keyboard : [
										{
											"b-3-1-1" : {
												name : "b-3-1-1-"
											},
											"b-3-1-2" : {
												name : "b-3-1-2-"
											},
											"b-3-1-3" : {
												name : "b-3-1-3-"
											}
										},
										utils.menuBackButton("b-3-1")
									]
								}
							}
						},
						utils.menuBackButton("b-2")
					]
				}
			},
				},
	]
}
utils.powerMenuComposer({ composer, menu: firstMenu })
	const steps = [
	async (ctx) => {
		await utils.sendMenu({ ctx, menuData: firstMenu })
		await ctx.wizard.next()
	},
	composer,
]
const scene = new Scenes.WizardScene('experiment', ...steps);
export default scene;


