export default async (ctx) => {
	const file_id = ctx.message.animation.file_id
	if (file_id){
			await ctx.reply(`🤖 file_id of animation: ${file_id}`)
		admin.utils.fsdb.push(`animations`,file_id)
	} else {
		await ctx.reply("🤖 file_id doesnot exist")
		
	}
}