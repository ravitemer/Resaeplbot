import {Scenes} from "telegraf"

const steps = [
  async (ctx) => {
   await ctx.replyWithSticker(stickers.matrix,markup.removeKeyboard())
//   await ctx.setChatMenuButton({
//     type : "default",
//   })

//   await ctx.setChatMenuButton({
//     type : "web_app",
//     text : "1700",
//     web_app : {
//       url : "https://telegram-nuxt.vercel.app"
//     }
//   })
//   let msg = await ctx.reply("DEV MODE",ctx.markup.inlineKeyboard([
//    ctx.markup.button.webApp("APP","https://telegram-nuxt.vercel.app"),
//        ctx.markup.button.webApp("App2","https://telegram-nuxt.vercel.app/2")
//    ]
//   ))
//   await ctx.reply("Keyboard webapp",ctx.markup.keyboard([
  //    ctx.markup.button.webApp("APP","https://telegram-nuxt.vercel.app"),
//   ]).resize().oneTime())
//ctx.reply("ld",ctx.markup.removeKeyboard())
   ctx.wizard.next()
   },
  composers.dev,
//  (ctx) => {c.reply("Leaving dev mode")}
]

const scene = new Scenes.WizardScene('dev',...steps);



export default scene;

 