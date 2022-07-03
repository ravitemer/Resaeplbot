export default {
  middleware : [
    
  ],
  routes : {
    "baseRoute" : {
      path : "GET => /",
      handler : async (req,res) => {
        res.send("From subbot")
      }
    }
  }
}