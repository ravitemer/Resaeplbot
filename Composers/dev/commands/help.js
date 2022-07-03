export default {
  description : "composer helper",
  handler: async (ctx) => {
    const data = `
    Commands : 
    /help - show help for this mode
    /data - show relevant data 
    
    Events
    sticker - get fileid
    `
    await ctx.reply(data)
  }
  }