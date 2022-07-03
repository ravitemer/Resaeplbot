export default async (ctx) => {
  if (ctx.webAppData){
    const webData = ctx.webAppData
    await ctx.reply(`Data received from ${webData.button_text} : ${webData.data.text()}`)
  }
}