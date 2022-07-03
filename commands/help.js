export default {
  description : "ℹ️ Bot manual",
  handler : async (ctx) => {
  //commands info
  let mycommands = await ctx.getMyCommands()
  let mycommandsString = mycommands.reduce((res,com) => `${res}/${com.command} - ${com.description}\n`,"")
  //General desc
  let genInfo = `
This is some general info.
  `
  let info = `
Welcome ${ctx.message.chat.first_name}!
${genInfo}
Commands : 
${mycommandsString} 
  `
  ctx.reply(info,markup.inlineKeyboard([
    markup.button.callback("Edit markup","edit_markup")
  ]))
}
}
 