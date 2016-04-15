var ejs= require('ejs');//importing module ejsvar
mysql = require('mysql');//importing module mysql

function getConnection(){
    var connection = mysql.createConnection({
        host : 'localhost',
        user : 'aneri',
        password : 'aneri',
        database : 'test',
        port : 3306
    });
    return connection;
}
/*var pool = mysql.createPool({
    connectionLimit : 100, //important
    host : 'localhost',
    user : 'aneri',
    password : 'aneri',
    database : 'test',
    port : 3306
});*/

function fetchData(callback, sqlQuery) {
    console.log("\nSqlquery:: " + sqlQuery);
    pool.getConnection(function (err, connection) {
        connection.query(sqlQuery, function (err, rows, fields) {
            if (err) {
                console.log("ERROR: " + err.message);
            }
            else {
                console.log("DB Results:" + rows);
                callback(err, rows);
            }
        });
        console.log("Connection closed");
        connection.release();
    });
}
function storeData(callback,sqlQuery)
{
    console.log("\nSqlquery::"+sqlQuery);
    pool.getConnection(function (err, connection) {
        connection.query(sqlQuery, function (err, rows, fields) {
            if (err) {
                console.log("Error:" + err.message);
            }
            else {
                console.log("success");
                //rows=1;
                callback(err, rows);
            }
        });
        console.log("Connection closed");
        connection.release();
    });
}
exports.fetchData = fetchData;
exports.storeData = storeData;

/*var mysql = require('mysql');//importing module
var pool = require('./pool');

var mysql = require('mysql');
function fetchData(callback, sqlQuery){

    console.log("\nSqlquery:: "+ sqlQuery );
    var connection = pool.getConnectionFromPool();

    connection.query(sqlQuery, function(err, rows, fields){
        if(err){
            console.log("ERROR: " + err.message);
        }
        else{
            //	console.log("DB Results:"+"hellllloooooo");
            callback(err, rows);
        }
    });
    pool.releaseConnection(connection);

}






 /*function getConnection(){
 var connection = mysql.createConnection({
 host : 'localhost',
 user : 'aneri',
 password : 'aneri',
 database : 'test',
 port : 3306
 });
 return connection;
 }

 /*var pool      =    mysql.createPool({
 connectionLimit : 100, //important
 host : 'localhost',
 user : 'aneri',
 password : 'aneri',
 database : 'test',
 port : 3306
 });*/

/* function fetchData(callback, sqlQuery){
 //console.log("\nSqlquery:: "+ sqlQuery );
 pool.getConnection(function(err, connection){
 connection.query(sqlQuery, function(err, rows, fields){
 if(err){
 console.log("ERROR: " + err.message);
 }
 else{
 //	console.log("DB Results:"+"hellllloooooo");
 callback(err, rows);
 }
 });
 connection.release();
 });

 }*/

