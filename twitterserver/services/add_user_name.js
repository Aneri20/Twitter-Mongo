/**
 * Created by aneri on 08-04-2016.
 */
var mongo = require("C://Users/aneri/WebstormProjects/rabbitlogin/loginRabbitMQ-Client/routes/mongo.js");
var mongoURL = "mongodb://localhost:27017/twitter";
function handle_request(msg, callback){

    var res = {};
    console.log("bhenchod"+msg.user_name);
    console.log("In handle request of add_user_name:"+ msg.user_name);


    mongo.connect(mongoURL, function() {
        console.log('Connected to mongo at: ' + mongoURL);
        var coll = mongo.collection('users');
        console.log("inside mongo function");
        coll.findOne({user_name: msg.user_name},
            function (err, user) {
                console.log("heeee");
                if (!user) {
                    console.log(msg.email);

                    coll.update(
                        {
                            email:msg.email
                        },{$set:{user_name:msg.user_name}},{upsert:true},
                        function (err, user) {
                            if (!err) {
                                // This way subsequent requests will know the user     is logged in.
                                console.log("hey dumb");

                                res.code = "200";
                                console.log(res.code);

                            }
                            else{
                                console.log("unexpected error");
                                res.code = "401";
                            }
                            callback(null, res);
                        });
                }
                else {
                    console.log("username already exists");
                    res.code = "400";

                }
                console.log("res code is"+res.code);



            });
    });


};

exports. handle_request=handle_request;