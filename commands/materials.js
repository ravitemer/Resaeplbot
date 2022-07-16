export default {
 description : "📚 Materials",
 handler :  async (ctx) => {
	 await admin.materials.sendCategories({ctx})
 } 
}