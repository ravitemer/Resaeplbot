import fs from "fs";

async function sendPlans({ ctx, }) {
	const info = `
 Subscribe at just ${process.env.MONTHLY_COST}£ / month. Subscribered users can access all the materials and multiple choice questions at a cost of coffee for whole month. You can subscribe for 1 month = ${process.env.MONTHLY_COST || 1}£, 3 months = ${parseInt(process.env.MONTHLY_COST || 1) * 2.5}£ or 5 months = ${parseInt(process.env.MONTHLY_COST || 1) * 4}£.
  `
	const msg = await ctx.replyWithPhoto("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRiGpyM-9GUds6NyE-ytUjwxEC8Fp-Y94CkyA&usqp=CAU", {
		caption: info
	})
	ctx.wizard.state.deleteMsg = msg.message_id

	await ctx.reply(`
Choose a plan from below.
    `,
		markup.inlineKeyboard([
			[markup.button.callback(`${parseInt(process.env.MONTHLY_COST || 1)}£ / 1 month`, "subscription:1")],
			[markup.button.callback(`${parseInt(process.env.MONTHLY_COST || 1) * 2.5}£ / 3 months`, "subscription:3")],
			[markup.button.callback(`${parseInt(process.env.MONTHLY_COST || 1) * 4}£ / 5 months`, "subscription:5")],
		]))
}

async function sendInvoice({ ctx, months, currency }) {
	const monthString = `${months} ${months > 1 ? "Months" : "Month"}`
	const invoice = {
		provider_token: isDev() ? process.env.PAYMENT_PROVIDER_TEST_TOKEN : process.env.PAYMENT_PROVIDER_TOKEN,
		//  start_parameter: 'time-machine-sku',
		title: `${monthString} subscription`,
		description: `
        Click the below PAY button to subscribe for ${monthString}. You can pay right in the app with debit or credit card. If you face any problem with the payment, feel free to ask for /help.
      `,
		currency: currency || 'gbp',
		photo_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWdBbZzHytn_QL9Kg5OjjJGM68xQ6Kolsq-Q&usqp=CAU",
		//  is_flexible: true,
		max_tip_amount: 1000000,
		suggested_tip_amounts: [
			100,
			200,
			500,
			1000,
		],
		prices: [
			{ label: monthString, amount: parseInt(process.env.MONTHLY_COST || 1) * months * 100 },
		],
		payload: JSON.stringify({
			coupon: `${monthString} subscription`
		})
	}
	await ctx.replyWithInvoice(invoice)

}


export default {
	sendInvoice,
	sendPlans,
}






// async function onSuccessfulPayment({ username, paymentPayload }) {
// 	if (!username) return null
// 	try {
// 		const user = await auth.getUser(username)
// 		if (user && user.customClaims && user.customClaims.paid == true) return { username, claims: user.customClaims }
// 		if (user.customClaims) {
// 			user.customClaims["paid"] = true


// 			await Promise.all([
// 				//set claims for user
// 				auth.setCustomUserClaims(username, user.customClaims),
// 				//save patment data on db
// 				//           database.ref(`Users/${username}/1700`).update({
// 				//            claims : {
// 				//              paid : true
// 				//            }
// 				//          }),
// 				//          //push payment payload 
// 				//          database.ref(`Users/${username}/1700/payments`).push(paymentPayload),
// 			])


// 			return {
// 				username,
// 				claims: user.customClaims
// 			}
// 		} else {
// 			user.customClaims = {
// 				paid: true
// 			}
// 			await Promise.all([
// 				auth.setCustomUserClaims(username, user.customClaims),
// 			])
// 			return {
// 				username,
// 				claims: user.customClaims
// 			}
// 		}


// 	} catch (e) {
// 		console.log(e)
// 		return null;
// 	}


// }
