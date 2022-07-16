//can get ctx.startPayload for /start command thru deep link.
export default {
 description : "⚙️ Settings",
 handler : async (ctx) => {
  let info = `
  Here you can edit you proress, delete it.
  It all upto you.
  `
	 //🚨 TODO : Fix for production
	 ctx.scene.enter("settings")
 }
}