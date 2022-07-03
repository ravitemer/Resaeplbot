async function sendMenu({ ctx, menuData }) {
	const { text, keyboard } = menuData
	const inlineButtons = keyboard.map(obj => {
		return Object.entries(obj).map(([id, { name, handler }]) => markup.button.callback(name, id))
	})
	await ctx.reply(text, markup.inlineKeyboard(inlineButtons))
}

async function editMenu({ctx,menuData}){
  const {text,keyboard} = menuData
  const inlineButtons = keyboard.map(obj => {
    return Object.entries(obj).map(([id,{name,handler}]) => markup.button.callback(name,id))
  })
  await ctx.editMessageText(text,markup.inlineKeyboard(inlineButtons))
}

function menuBackButton(id){
	return {
		[`back_to_${id}`] : {
			name : "⏪ Back",
			handler : async ({ctx,menu,parent,grandParent}) => {
				ctx.answerCbQuery()
				await	editMenu({ ctx, menuData: grandParent})
			}
		}
	}
}
function powerMenuComposer({ composer, menu, parent }) {
	let buttons = []
	for (let row of menu.keyboard) {
		let rowButtons = Object.entries(row).map(([id, { handler, name, submenu }]) => ({ id, handler, name, submenu }))
		buttons.push(...rowButtons)
	}
	for (const button of buttons) {
		composer.action(button.id, async (ctx) => {
			if (button.handler) {
				await button.handler({ ctx, composer, ...button, parent: menu, grandParent: parent })
			} else {
				if (button.submenu){
						ctx.answerCbQuery()
						await editMenu({ ctx, menuData: button.submenu})
				}
			}
		})
		if (button.submenu) powerMenuComposer({ composer, menu: button.submenu, parent: menu })
	}
}


function coupleBotWithFolders(bot,funcs){
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

function chatLoggerFactory(ctx){
  const levels = {
    log : "⏩",
    info : "ℹ️",
    warn : "⚠️",
    error : "❌",
  }
  const funcsObj = {}
  function isAllowed(level){
    const debuglevel = process.env.DEBUG_LEVEL
    if (!debuglevel) return true
    if (Object.keys(levels).indexOf(debuglevel) <= Object.keys(levels).indexOf(level)) return true
  } 
  for (let level in levels){
    funcsObj[level] = async (string,...other) => {
      if (isAllowed(level)){
        let modstring = `
${levels[level]} 
${string}
        `
        await ctx.reply(modstring,...other)
      }
    }
  }
  return funcsObj
}
function consoleLoggerFactory(ctx){
  const levels = {
    log : "⏩",    
    info : "ℹ️",
    warn : "⚠️",
    error : "❌",
  }
  const funcsObj = {}
  function isAllowed(level){
    const debuglevel = process.env.DEBUG_LEVEL
    if (!debuglevel) return true
    if (Object.keys(levels).indexOf(debuglevel) <= Object.keys(levels).indexOf(level)) return true
  } 
  for (let level in levels){
    funcsObj[level] = (string,...other) => {
      if (isAllowed(level)){
        let modstring = string
        console.log(modstring,...other)
      }
    }
  }
  return funcsObj
}

export default {
  chatLoggerFactory,
  consoleLoggerFactory,
	sendMenu,
  editMenu,
  coupleBotWithFolders,
	menuBackButton,
	powerMenuComposer,
	
}