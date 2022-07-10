import {Composer,Scenes,Telegraf,session,Markup} from "telegraf"
import KeysMW from "./keyboards.js"
import contextExtensionObj from "./context.js";
import globalExtensionObj from "./global.js";
import generateFunctions from "../generate.js"






//extend global 
for (let prop in globalExtensionObj){
  global[prop] = globalExtensionObj[prop]
}



//extend ctx
export function setCustomContext(ctx){
  const logsObj = utils.chatLoggerFactory(ctx)
  for (let level in logsObj){
    ctx[level] = logsObj[level]
  }
  for (let key in contextExtensionObj){
    ctx[key] = contextExtensionObj[key]
  }
}
//bot functions
export default async function powerBot(bot,onCompletion){
    //order is important so that global.composers gets updated before actually cretaing funcions or scenes
  const folders = ["Composers","commands", "actions", "events","Scenes"]
  const funcs = await generateFunctions(folders)
  const scenes = Object.values(funcs["Scenes"])
  const stage = new Scenes.Stage(scenes);  
  //++++++++++++++++++++++++++++++++++MIDDLEWARES+++++++++++++++++++++++++++++++++++
  //setcommands before coupling so getCommands filled up with new commands.
	await bot.telegram.setMyCommands(Object.entries(funcs["commands"]).map(([command,{description}]) => {
          return {command,description}
          }).filter(({command}) => !["start","dev","settings"].includes(command)))
  bot.use(async (ctx,next) => {
    try {
        setCustomContext(ctx)
        await next()
    } catch (e){
      console.log(e)
      throw new Error("Error setting commands")
    }
  })
  bot.use(session()); 
  bot.use(stage.middleware());
  isDev() && bot.use(Telegraf.log())
  //++++++++++++++++++++++++++++++++++++++++USE ROOT FOLDERS+++++++++++++++++++
  utils.coupleBotWithFolders(bot,funcs)
  //++++++++++++++++++++++++++Use Composers+++++++++++++++++++
	bot.use(composers.subscription)
  //+++++++++++++++++++++++++++++++++Individual functions++++++++++++++++++++++
  bot.catch((err, ctx) => {
	return ctx.reply(`Ooops, encountered an error for ${ctx.updateType}`, err)
  })
  //bot.on("pre_checkout_query",ctx => ctx.answerPreCheckoutQuery(true))
  //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  await onCompletion(bot)


}