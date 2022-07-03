const CryptoJS =  require("crypto-js")
const jwt = require("jsonwebtoken")
const {sendInvoice, sendPlans} = require("./payment.js")

var admin = require("firebase-admin");

//var serviceAccount = require("./test-558-service-account.json");
const serviceAccount = {
  "type": "service_account",
  "project_id": "test-558",
  "private_key_id": "28036b51eff00bbdb8521761f3facd2ed82c7baa",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDQ07Wr/57CrXC3\nPKNQQAPHspDEUvKG7E+QebyLiZhFnZ1btC9CqAOZUSBFwP5reKUHEXzT8wF1ZzzS\nbzpz9PS+7A8znUspV/zftPO9wQTOHdNJxJa7f6CEmHcRRUbNGz6rPPDwK3YoHuCW\ntS2kceIzZwupgW5yem3ZP9Gscy1ZzR2uWT57jzKggtzohfFe4Voi0gFbvIbR5ek6\nG5/VO5VhegAm4GrTXSByS9y5tTmcZOAiXb7FlTKUHQ7XyGNQyKbRmhdqxWpapR/v\nWd5MVyj2KEFpVUVMZY0NBJWcOlD0D6NutPhkIoXmSWX4tfkaxzUuIJ38bcjLo8tw\n5LYqDm7vAgMBAAECggEAaFFiHy5ePi0LMhYCFUwtNzyOEezHx7vT0T3nAKO3JAuk\n+JMNytQInDXJE99hmQlXEy1auLxbfa0ZVpwGzLdQ7fEZdPS9/8S7B3urCR8bieWf\nT2n7zGVop+RMEp4TTNGv4DXcvHVRnKA0HEUcrFnRoFD5I++K33gmWNEHKokM3h7w\nkqQxFyuE8h3ru6goYxH08smQ1INwslYRXmza9AVJUze6EDqqA3gXMsi7dC1iXZCt\n2cj/EmC74i34qT9uY/R8P/p1XyGLcqn/RllWo3yvAssyRyBXZTWZWBpkQ7kmVf65\n70xJZYZQkK7tAng9/UpcE9dr6PnGX/Zgu0Udx7C4iQKBgQDovtY3C5fF0I/9+dKz\n494COkjWYJpBAFzw2XRYt187RXUQk0rzUWiSflTHhgiIK2jUndTWZ4rH0EcSrA+4\n3WU4/m1MsxleZCeDLE0+4vH+Uq0xrmXv/4rCvTJJVnZEF0/BQaYs0qVjRrjUyLXw\nfToeTdQC+MwUAEuTMzUuOQ6wpwKBgQDlsRYc3y7WWf/0P3USEI0en9hjAOMO1E8U\noC14SXDqqFMrC2Ce18Eew5cSmUFtonVbpRK2aceC0o2q0ojtK/45FxgHO3CVGa3U\n/1FJQuOlyui73PXvx1sIws9T2khzQg8bkzzmziSxD2Vb1+o6rAW58XqRGo2edrk2\nNOvQvCmQeQKBgF9nWofVyLDdfSiubyAuF6LyIUk+7/wVGgPgH0D+aZryLbpNpjt2\n81aZUkc3OegXYzFEQSph5xFg3sFYplkw530lTchS4eM/SrMKRd+xR2DoovXqdv6Z\n0VdiFmrZdkETDS46qtNUxVacdsdCPtIFgv1JCc7uDTllpZUBOJtp6AuhAoGBAIfc\nuJS5Wu4FbEWgJ3JZAfAkYo0lIClMYb50hJDK+BSFHjSu1Sb/vcahsMGajz33Q23C\n9Y+agB2cx5lMURvg0s4YH+lfOlenSdBceUtZWmhd3k4JBBwhknJbMOGLkyFB6MfJ\nztNDCicFUVIDJBQyXmy/Ll2YFD6wQRuUMAxW0EsZAoGAXJvCRGcO6vRB3Ave3hJw\nDY6XAomi1cih1XTlM7ekZhshEPYJBfhb/mhiZRgBFjeYxXfQlqzDtYZw3gGjwhkv\nWLaJfudqmCYp63pu5t/60VcTIr/aLoeN6AJPMyolVr7v6N3lZaQotZp9hdPQPmhp\n+++PyxMyS+hr9IhaIR3V8A0=\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-k3x5m@test-558.iam.gserviceaccount.com",
  "client_id": "116388146109307006556",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-k3x5m%40test-558.iam.gserviceaccount.com"
}


const app = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://test-558-default-rtdb.firebaseio.com"
});
const auth = app.auth()
const database = app.database()
const firestore = app.firestore()

//===============================================================
async function toggleReferralNotifications({uid,shouldEnable}){
  try {
    await firestore.collection("Users").doc(uid).update({
      notifyReferrals : shouldEnable
    })
  } catch (e){
    error(e)
  }
}


//==============================================================
function extendFirebaseTime(oldExpiryDate, days){
   let oldDate = (oldExpiryDate && oldExpiryDate.toDate) ? oldExpiryDate.toDate() : new Date()
   return dayjs(oldDate).add(days,"day").toDate()
}

function extendTelegramTime(oldExpiryDate, days){
   let oldDate = dayjs.unix(parseInt(oldExpiryDate))
   return oldDate.add(days,"day").toDate()
}


//================================================================
//Referral
async function sendReferralLink({ctx}){
  //await ctx.log(`Generating referral link for ${uid}`)
  //const token = jwt.sign(uid,process.env.JWT_SECRET_KEY)
  const info = `
  Hey there! I found this telegram bot that helps me with my PLAB preparation including over 1700 questions. You can use my link and get extra ${process.env.REFERRAL_BONUS} days of trail.
https://t.me/${ctx.botInfo.username}?start=admin`

  await ctx.replyWithPhoto("https://picsum.photos/300/300?random",{ caption :info})
  await ctx.reply("You get referral credits whenever a new user signup using the above link. You can share it anywhere not just telegram.")
}



//====================================================================
//User handling
async function getUserDoc(uid){
  try {
     const doc = await firestore.collection("Users").doc(uid).get()        
     if (!doc.exists) return null
     return doc.data()
  } catch(e){
    error(e)
    return null
  }
}
async function addUser({uid,user,ctx,startPayload}){
    let document;
    try {
      ctx.log("Checking whether user already there")
      const [userAuthRec,doc] = await Promise.all([
       auth.getUser(uid),
       getUserDoc(uid),
      ]
      )
      if (!doc) {
//       document = await addUserToStore({uid,user : {
//         ...user,
//         expiryDate : dayjs.unix(user.createdAt).add(parseInt(process.env.FREE_TRIAL_PERIOD || 7),"day").toDate(),
//       },ctx}) 
      } else {
        document = doc
      }
      ctx.log(`Found user with auth uid and store doc: ${uid}`)
      return {
        auth : userAuthRec,
        document : document
      }
    } catch (e){
      if (e.code === "auth/user-not-found"){
        ctx.warn("User not found")
        const authAndStore = await createUser({uid,user,ctx,startPayload})
        return authAndStore
      } else {
        ctx.error(e.message)
      }
    }
}

async function createUser({uid,user,ctx,startPayload}){
  let userRec
  let document
  try {
    ctx.log("Creating user in auth")
    userRec = await auth.createUser({
      uid, 
      displayName : `${user.firstName} ${user.lastName}`,
    })
    await ctx.log(`Created user with auth uid : ${uid}`)
    ctx.log(`Checking whether ${uid} previously used the bot : storeDoc`)
    const doc = await firestore.collection("Users").doc(uid).get()        
    if (!doc.exists){
        ctx.log(`This is your first time using the bot.`)

        //User`s firsst time
        //Referral logic
        if (startPayload) {
          ctx.log(`Start payload found : ${startPayload}`)
          const referrer = startPayload.trim()
          if (uid !== referrer) {
            ctx.log(`Referrer : ${referrer} is not same as current : ${uid}`)
            const refererDoc = await firestore.collection("Users").doc(referrer).get()
            if (refererDoc.exists) {
              const data = refererDoc.data()
              ctx.log(`Referrer is an existing user. So genuine referral link`)
              const totalDays = parseInt(process.env.FREE_TRIAL_PERIOD || 10 ) + parseInt(process.env.REFERRAL_BONUS || 5)
              const currentUserExpiryDate = extendTelegramTime(user.createdAt,totalDays)
              document = await addUserToStore({
                uid,
                user : {
                  ...user,
                  expiryDate : currentUserExpiryDate,
                  referredBy : referrer,
                  },
                  ctx
                  })
                                ctx.reply(`🎊 🥳 You are referred by @${data.uid}! Your trail has been extended by ${process.env.REFERRAL_BONUS || 1} ${parseInt(process.env.REFERRAL_BONUS || 1) > 1 ? "days" : "day"}. 
Enjoy unlimited access until ${dayjs(currentUserExpiryDate).format('DD/MM/YYYY')}`)

              if (!data.referrals) data.referrals = []
              if (data.referrals.length < (process.env.MAX_REFERRALS_ALLOWED || 20)){
                              const trailUpdateData = await updateUserTrailPeriod({uid : referrer, referee : uid,ctx,at : user.createdAt, oldExpiryDate : data.expiryDate,oldReferrals : data.referrals,oldUserData : data})
              }
            } else {
              ctx.error(`Referrer does not exist`)
              document = await addUserToStore({uid,user : {
            ...user,
            expiryDate : extendTelegramTime(user.createdAt,parseInt(process.env.FREE_TRIAL_PERIOD || 10)),
          },ctx})
            }
          } else {
            ctx.error(`Referrer and referee should not be same`)
          }
        }else {
          ctx.log(`No start payload - Not from a referral link`)
          document = await addUserToStore({uid,user : {
            ...user,
            expiryDate : extendTelegramTime(user.createdAt,parseInt(process.env.FREE_TRIAL_PERIOD || 10)),

            
          },ctx})
        }
    } else {
              ctx.log(`This is not the first time you used this bot. Don't worry, Your data is there 😅`)
        document = doc.data()
    }
    return {
      auth : userRec,
      document : document
    }      
  } catch (e){
      if (e.code === "auth/uid-already-exists"){
        ctx.warn("User already there")
        const authAndDocument = await addUser({uid,user,ctx})
        return authAndDocument
      } else {
        ctx.error(e)
      }
  }
}


async function deleteUser({uid,ctx}){
  try {
    ctx.log(`Deleting ${uid} from auth. All claims will be lost`)
    await auth.deleteUser(uid)
    //✅ Save user data in the firestor even after deletion of bot, so that for future referral etc reference.
    await deleteUserFromStore({uid,ctx})
    ctx.log(`Deleted ${uid} : All data wiped`)
  } catch (e){
     if (e.code === "auth/user-not-found") {
       ctx.log(`It seems your data has already been cleaned.`)
     } else {
       ctx.error(e)       
     }
  }
}

async function updateUserTrailPeriod({uid,referee,ctx,at,oldExpiryDate,oldReferrals,oldUserData}){
  try {
    let referrals = oldReferrals || []
    if (referrals.length < (process.env.MAX_REFERRALS_ALLOWED || 20)){
          referrals = [
      ...referrals,
      {
        referred : referee,
        at : at,
      },
      ]      
    }
    const expiryDate = extendFirebaseTime(oldExpiryDate,parseInt(process.env.REFERRAL_BONUS || 1))
    await firestore.collection("Users").doc(uid).update({
      expiryDate : expiryDate,
      referrals : referrals
    })
      if (oldUserData.notifyReferrals !== false){
          ctx.telegram.sendMessage(oldUserData.chatId,`
🎊 🥳 Your referral link has been used by @${referee}! Your trail is now extended by ${process.env.REFERRAL_BONUS || 1} ${parseInt(process.env.REFERRAL_BONUS || 1) > 1 ? "days" : "day"}.
Enjoy unlimited access until ${dayjs(expiryDate).format('DD/MM/YYYY')}.
              `)                
    }                           

    return {
      success : true,
    }
  } catch (e){
    return {
      success : false,
      reason : e.message,
    }
  }
}

//======================================================
//Firestore

async function addUserToStore({uid,user,ctx}){
  try {
    ctx.log(`Adding ${uid} to datastore`)
    await firestore.collection(`Users`).doc(uid).set(user)
    ctx.log(`${uid} created in datastore`)
    return user
  } catch (e){
    error(e)
  }
}
async function deleteUserFromStore({uid,ctx}){
  try {
    ctx.log(`Deleting ${uid} from datastore`)
    const data = await firestore.collection("Users").doc(uid).delete()
    ctx.log(`${uid} deleted datastore`)
  } catch (e){
    error(e)
  }
}



//======================================================

///Real time


async function addUserToDb({uid,user,ctx}){
  try {
    ctx.log(`Adding ${uid} to database`)
    const data = await database.ref(`Users/${uid}/1700/info`).set(user)
    ctx.log(`${uid} created in database`)
  } catch (e){
    error(e)
  }
}
async function deleteUserFromDb({uid,ctx}){
  try {
    ctx.log(`Deleting ${uid} from database`)
    const data = await database.ref(`Users/${uid}/1700/info`).set(null)
    ctx.log(`${uid} deleted database`)
  } catch (e){
    error(e)
  }
}
//=======================================================
const handleUser = async (user)=> {
  let uid = user.username
  if (!uid) throw new Error("NO UID Sent")
  try {
      const user = await auth.getUser(uid)      
      let claims = {
        admin : false,
        paid : false,
      }
      if (user) {
         claims = user.customClaims
      }
      const token = await auth.createCustomToken(uid,claims)
      return token
  } catch (e){
    error(e)
  }

}

function verifyJWT(token){
  try {
   const data = jwt.verify(token,process.env.JWT_SECRET_KEY)
   return data
  } catch (e) {
    console.log(e)
    return null
  }
}

async function onSuccessfulPayment({username,paymentPayload}){
  if (!username) return null
  try {
      const user = await auth.getUser(username)
      if (user && user.customClaims && user.customClaims.paid == true) return {username,claims : user.customClaims}
      if  (user.customClaims){
        user.customClaims["paid"] = true
        
        
        await Promise.all([
          //set claims for user
           auth.setCustomUserClaims(username,user.customClaims),
           //save patment data on db
//           database.ref(`Users/${username}/1700`).update({
//            claims : {
//              paid : true
//            }
//          }),
//          //push payment payload 
//          database.ref(`Users/${username}/1700/payments`).push(paymentPayload),
        ])


        return {
          username,
          claims : user.customClaims
        }
      } else {
        user.customClaims = {
          paid : true
        }
        await Promise.all([
           auth.setCustomUserClaims(username,user.customClaims),
        ])
        return {
          username,
          claims : user.customClaims
        }
      }

    
  } catch (e) {
    console.log(e)
    return null;
  }
  
  
}




const isFromTelegram = (telegramInitData) => {
  const initData = new URLSearchParams(telegramInitData);
  const hash = initData.get("hash");
  const user = initData.get("user")

  let dataToCheck = [];
  
  initData.sort();
  initData.forEach((val, key) => key !== "hash" && dataToCheck.push(`${key}=${val}`));
  
  const secret = CryptoJS.HmacSHA256(process.env.TELEGRAM_BOT_TOKEN, "WebAppData");
  const _hash = CryptoJS.HmacSHA256(dataToCheck.join("\n"), secret).toString(CryptoJS.enc.Hex);
  
  const isFromTele = _hash === hash;
  return {
    isGenuine : isFromTele,
    user : JSON.parse(user)
  }
}
module.exports = {
  isFromTelegram,
  handleUser,
  onSuccessfulPayment,
  verifyJWT,
  addUser,
  deleteUser,
  sendReferralLink,
  getUserDoc,
  toggleReferralNotifications,
  sendInvoice,
  sendPlans,
}

