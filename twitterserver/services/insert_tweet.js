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
        console.log('Connected to mongo at: ' + mongoURL);
        var coll = mongo.collection('tweet_details');
        console.log("inside mongo function of insert tweet");
        coll.insert({tweet:{user_name: msg.user_name,full_name:msg.full_name,raw_text:msg.raw_text,hash_content:msg.hash_content,timestamp:msg.current_date}},
            function (err, user) {
                console.log("got it here also");
                if (user) {
console.log("got it");

                                // This way subsequent requests will know the user     is logged in.
                                console.log("tweet inserted");

                                res.code = "200";
                                console.log(res.code);
                                res.tweet_id="user.tweet_id"

                            }
                            else{
                                console.log("unexpected error");
                                res.code = "401";
                            }




                callback(null, res);

            });
    });


};


exports.handle_request = handle_request;






