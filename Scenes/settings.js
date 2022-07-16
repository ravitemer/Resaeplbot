import {Scenes} from "telegraf"

const steps = [
  async (ctx) => {
    try {
    const {username} = ctx.message.from
    if (!username) return error("No user name provided in settings")
    const userData = await admin.user.get({uid : username})
    const toggleReferralNotifications = (userData && userData.notifyReferrals == false) ? markup.button.callback(`🔔 Notify referrals`,"notify_referral") : markup.button.callback(`🔕 Stop Referral Notifications`,"dont_notify_referral")    
    const info = `
    Basic settings
    `
    ctx.reply(info,markup.inlineKeyboard([
     markup.button.callback("Delete my data","delete_user") ,
     toggleReferralNotifications,
    ]))
			
    ctx.wizard.next()
 
    } catch (e){
      error(e)
    }
   },
  composers.settings,
]

const scene = new Scenes.WizardScene('settings',...steps);



export default scene;

 