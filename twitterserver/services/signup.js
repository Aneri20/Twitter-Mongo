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
    console.log("bhenchod"+msg.full_name);
    console.log("In handle request of signup:"+ msg._name);


    mongo.connect(mongoURL, function() {
        console.log('Connected to mongo at: ' + mongoURL);
        var coll = mongo.collection('users');
        console.log("inside mongo function");
        coll.findOne({email: msg.email},
            function (err, user) {

                if (!user) {

                    coll.insert(
                        {

                            password: msg.password,
                            email: msg.email,
                            full_name: msg.full_name
                        },
                        function (err, user) {
                            if (!err) {
                                // This way subsequent requests will know the user     is logged in.
                                console.log("hey");

                                res.code = "200";
                                console.log(res.code);

                            }
                            else{
                                console.log("unexpected error");
                                res.code = "401";
                            }

                        });
                }
                else {
                    console.log("email already exists");
                    res.code = "400";

                }

                callback(null, res);

            });
    });


};


exports.handle_request = handle_request;




