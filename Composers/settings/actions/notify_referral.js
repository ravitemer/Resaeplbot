export default async (ctx) => {
  const uid = ctx.callbackQuery.from.username
  await admin.toggleReferralNotifications({uid,shouldEnable : true})
  await ctx.reply("🎊 Successfully enabled referral notifications 🔔")
}