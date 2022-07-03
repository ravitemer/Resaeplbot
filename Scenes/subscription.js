import { Scenes, Composer } from "telegraf"

const subscriptionComposer = new Composer()
//+++++++++++++++++Actions+++++++++++++++++++++++++
subscriptionComposer.action(/subscription:+/, async (ctx) => {
	const data = ctx.callbackQuery.data
	const months = parseInt(data.substring(13))
	//  ctx.telegram.deleteMessage(ctx.chat.id, ctx.wizard.state.deleteMsg)
	//await ctx.deleteMessage()
	ctx.wizard.state.months = months
	await ctx.answerCbQuery("Sending invoice");
	await admin.payment.sendInvoice({ ctx, months: months })
})
	//+++++++++++++++++++Events++++++++++++++++++++++++++++
subscriptionComposer.on("pre_checkout_query", async (ctx) => {
	await checkPreCheckoutQuery({ ctx })
})
subscriptionComposer.on("successful_payment", async (ctx) => {
	await onSuccessfulPayment({ ctx })
})
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
async function checkPreCheckoutQuery({ ctx }) {
	ctx.answerPreCheckoutQuery(true)
	//  const {id,currency,invoice_payload,total_amount,from : {username}} = ctx.preCheckoutQuery;
	//  console.log(ctx.preCheckoutQuery)
	//  const payload = (JSON.parse(invoice_payload || "{}") || {})
	//  const { months,uid } = payload
	//  const price = parseInt(process.env.MONTHLY_COST || 1) * months
	//  if (price == total_amount || true) {
	//     await ctx.answerPreCheckoutQuery(true) 
	//     console.log(payload)
	//  } else {
	//    await ctx.answerPreCheckoutQuery("There seems to be an error with your payload.")
	//  }
}
async function onSuccessfulPayment({ ctx }) {

}
async function loadUserData(ctx) {
	const { username: uid } = ctx.message.from
	if (!uid) console.log(new Error("NO uid provided"))
	const doc = await admin.user.get({uid})
	if (!doc) return await ctx.reply("Oops! No user found")
	ctx.wizard.state.doc = doc
	return doc

}
async function showExpiry(ctx) {
	const doc = ctx.wizard.state.doc
	let expiryDate = (doc.expiryDate && doc.expiryDate.toDate) ? doc.expiryDate.toDate() : new Date()
	const expiryString = ` ${dayjs().isBefore(dayjs(expiryDate)) ? "ends" : "ended"} ${dayjs(expiryDate).fromNow()}`
	expiryDate = `${dayjs(expiryDate).format("DD/MM/YYYY")}`
	const info = `
⚠️ Your subscription ${expiryString} on ${expiryDate} 

💳 Click below to extend now at just £${process.env.MONTHLY_COST || 1} / month. 

🥳 📣  You can also extend ${process.env.REFERRAL_BONUS || 5} days with every successful referral! 
  `
	await ctx.reply(info, markup.inlineKeyboard([
		[markup.button.callback("💳 Extend", "extend_subscription")],
		[markup.button.callback("📣 Refer", "refer_subscription")],
	]))
	ctx.wizard.next()
}

// subscriptionComposer.action("extend_subscription",async (ctx) => {
//   await  ctx.answerCbQuery("Sending subscriptions")
//   const x =  await ctx.editMessageReplyMarkup({
//     inline_keyboard : [
//       [markup.button.callback(`£${parseInt(process.env.MONTHLY_COST || 1)} / 1 month`,"subscription:1")],
//       [markup.button.callback(`£${parseInt(process.env.MONTHLY_COST || 1) * 2.5} / 3 months`,"subscription:3")],    
//       [markup.button.callback(`£${parseInt(process.env.MONTHLY_COST || 1) * 4} / 5 months`,"subscription:5")],
//       [markup.button.callback(`⏪ Back`,"subscription_back")],
//     ]
//   })
//   //admin.sendPlans({ctx})
// })
// subscriptionComposer.action("refer_subscription",async ctx => {
//   await admin.sendReferralLink({ctx})
// })
// subscriptionComposer.action("subscription_back",async ctx => {
//   try {
// //    await ctx.answerCbQuery("Going back")
//     const currentStep = ctx.wizard.cursor
//     log(currentStep)
//   //  await ctx.wizard.back()
//     await ctx.wizard.selectStep(currentStep - 1)
//   } catch (e){
//     log(e)
//   }
//   //ctx.wizard.back()
// })
function createMenu(doc = {}) {
	let expiryDate = (doc.expiryDate && doc.expiryDate.toDate) ? doc.expiryDate.toDate() : new Date()
	const expiryString = ` ${dayjs().isBefore(dayjs(expiryDate)) ? "ends" : "ended"} ${dayjs(expiryDate).fromNow()}`
	expiryDate = `${dayjs(expiryDate).format("DD/MM/YYYY")}`
	const info = `
⚠️ Your subscription ${expiryString} on ${expiryDate} 

💳 Click below to extend now at just £${process.env.MONTHLY_COST || 1} / month. 

🥳 📣  You can also extend ${process.env.REFERRAL_BONUS || 5} days with every successful referral! 
  `
	const menu = {
		text: info,
		keyboard: [
			{
				"extend_subscription": {
					name: "💳 Extend",
					submenu: {
						text: `Choose from the following plans. Once clicked you will be sent a invoice right here with a pay button.You can click it pay. It's that simple`,
						keyboard: [
							{
								"subscription:1": {
									name: `£${process.env.MONTHLY_COST} - 1 month`,
								},
							},
							{
								'subscription:3': {
									name: `£${process.env.MONTHLY_COST} - 3 months`,
								},
							},
							{
								"subscription:5": {
									name: `£${process.env.MONTHLY_COST} - 5 months`,
								},
							},
							utils.menuBackButton("subscription_back")
						]
					}
				}
			},
			{
				"referral_link": {
					name: "📣 Refer",
					handler: async ({ ctx }) => {
						ctx.answerCbQuery()
						admin.utils.sendReferralLink({ ctx })
					}
				}
			}
		]
	}
	return menu
}
utils.powerMenuComposer({ composer: subscriptionComposer, menu: createMenu() })
const steps = [
	async (ctx) => {
		await utils.emoji({
			ctx,
			done: async ({ chat_id, message_id }) => {
				const user = await loadUserData(ctx)
				await utils.editMenuTele({ ctx, menuData: createMenu(user), chat_id, message_id })
				await ctx.wizard.next()
			}
		})

	},
	subscriptionComposer,
]

const scene = new Scenes.WizardScene('subscription', ...steps);
export default scene;