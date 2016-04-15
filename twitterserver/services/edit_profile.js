/**
 * Created by aneri on 11-04-2016.
 */
/**
 * Created by aneri on 08-04-2016.
 */
/**
 * Created by aneri on 07-04-2016.
 */
var mongo = require("C://Users/aneri/WebstormProjects/rabbitlogin/loginRabbitMQ-Client/routes/mongo.js");
var mongoURL = "mongodb://localhost:27017/twitter";
function handle_request(msg, callback){

    var res = {};
    console.log("bhenchod"+msg.user_name);
    console.log("In handle request of login:"+ msg.user_name);


    mongo.connect(mongoURL, function()
    {
        console.log('Connected to mongo at: ' + mongoURL);
        var coll = mongo.collection('users');
        console.log("inside mongo function");
        coll.update({user_name: msg.user_name},{$set:{"birthday":msg.birthday,"location":msg.location,"number":msg.number,"full_name":msg.full_name}},{upsert:true},

            function(err,user){

                if (user) {



                                console.log("successfull addition");
                                res.code = "200";




                }



                else{
                    console.log("failed");
                    res.code = "401";
                    res.value = "Failed Login";
                }
                callback(null, res);

            });
    });


};
exports.handle_request = handle_request;



