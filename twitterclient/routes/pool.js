var MongoClient = require('mongodb').MongoClient;
var db;
var connected = false;
var List = require("collections/list");
var maxPoolSize;
var connectionpool;
var connectioncount=0;

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



function createPool(initialsize, maxSize){
    console.log("Connection Pool is creaated");
    connectionpool = new List();
    maxPoolSize = maxSize;
    for(var i=0;i<initialsize;i++){
        connectionpool.push(connect());
    }
}

function getConnectionFromPool(){
    if(connectionpool.length == 0){
        if(connectioncount!=maxSize){
            connectioncount++;

            return getConnection();
        }
        else{
            console.log("Not available");
            return null;
        }}
    else{
        connectioncount++;
        return connectionpool.pop();
    }
}

function releaseConnection(connection){
    connectioncount--;
    connectionpool.push(connection);
}


exports.createPool=createPool;
exports.getConnectionFromPool=getConnectionFromPool;
exports.releaseConnection=releaseConnection;