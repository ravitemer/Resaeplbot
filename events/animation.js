export default async (ctx) => {
  const {update_id,botInfo,state,telegram,update} = ctx
  const {animation,date,chat,from : {username,id,first_name,last_name},message_id} = ctx.message
  let data = {
      date,
      user : {username,first_name,last_name,id},
      message : {message_id},      
  }
	if (animation){
		const file_id = "CgACAgUAAxkBAAIJjmLCnK5qCCf_cmkH_k3CECLMBPh4AAKDBwACIngYVmvFLQSd9YsaKQQ"
		await ctx.replyWithAnimation(file_id)
	}

  
}