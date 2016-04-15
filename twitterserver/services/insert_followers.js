/**
 * Created by aneri on 11-04-2016.
 */
/**
 * Created by aneri on 09-04-2016.
 */

/**
 * Created by aneri on 08-04-2016.
 */
/**
 * Created by aneri on 07-04-2016.
 */

/**
 * Created by aneri on 08-04-2016.
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



    mongo.connect(mongoURL, function() {
        console.log('Connected to mongo at insert follower: ' + mongoURL);
        var coll = mongo.collection('users');
        console.log("inside mongo function of insert followers");
        coll.update({user_name: msg.user_name},{$push:{"follower_user_name":{"user_name":msg.follower_name,"full_name":msg.full_name}}},
            function (err, user) {
                console.log("got it here also");
                if (user) {
                    console.log("inserted followers");

                    // This way subsequent requests will know the user     is logged in.


                    res.code = "200";
                    console.log(res.code);


                }
                else{
                    console.log("unexpected error");
                    res.code = "401";
                }






            });
    });

    callback(null, res);
};


exports.handle_request = handle_request;






