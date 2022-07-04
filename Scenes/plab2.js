import { Scenes, Markup } from 'telegraf';

const scene = new Scenes.BaseScene('other');

scene.enter(async (ctx) => {
    await  ctx.reply('Entered Other scene.');
});

scene.leave(async (ctx) => {
 await  ctx.reply('Leaving Other scene');
});

scene.action("switch",async (ctx) => {
  await ctx.reply('swithing to wizard');
  return ctx.scene.enter('wizard'); // switch to some other scene
});


//scene.use((ctx) => ctx.replyWithMarkdown('This is the USE in the scene'));

export default scene;