export default async (ctx) => {
  const uid = ctx.callbackQuery.from.username
  await admin.toggleReferralNotifications({uid,shouldEnable : false})
  await ctx.reply("🎊 Successfully disabled referral notifications 🔕")
}