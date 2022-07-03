export default {
  description : "Show all relevant data for the dev",
  handler: async (ctx) => {
    const data = {
      state : ctx.state,
      bot : ctx.botInfo,
      message : ctx.message,
      chat : ctx.chat,
      Ctxkeys : Object.keys(ctx)
    }
    await ctx.reply(JSON.stringify(data,null,2))
  }
  }