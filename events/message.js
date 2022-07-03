export default async (ctx) => {
  const {update_id,botInfo,state,telegram,update} = ctx
  const {successful_payment,date,chat,from : {username,id,first_name,last_name},message_id} = ctx.message
  let data = {
      date,
      user : {username,first_name,last_name,id},
      message : {message_id},      
  }
  
  if (successful_payment) {
  try {
    const {currency, total_amount, invoice_payload, telegram_payment_charge_id, provider_payment_charge_id} = successful_payment
    data = {
      ...data,
      successful_payment,
    }
    const tokenData = {
      username : data.user.username,
    }
    const config = {
      url : `/telegram/paymentSuccess`,
      method : `post`,
      baseURL : `https://snippetsss.herokuapp.com`,
      data : data,
      headers : {
        "Authorization" : `Bearer ${ctx.generateJWT(tokenData)}`,
      }
    }
//    const res = await ctx.axios(config)
      
  } catch (e) {
      console.log(e)
  }

  }
}