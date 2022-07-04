export default async (ctx) => {
  const {update_id,botInfo,state,telegram,update} = ctx
  const {document,date,chat,from : {username,id,first_name,last_name},message_id} = ctx.message
  let data = {
      date,
      user : {username,first_name,last_name,id},
      message : {message_id},      
  }
	if (document){
		 const file_id = document.file_id
		await ctx.replyWithDocument(file_id)
	}

  
}