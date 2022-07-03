const invoice = {
  provider_token: isDev() ?  process.env.PAYMENT_PROVIDER_TEST_TOKEN : process.env.PAYMENT_PROVIDER_TOKEN,
//  start_parameter: 'time-machine-sku',
  title: 'Working Time Machine',
  description: 'Want to visit your great-great-great-grandparents? Make a fortune at the races? Shake hands with Hammurabi and take a stroll in the Hanging Gardens? Order our Working Time Machine today!',
  currency: 'inr',
  photo_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQy6_J5KdRVZmq9jx06RSMzXYzk4_0w3tXOS33pww1LOZpYMJrF8BL8H1Q&s=10",
//  is_flexible: true,
max_tip_amount : 1000000,
suggested_tip_amounts : [
  10000,
  20000,
  50000,
  100000,
],
  prices: [
    { label: 'Working Time Machine', amount: 4200 },
    { label: 'Gift wrapping', amount: 1000 }
  ],
  payload: JSON.stringify({
    coupon: 'BLACK FRIDAY'
  })
}

export default {
 description : "☕️ Buy me a coffee",
 handler : async (ctx) => {
   let info = `
   Hey there! Thanks for using me.

Any help would be much appreciated!
   `
   await ctx.reply(info)
   try {
        await ctx.replyWithInvoice(invoice)
   } catch (e){
     log(e)
   }

 } 
}