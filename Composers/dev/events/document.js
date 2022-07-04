export default async (ctx) => {
	const file_id = ctx.message.document.file_id
	const filename = ctx.message.document.file_name
	if (file_id){
			await ctx.reply(`🤖 file_id of document: ${file_id}`)
		admin.utils.fsdb.push(`documents`,{filename,file_id})
	} else {
		await ctx.reply("🤖 file_id doesnot exist")
	}
}