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



    mongo.connect(mongoURL, function()
    {
        console.log('Connected to mongo at: ' + mongoURL);
        var coll = mongo.collection('tweet_details');
        console.log("inside mongo function");
        coll.find({"tweet.hash_content": msg.hashtag},{"tweet":1,_id:0}).sort({"tweet.timestamp":-1}).toArray(


            function(err,user){

                if (user) {
                    console.log("username is"+user.user_name);


                     res.tweet=user;

                    console.log("heyy" + user);
                }

                    // This way subsequent requests will know the user     is logged in.





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



