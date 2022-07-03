import fs from "fs"
//can get ctx.startPayload for /start command thru deep link.
export default {
 description : "🎬 Starting command",
 handler :  async (ctx) => {
//   ctx.scene.enter("greeter") 
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
    if (!uid) return 
    try {
      if (!startPayload){
        if (messageParts[0] == '/start' && messageParts[1]){
              startPayload = messageParts[1].trim()
        }
      }
      const startCaption = `
🫡 Welcome to @${ctx.botInfo.username}

I can help you with your PLAB preparation with over 1700 single best answer questions. You can get materials needed for your prep right here. You just have to ask 🥳.

Enjoy unlimited access until ${dayjs().add(process.env.FREE_TRIAL_PERIOD || 10,"day").format('DD/MM/YYYY')}

/subscription
💳 Monthly subscription  : ${process.env.MONTHLY_COST || 1}£; 

You can extend trial by ${process.env.REFERRAL_BONUS || 5} days for every referral. 🎊
`

      await ctx.replyWithPhoto({source : fs.createReadStream("./public/images/plab.jpg")},{
        caption : startCaption
      })
      await admin.addUser({uid,user,ctx,startPayload})              
      //await ctx.scene.enter("greeter")
    } catch (e){
      console.log(e)
    }

 } 
}