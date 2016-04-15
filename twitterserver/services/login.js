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
        coll.findOne({user_name: msg.user_name, password:msg.password},{full_name:1,user_name:1},

            function(err,user){

                if (user) {

                    console.log("heyy" + user.user_name)
                    console.log("full"+user.full_name);
                    coll.findOne({user_name: msg.user_name}, {_id: 1,full_name: 1},
                        function (err, users) {
                            if (users) {
                                console.log("heyy" + users._id);
                                res.code = "200";
                                res.value = "Succes Login";
                                res.user_name = user.user_name;
                                res.user_id=users._id;
                                console.log("user id iss"+users._id);
                                res.full_name=user.full_name;

                            }

                        });
                    // This way subsequent requests will know the user     is logged in.

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



