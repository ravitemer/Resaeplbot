export default async (ctx) => {
  ctx.reply(`Received data from ${ctx.webAppData.button_text} : ${ctx.webAppData.data.text()}`)
}