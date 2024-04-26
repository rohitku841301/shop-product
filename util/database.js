const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;


let _db;

const mongoConnect = (callback)=>{
  MongoClient.connect('mongodb+srv://rohitku841301:JfNFM1EMLPdMIFmM@shop-product.3iq5nui.mongodb.net/')
  .then((client)=>{
    console.log('connected');
    _db = client.db()
    callback();
  })
  .catch((error)=>{
    console.log(error);
  })
}

const getDb = ()=>{
  if(_db){
    return _db;
  }else{
    throw "No database found"
  };
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;




