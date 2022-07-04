export default async (ctx) => {
	const file_id = ctx.message.photo[0].file_id
	if (file_id){
			await ctx.reply(`🤖 file_id of photo: ${file_id}`)
		admin.utils.fsdb.push(`photos`,file_id)
	} else {
		await ctx.reply("🤖 file_id doesnot exist")
	}
}