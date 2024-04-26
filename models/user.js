const mongodb = require("mongodb");
const getDb = require("../util/database").getDb;

const ObjectId = mongodb.ObjectId;

class User{
  constructor(name, email){
    this.name = name;
    this.email = email;
  }
  save(){
    const db = getDb();
    return db.collection('products').insertOne(this)
    .then(result=>{
      console.log(result);
    })
    .catch(error=>{
      console.log(error);
      throw error;
    })
  }

  static findById(userId){
    console.log(typeof userId);

    const db = getDb();
    return db.collection('users')
    .findOne({_id: new ObjectId("662a3e12aa050d78f45605e2")})
    .then(result=>{
      console.log(result);
      return result
    })
    .catch(error=>{
      console.log(error);
    })
  }

}

module.exports = User;





