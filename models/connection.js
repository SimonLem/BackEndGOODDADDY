var mongoose = require('mongoose');

var user="admin";
var password="admin";
var bdd= "GoodDaddyCrypto";

var options = {
    connectTimeoutMS: 5000,
    useNewUrlParser: true,
    useUnifiedTopology : true
   }
   mongoose.connect(`mongodb+srv://${user}:${password}@cluster0.f1zmr.mongodb.net/${bdd}`, options,        
    function(err) {
      console.log(err);
    }
   );