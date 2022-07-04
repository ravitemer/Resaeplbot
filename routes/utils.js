import fs from "fs";
import express from "express"
import {dirname ,resolve,relative} from "path"
import { fileURLToPath } from 'url';
const _dirname = dirname(fileURLToPath(import.meta.url));
const _filename = fileURLToPath(import.meta.url)


function powerRouter(router,routes){
  for (let [key,value] of Object.entries(routes || {})){
    const {path,handler} = value
    if (!path || !handler) continue
    let [method,route] = path.split("=>")
    method = method.trim()
    route = route.trim()
    if (route) {
          let queryIndex = route.indexOf("?") 
          route = queryIndex >= 0 ? route.slice(0, queryIndex ) : route
    }
    switch (method) {
      case "GET":
        router.get(route,handler)
        break
      case "POST":
        router.post(route,handler)
        break
      case "PATCH":
        router.patch(route,handler)
        break
      case "DELETE":
        router.delete(route, handler)
        break
      case "PUT" : 
        router.put(route, handler)
        break
      default : 
        break
    }
  }
  return router  
}

async function generateRoutes(rootFolder){
  let routers = {}
  const files = fs.readdirSync(resolve(rootFolder))
  const folders = files.filter(name => fs.lstatSync(resolve(rootFolder,name)).isDirectory())
  if (folders.length > 0) {
    for (let folder of folders){
      const x = await generateRoutes(resolve(rootFolder,folder))
      routers = {...routers,...x}
    } 
  }
  const routerFile = files.find(file => file === "router.js")
  if (routerFile) {
    const routerPath = resolve(rootFolder,routerFile)
    const {middleware,routes} = (await import(routerPath)).default
    let router = express.Router()
    let baseRoute = "/" + relative(_dirname,routerPath).replace("router.js","")
    router = powerRouter(router,routes)
    //log(`Generated ${baseRoute} router`)
    routers[baseRoute] = {middleware,router}
  }
  return routers  
}

//function readDir(folder){
//  let routerObj = {}
//  if (!fs.existsSync(path.resolve(__dirname,pointer))) return {}
//  let files = fs.readdirSync(path.resolve(__dirname,pointer))
//  for (let file of files){
//    let filepointer = path.resolve(__dirname,pointer,file)
//    const cacheBustingModulePath = `${filepointer}?update=${Date.now()}`
//    funcObj[file.split(".")[0]] = (await import(cacheBustingModulePath)).default
//  }
//  return funcObj
//}




export default async function powerExpress(app){
 const routers = await generateRoutes(_dirname)  
 for (let routerName in routers){
   app.use(routerName,...routers[routerName].middleware || [],routers[routerName].router || (() => {}))
 }
}