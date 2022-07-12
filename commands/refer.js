const paidBotInfo = `=> +${process.env.REFERRAL_BONUS || 5} days!`
//can get ctx.startPayload for /start command thru deep link.
export default {
 description :   `📣 Refer ${arePaymentsEnabled() ? paidBotInfo : ""}`,
 handler :  async (ctx) => {
    const {update_id,botInfo,state,telegram,update} = ctx
    const {date,chat,from : {username,id,first_name,last_name},message_id} = ctx.message    
    const uid = username
    const user = {userName : username, firstName : first_name,lastName : last_name,uid : username, chatId : id, createdAt : date}
    if (!uid) return 
    try {
       await admin.payment.sendReferralLink({uid,ctx})
    } catch (e){
      console.log(e)
    }

 } 
}