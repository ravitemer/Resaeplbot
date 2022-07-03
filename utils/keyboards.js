import {Markup} from "telegraf"
const inlineKeyboards = {
  //===============
  joke : Markup.inlineKeyboard([
    Markup.button.callback("🤣 Again","send_joke")
  ]),
  //==============
  _1700 : Markup.inlineKeyboard([
    Markup.button.callback("⏩ Next","next")
  ]),
  //===============
  
}

const normalKeyboards = {
  
}





export default {
  keyboards : normalKeyboards,
  inlineKeyboards : inlineKeyboards,
}




//==================as a middleware=============================
//export default (ctx,next) => {  
//  const Markup = ctx.markup
//  ctx.Keys = normalKeyboards(Markup)
//  ctx.inlineKeys = inlineKeyboards(Markup)
//  next()
//}
 