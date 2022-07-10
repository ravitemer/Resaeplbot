import { Composer } from "telegraf"


const subscriptionFeatures = {
	"extend": async ({ ctx }) => {
		await admin.payment.sendPlans({ ctx })
	},
	//============================================
	"refer": async ({ ctx }) => {
		ctx.answerCbQuery()
		await admin.payment.sendReferralLink({ ctx })
	},
}






const subscriptionComposer = new Composer()
//+++++++++++++++++Actions+++++++++++++++++++++++++
subscriptionComposer.action(/subscriptionfor_.+/, async (ctx) => {
	const data = ctx.callbackQuery.data
	const months = parseInt(data.substring(16))
	//  ctx.telegram.deleteMessage(ctx.chat.id, ctx.wizard.state.deleteMsg)
	//await ctx.deleteMessage()
	await ctx.answerCbQuery("Sending invoice");
	await admin.payment.sendInvoice({ ctx, months: months })
})
subscriptionComposer.action(/subscriptionback/, async (ctx) => {
	const uid = ctx.callbackQuery.from.username 
	await admin.payment.sendCurrentSubscriptionDetails({ctx,uid,shouldEdit : true})
})

subscriptionComposer.action(/subscription_.+/, async (ctx) => {
	const data = ctx.callbackQuery.data
	const feature = data.substring(13)
	await subscriptionFeatures[feature]({ ctx })

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



export default subscriptionComposer