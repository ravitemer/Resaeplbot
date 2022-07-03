import {Scenes} from "telegraf"

const steps = [
  async (ctx) => {
   await ctx.replyWithSticker(stickers["1700"],markup.removeKeyboard())
   let msg = await ctx.replyWithHTML(`
A collection of the famous <code>1700</code> MCQs for PLAB 1. 

With /1700 command you can <b><code>ANSWER</code></b> more than 1700 MCQs, <b><code>BOOKMARK</code></b> them and can also <b><code>REVISE</code></b> your previous mistakes.

<b>📈 Progress</b>
  Start right from where you left.  
  
<b>🔖 Bookmarks</b>
  You can access you bookmarked questions here.
  
<b>🙇🏻‍♂️ Revision</b>
  The questions you got wrong previously appear here. 
   `,markup.inlineKeyboard(
[
  [
         markup.button.webApp("📈 Progress","https://telegram-nuxt.vercel.app/1700"),
  ],
  [
         markup.button.webApp("🔖 Bookmarks","https://telegram-nuxt.vercel.app/1700/bookmarks"),
         markup.button.webApp("🙇🏻‍♂️ Revision","https://telegram-nuxt.vercel.app/1700/revision"),
  ]
] 
     ).resize())
   
   ctx.wizard.next()
   },
  composers["1700"],
]

const scene = new Scenes.WizardScene('1700',...steps);



export default scene;