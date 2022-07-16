import { Scenes, Composer } from "telegraf"

const composer = new Composer()

const documentsDB = admin.utils.fsdb.get("documents") || {}

const menu = createDocumentsMenu({ data: documentsDB })

//=============== STEPS =====================
const steps = [
	async (ctx) => {
		const {message_id,chat_id} = await utils.sendMenu({ ctx, menuData: menu })
		const msg = {
			message_id ,
			chat_id 
		}
		// ctx.wizard.state.categoriesMessage = msg
		ctx.wizard.state.deletableMsgs = [msg]
		ctx.wizard.next()
	},
	composer,
]
//================ Power =================
utils.powerMenuComposer({ menu, composer })
composer.on("message",async (ctx,next) => {
		// ctx.wizard.state.deletableMsgs?.push({message_id: ctx.message.message_id,chat_id : ctx.message.chat.id})
next()
})
composer.command("exit",async (ctx) => {
	const previousScene = ctx.wizard.state.from
	return ctx.scene.leave()
	if (previousScene){
		ctx.scene.enter(previousScene,{from : null})
	} else {
		ctx.scene.leave()
	}
})
      //============ Default =============
composer.use(async (ctx) => {
	const msg = await ctx.reply("Choose from the categories above or click /exit")
	// ctx.wizard.state.deletableMsgs?.push({chat_id : msg.chat.id,message_id: msg.message_id})
})
//=============== SCENE ======================
const scene = new Scenes.WizardScene('materials', ...steps);

scene.leave(async (ctx) => {
	const msgs = ctx.wizard.state.deletableMsgs
	if (msgs.length > 0) {
		await Promise.all( msgs.map(async msg => ctx.telegram.deleteMessage(msg.chat_id,msg.message_id)))
		delete ctx.wizard.state.deletableMsgs
	}
})

export default scene;
//==================== UTILS =======================
function createDocumentsMenu({ data }) {
	const menu = {
		text: "Choose from the following categories..."
	}
	let keyboard = []
	for (let [key, value] of Object.entries(data)) {
		key = key.split(" ").join("-")
		keyboard.push({
			[`doc_cat_${key}`]: {
				name: key,
				submenu: createSubMenu({ data: value, category: key })
			}
		})
	}
	menu.keyboard = keyboard
	return menu
}

function createSubMenu({ data, category }) {
	const menu = {
		text: `Choose from categories in ${category}`
	}
	let keyboard = []
	for (let [key, value] of Object.entries(data)) {
		key = key.split(" ").join("-")
		keyboard.push({
			[`doc_subcat_${key}`]: {
				name: `${key} - ` + emojify`${value.length}`,
				handler: async ({ ctx }) => {
					const uid = ctx.callbackQuery.from.username
					await utils.emoji({
						ctx,
						done: async ({ message_id, chat_id }) => {
							const isAllowed = await admin.user.isAllowed({ uid })
							if (isAllowed === true) {
								ctx.answerCbQuery()
								if (value.length > 0) {
									await Promise.all(value.map(async ({ filename, file_id }) => {
										await ctx.replyWithDocument(file_id, { protect_content: true, })
									}))

								} else {
									await ctx.reply(`Sorry... No files found in this category`)
								}
							}else {
								await ctx.reply(`Oops! You have limited access. Click /subscription for further information.`)
							}
						}
					})

				}
			}
		})
	}
	keyboard.push(utils.menuBackButton("back_to_cat"))
	menu.keyboard = keyboard
	return menu
}