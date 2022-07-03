import fs from "fs";
import path from "path"
import {Composer,session} from "telegraf"
let folders = ["commands"]

async function readDir(pointer){
  let funcObj = {}
  if (!fs.existsSync(path.resolve(__dirname,pointer))) return {}
  let files = fs.readdirSync(path.resolve(__dirname,pointer))
  for (let file of files){
    let filepointer = path.resolve(__dirname,pointer,file)
    const cacheBustingModulePath = `${filepointer}?update=${Date.now()}`
    funcObj[file.split(".")[0]] = (await import(cacheBustingModulePath)).default
  }
  return funcObj
}

async function readDeepDir(pointer){
  let composersObj = {}
  let composers = []
  try {
       composers = fs.readdirSync(path.resolve(__dirname,pointer)).filter(name => fs.lstatSync(path.resolve(__dirname,pointer,name)).isDirectory())
         for (const composer of composers){
      let folders = ["events","commands","actions"]
      let funcObj = {}
      for (let folder of folders){
        funcObj[folder] = await readDir(`${pointer}/${composer}/${folder}`)
      }
      composersObj[composer] = funcObj
   }
     return composersObj
  } catch (e){
    log(e)
  }


}

function coupling(bot,funcs){
  for (const [command,{handler}] of Object.entries(funcs["commands"] || {})){
    bot.command(command,handler)
  }
  for (const [actionname,handler] of Object.entries(funcs["actions"] || {})){
    bot.action(actionname,handler)
  }
  for (const [eventname,handler] of Object.entries(funcs["events"] || {})){
    bot.on(eventname,handler)
  }
}


export default async function generateFunctions(folders){
  let funcObj = {}
  try {
      for (let folder of folders){
    if (folder == "Composers") {

      funcObj[folder] = await readDeepDir(folder)
      for (const [composer,composerFuncs] of Object.entries(funcObj["Composers"] || {})){  

        const bot = new Composer()
//        bot.use(session())
        coupling(bot,composerFuncs)
        global.composers[composer] = bot

      }
    } else {
       funcObj[folder] = await readDir(folder)

    }
  }
  //global.funcs = funcObj
  return funcObj    
  } catch (e){
    error(e)
  }
}
