export default {
	description : "💻 For Developer",
 handler :  async (ctx) => {
	 if (process.env.ADMIN == ctx.message.from.username){
  await ctx.scene.enter("dev")
	 }
 } 
}