
export default {
 description : "😂 Chuck Norris",
 handler :   async (ctx) => {
   try {
      const {icon_url,value,id,url} = (await ctx.axios.get("https://api.chucknorris.io/jokes/random")).data
      ctx.reply( `
      ${value}
      ${url}
      `,ctx.inlineKeys.joke) 
   } catch (e){
     console.log(e) 
   }
 } 
}