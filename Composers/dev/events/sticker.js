export default async (ctx) => {
  await ctx.reply("File Id of sticker : ")
  await ctx.reply(ctx.message.sticker.file_id)
}