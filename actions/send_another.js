export default async (ctx) => {
   try {
      const {icon_url,value,id} = (await ctx.axios.get("https://api.chucknorris.io/jokes/random")).data
      ctx.replyWithImage(icon_url,ctx.inlineKeys.joke) 
   } catch (e){
     console.log(e) 
   }
 } 