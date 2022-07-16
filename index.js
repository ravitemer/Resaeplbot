import "dotenv/config";
import {Telegraf} from "telegraf"
import express from "express"
import cors from "cors"

import powerBot from "./utils/index.js";
import powerExpress from "./routes/index.js";


const API_TOKEN = isDev() ? process.env.TELEGRAM_TEST_BOT_TOKEN : process.env.TELEGRAM_BOT_TOKEN 
const PORT = process.env.PORT || 3000;
const URL = process.env.URL || 'https://plaber-bot.herokuapp.com';

const bot = new Telegraf(API_TOKEN);
const app = express();
app.use(express.json())
app.use(cors({
  origin : true,
  exposedHeaders : [
    "X-Auth-Token"
  ]
}))

//Add events,actions from folders to the BOT
powerBot(bot,async (bot) => {
  try {
    if (isDev()) {
      await bot.launch()
      console.log("✅ Bot ready.")
      
      process.once('SIGINT', () => bot.stop('SIGINT'))
      process.once('SIGTERM', () => bot.stop('SIGTERM'))
    } else {
      bot.telegram.setWebhook(`${URL}/bot${API_TOKEN}`);
      app.use(bot.webhookCallback(`/bot${API_TOKEN}`));
    }
    // Add express routes
    await powerExpress(app)
    //Launch express 
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    }) 
  } catch (e) {
    error(e)
  }
})

