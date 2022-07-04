export default {
  middleware : [
    
  ],
  routes : {
    //============================================
    
    //=============================================
    sendUserToken : {
      path : "POST => /user",
      handler : async (req,res) => {
       try {
          const {queryId} = req.body
         if (!queryId) return res.status(400).send("no Query Id provided")
         const {isGenuine,user} = admin.user.isFromTelegram(queryId)
         if (isGenuine){
           const token = await admin.user.sendFirebaseToken(user)
           if (!token) return res.status(500).send("User is from telegram. So already account was created. But some reason auth.getUser error.")
           res.status(200).setHeader("x-auth-token",token)
           res.json({
              isFromTelegram : true,
              user : user,
           })
         } else {
           res.status(401).send("You should open from telegram")     
         }
       } catch (e){
          console.error(e)
          res.status(500).send(e.message)
       }
     }
    },
    //====================================================
    sendTestToken : {
      path : "GET => /user",
      handler : async (req,res) => {
        try {
           const user = {username : "raviteja558"}
           const token = await admin.user.sendFirebaseToken(user)
           if (!token) return res.status(500).send("No uid sent")
           res.status(200).setHeader("x-auth-token",token)
           res.json({
              isFromTelegram : true,
              user : user,
           })
        } catch (e){
            console.error(e)
            res.status(500).send(e.message)
        }
      }             
    },
    //====================================================
  },
}