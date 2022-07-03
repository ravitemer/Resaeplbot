import { Scenes, Markup } from 'telegraf';


const steps = [
  async (ctx) => {
    await ctx.reply("Whats your name?",markup.forceReply())
    ctx.wizard.state.user = {}
    console.log(ctx.wizard.cursor)
    ctx.wizard.next()


  },
  async(ctx) => {
        console.log(ctx.wizard.cursor)
    if (ctx.message.text.length < 3){
      await ctx.reply("Name must be more than 2characters")
      return
    } else {
          ctx.wizard.state.user.name = ctx.message.text
          await ctx.reply(`What's your age?`,markup.forceReply())
          ctx.wizard.next()
    }
  },
  async(ctx) => {
    console.log(ctx.wizard.cursor)
    if (isNaN(parseInt(ctx.message.text)) || parseInt(ctx.message.text) < 16){ 
      await ctx.reply("You cant move forward bcoz of your age. Must be > 18")
      return
    } else {
          ctx.wizard.state.user.age = parseInt(ctx.message.text)
          await ctx.reply(`It seems that your age is ${ctx.message.text}`)
          await ctx.reply(`Here's the data saved to db:
              ${JSON.stringify(ctx.wizard.state.user)}
          `)
          await ctx.scene.enter("greeter")
    }
  },
]









const scene = new Scenes.WizardScene('wizard',...steps);


export default scene;