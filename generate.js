import fs from "fs";
import path from "path"
import { Composer, session } from "telegraf"
let folders = ["commands"]

async function readDir(pointer) {
	try {
		let funcObj = {}
		if (!fs.existsSync(path.resolve(__dirname, pointer))) return {}
		let files = fs.readdirSync(path.resolve(__dirname, pointer))
		for (let file of files) {
			let filepointer = path.resolve(__dirname, pointer, file)
			const cacheBustingModulePath = filepointer
			funcObj[file.split(".")[0]] = (await import(cacheBustingModulePath)).default
		}
		return funcObj
	} catch (e) {
		error(e)
	}

}

async function readDeepDir(pointer) {
	let composersObj = {}
	let singleFileComposers = {}
	try {
		let composers = fs.readdirSync(path.resolve(__dirname, pointer))
		let composerFolders = composers.filter(name => fs.lstatSync(path.resolve(__dirname, pointer, name)).isDirectory())
		let composerFiles = composers.filter(name => !fs.lstatSync(path.resolve(__dirname, pointer, name)).isDirectory())
		for (const composer of composerFolders) {
			let folders = ["events", "commands", "actions"]
			let funcObj = {}
			for (let folder of folders) {
				funcObj[folder] = await readDir(`${pointer}/${composer}/${folder}`)
			}
			composersObj[composer] = funcObj
		}
		for (const composerFile of composerFiles){
						let filepointer = path.resolve(__dirname, pointer, composerFile)
			singleFileComposers[composerFile.split('.')[0]] = (await import(filepointer)).default
		}
		return {
			bundle : composersObj,
			singleFileComposers
		}
	} catch (e) {
		log(e)
	}


}

function coupling(bot, funcs) {
	for (const [command, { handler }] of Object.entries(funcs["commands"] || {})) {
		bot.command(command, handler)
	}
	for (const [actionname, handler] of Object.entries(funcs["actions"] || {})) {
		bot.action(actionname, handler)
	}
	for (const [eventname, handler] of Object.entries(funcs["events"] || {})) {
		bot.on(eventname, handler)
	}
}


export default async function generateFunctions(folders) {
	let funcObj = {}
	try {
		for (let folder of folders) {
			if (folder == "Composers") {

				funcObj[folder] = await readDeepDir(folder)
				for (const [composer, composerFuncs] of Object.entries(funcObj["Composers"].bundles || {})) {
					const bot = new Composer()
					coupling(bot, composerFuncs)
					global.composers[composer] = bot
				}
				for (const [singleComposerName,singleComposer] of Object.entries(funcObj["Composers"].singleFileComposers)){
					global.composers[singleComposerName] = singleComposer
				}
			} else {
				funcObj[folder] = await readDir(folder)

			}
		}
		//global.funcs = funcObj
		return funcObj
	} catch (e) {
		error(e)
	}
}
