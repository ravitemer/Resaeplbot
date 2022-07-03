export class Seventeen {
  constructor({totalQuestions}={totalQuestions: 1700}){
    this.db = global.db
    this.total = parseInt(totalQuestions) || 1700
  }
  async sendQuestion(ctx,{index}={}){
    if (index === undefined || index === null){
      index = await this.getCurrentIndex(ctx.chat.username)
    }
    let ques = await this.getQuestion(index)
    log(ques.question.length)
    ctx.replyWithQuiz(
      ques.question.slice(0,300),
      ques.options,
      { correct_option_id: ["A","B","C","D","E"].indexOf(ques.keys[0]),
      is_anonymous : false,
      protect_content : true,
//      explanation : ques.answer.slice(0,200),
       }
    )
  }

  async getQuestion(index){
    const {question,a,b,c,d,e,keys,answer} = await this.db.getItem(`1700/questions/${index}`) 
    return {
      question : question,
      options : [a,b,c,d,e].filter(op => op),
      keys : keys,
      answer,
    }
  }
  async sendNextQuestion(ctx){
    await this.setNextIndex(ctx.chat.username);
    await this.sendQuestion(ctx);
  }
  async sendPreviousQuestion(ctx){
    await this.setPreviousIndex(ctx.chat.username);
    await this.sendQuestion(ctx);
  }

  async getCurrentIndex(username){
    let index = await this.db.getItem(`Users/${username}/1700/index`)
    if (index === null || index === undefined){
      await this.setCurrentIndex(username,0)
      return 0
    } else {
      return parseInt(index) || 0;
    }
  }
  async setCurrentIndex(username,index){
    await this.db.setItem(`Users/${username}/1700/index`,index)
    return index
  }
  async setNextIndex(username){
    let currentIndex = await this.getCurrentIndex(username)
    currentIndex += 1
    if (currentIndex < this.total){
      return await this.setCurrentIndex(username,currentIndex)
    }else {
      return await this.setCurrentIndex(username,0)
    }
  }
  async setPreviousIndex(username){
    let currentIndex = await this.getCurrentIndex(username)
    currentIndex -= 1
    if (currentIndex >= 0){
      return await this.setCurrentIndex(username,currentIndex)
    }else {
      return 0
    }
  }

}