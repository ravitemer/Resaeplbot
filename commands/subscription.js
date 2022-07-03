export default {
 description :   `💳 Manage Subscription`,
 handler :  async (ctx) => {
    const {update_id,botInfo,state,telegram,update} = ctx
    const {date,chat,from : {username,id,first_name,last_name},message_id} = ctx.message    
    const uid = username
    const user = {userName : username, firstName : first_name,lastName : last_name,uid : username, chatId : id, createdAt : date}
    try {
       await ctx.scene.enter("subscription",{
         user,
         uid      
       })
    } catch (e){
      console.log(e)
    }
 } 
}