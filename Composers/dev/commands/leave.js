export default {
  description : "Leave DEV Stage",
  handler : async (ctx) => {
    await ctx.reply("Left from DEV Stage",ctx.markup.removeKeyboard())
  }
}