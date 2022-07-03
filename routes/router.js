export default {
  middleware : [
    
  ],
  routes : {
    basicRoute : {
      path : "GET => /",
      handler : async (req,res) => {
        res.status(200).send("Hello coooll")
      },
    }
          
  }
}