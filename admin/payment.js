async function _prepareSubscriptionDetails({ uid }) {
	const doc = await admin.user.get({ uid })
	let expiryDate = (doc.expiryDate && doc.expiryDate.toDate) ? doc.expiryDate.toDate() : new Date()
	const expiryString = ` ${dayjs().isBefore(dayjs(expiryDate)) ? "ends" : "ended"} ${dayjs(expiryDate).fromNow()}`
	expiryDate = `${dayjs(expiryDate).format("DD/MM/YYYY")}`
	const text = `
⚠️ Your subscription ${expiryString} on ${expiryDate} 

💳 Click below to extend now at just £${process.env.MONTHLY_COST || 1} / month. 

🥳 📣  You can also extend ${process.env.REFERRAL_BONUS || 5} days with every successful referral! 
  `
	const keyboard = [
		[markup.button.callback("💳 Extend", "subscription_extend")],
		[markup.button.callback("📣 Refer", "subscription_refer")]
	]
	return { text, keyboard }
}

async function sendCurrentSubscriptionDetails({ ctx, uid, shouldEdit }) {
	try {
		if (shouldEdit) {
			const { text, keyboard } = await _prepareSubscriptionDetails({ uid })
			ctx.editMessageText(text, markup.inlineKeyboard(keyboard))
		} else {
			await utils.emoji({
				ctx,
				done: async ({ chat_id, message_id }) => {
					const { text, keyboard } = await _prepareSubscriptionDetails({ uid })
					await ctx.telegram.editMessageText(chat_id, message_id, undefined, text, {
						reply_markup: {
							inline_keyboard: keyboard
						}
					})
				}
			})
		}
	} catch (e) {
		error(e)
	}
}

























async function sendPlans({ ctx, }) {
	await ctx.editMessageText(`Choose from the following plans. Once clicked you will be sent a invoice right here with a pay button.You can click it pay. It's that simple`,
		markup.inlineKeyboard([
			[markup.button.callback(`£${process.env.MONTHLY_COST} - 1 month`, "subscriptionfor_1")],

			[markup.button.callback(`£${process.env.MONTHLY_COST} - 3 months`, "subscriptionfor_3")],
			[markup.button.callback(`£${process.env.MONTHLY_COST} - 5 months`, "subscriptionfor_5")],
			[markup.button.callback("⏪ Back", "subscriptionback")]
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
export async function sendReferralLink({ ctx }) {
	//await ctx.log(`Generating referral link for ${uid}`)
	//const token = jwt.sign(uid,process.env.JWT_SECRET_KEY)
	const info = `
Hey there! 
I found this amazing telegram bot that helps me with my PLAB preparation. You can use my link and get extra ${process.env.REFERRAL_BONUS} days of unlimited access.
https://t.me/${ctx.botInfo.username}?start=admin`
	await utils.emoji({
		ctx,
		emoji: "📣",
		done: async () => {
			// await ctx.replyWithPhoto("https://picsum.photos/300/300?random", { caption: info })
			await ctx.replyWithHTML(info)
			await ctx.reply("You get referral credits whenever a new user signup using the above link. You can share it anywhere not just telegram.")
		}
	})

}


export default {
	sendInvoice,
	sendPlans,
	sendReferralLink,
	sendCurrentSubscriptionDetails,
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
