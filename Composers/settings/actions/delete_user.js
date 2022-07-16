export default async (ctx) => {
  await ctx.reply("Are you sure to delete your data? Anyways deleting")
  const uid = ctx.callbackQuery.from.username
  await admin.user.del({uid,ctx})
  await ctx.reply("Successfully deleted your data. You can run /start to restart your progress")
}