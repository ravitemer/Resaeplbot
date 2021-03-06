import fs from "fs"
//can get ctx.startPayload for /start command thru deep link.
// π€ Do I need a subscription to work?
// <b>No!</b> Once you start the bot, you get ${process.env.FREE_TRIAL_PERIOD || 10} days of full access for free. If you used a referral link to start with, you get extra ${process.env.REFERRAL_BONUS || 5} days. If you refer someone, for every referee you get extra ${process.env.REFERRAL_BONUS} days.
//  As long as you have enough days, you can have unlimited access. Once you ranout, you get a limited access.
// <tg-spoiler>
// Β£${process.env.MONTHLY_COST}/ month
// At the cost of a coffee / month. You can pay right here securely.
// If you can't afford the subscription, you can refer and get ${process.env.REFERRAL_BONUS} days for every referral. 
// </tg-spoiler>
const paidInfo = `π€ <b>Do I need a subscription to work?</b>
<b>No!</b> Once you start the bot, you get ${process.env.FREE_TRIAL_PERIOD || 10} days of full access for free. If you used a referral link to start with, you get extra ${process.env.REFERRAL_BONUS || 5} days. If you /refer someone, for every referee you get extra ${process.env.REFERRAL_BONUS} days.
Once you ranout, you have limted access and need a /subscription at just <tg-spoiler><b>${process.env.CURRENCY_SYMBOL || "Β£"}${process.env.MONTHLY_COST}/ month</b></tg-spoiler>.`

const startingMessage = ({bot,user}) => {
	return `
π₯³ <b>Welcome! ${user.firstName} ${user.lastName}.</b> π₯Όπ©Ί

<b>π€ Who am I?</b>
I am a botπ€ built to help doctors preparing for the PLAB Exam π«‘.

<b>π€ What can I do?</b>
A lot! I can be a <b>Co-pilot</b> in your <b>PLAB</b> journey. 

β <b>PLAB 1</b>: /plab1
βπ»You can <b>Practise</b> with more than 1700 single best answer questions right here.
π <b>Bookmark</b> a question while you practice and access it later.
ππ»ββοΈ <b>Revise</b> the questions that you got <s>wrong</s>.
β³ Give <b>Mocks</b> and compare scores with your peers.
π Get <b>Materials</b> like clinchers, recalls needed for your preparation right here.

β <b>PLAB 2</b>: /plab2
     Coming soon !!! 
${arePaymentsEnabled() ? paidInfo : ""}

<b>π€ Extra information?</b> /help
Help is just a tap away.
You can also access other commands from the menu button.
`
	
}
export default {
 description : "π€ Start bot",
 handler :  async (ctx) => {
    const messageParts = ctx.message.text.split(" ")
    let {update_id,botInfo,state,telegram,update,startPayload} = ctx
    const {date,chat,from : {username,id,first_name,last_name},message_id} = ctx.message    
    const uid = username
    const user = {
      userName : username, 
      firstName : first_name,
      lastName : last_name,
      uid : username,
      chatId : id,
      createdAt : date,
      notifyReferrals : true
    }
    if (!uid) return error("No Uid in the start command")
    try {
      if (!startPayload){
        if (messageParts[0].trim() == '/start' && messageParts[1]){
              startPayload = messageParts[1].trim()
        }
      }
				await ctx.replyWithPhoto({source : fs.createReadStream("./public/images/bot.jpg")},{
        caption : startingMessage({bot: botInfo,user}),
				parse_mode :"HTML"
      }),
      await admin.user.handle({uid,user,ctx,startPayload})              
    } catch (e){
      console.log(e)
    }

 } 
}