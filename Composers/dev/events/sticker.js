export default async (ctx) => {
	const file_id = ctx.message.sticker.file_id
	if (file_id){
			await ctx.reply(`🤖 file_id of sticker: ${file_id}`)
		  admin.utils.fsdb.push(`stickers`,file_id)
	} else {
		await ctx.reply("🤖 file_id doesnot exist")
		
	}
}