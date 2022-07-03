import {Scenes} from "telegraf"
const steps = [
  async (ctx) => {
//   await ctx.replyWithSticker(stickers.greeter)
  let mycommands = await ctx.getMyCommands()
  let mycommandsString = mycommands.reduce((res,com) => `${res}/${com.command} - ${com.description}\n`,"")
  //General desc
  let genInfo = `
This bot has many modes. You are currently in the Greeting mode.
Below are all the available modes.
When you enter a specific mode, you have subcommands displayed in the place of keyboard.
  `
  let info = `
${genInfo}
Commands : 
${mycommandsString} 
  `  
   await ctx.reply(info)
   ctx.wizard.next()
   },
  composers.greeter,

]

const scene = new Scenes.WizardScene('greeter',...steps);



export default scene;

 