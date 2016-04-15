/**
 * Created by aneri on 08-04-2016.
 */
/**
 * Created by aneri on 04-04-2016.
 */
var MongoClient = require('mongodb').MongoClient;
var db;
var connected = false;
/**Connects to the MongoDB Database with the provided URL**/
function connect(url, callback){
    MongoClient.connect(url, function(err, _db){
        if (err) {
            throw new Error('Could not connect: '+err);
        }
        db = _db;
        connected = true;
        console.log(connected +" is connected?");
        callback(db);
    });
};
/**Returns the collection on the selected database**/  function collection(name){
    if (!connected) {
        throw new Error('Must connect to Mongo before calling "collection"');
    }
    return db.collection(name);
};
exports.connect =connect;
exports.collection =collection;/**
 * Created by aneri on 07-04-2016.
 */
