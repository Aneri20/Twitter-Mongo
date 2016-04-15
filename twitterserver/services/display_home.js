/**
 * Created by aneri on 10-04-2016.
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
function handle_request(msg, callback) {

    var res = {};

    console.log("heye hi how are you");

    mongo.connect(mongoURL, function () {
        var coll = mongo.collection('users');
        console.log("startting querry");
        coll.aggregate({$match: {"user_name": msg.user_name}}, {
                $project: {
                    count: {$size: "$follower_user_name"},
                    _id: 0
                }
            },

            function (err, users) {
                if (users == undefined) {

                    //res.raw_text = user.tweet.raw_text;
                    //console.log(user.tweet.raw_text);
                    res.iamfollowingcount = 0;
                }
                else {

                    if (users) {

                        console.log(users);


                        coll.count({"follower_user_name.user_name": msg.user_name},
                            function (err, usersss) {

                                if (usersss == 0) {
                                    res.followingmecount = 0;
                                }
                                else {
                                    if (usersss) {
                                        console.log(usersss);
                                        coll.find({"user_name": {$ne: msg.user_name}}, {
                                            "user_name": 1,
                                            "full_name": 1,
                                            "_id": 0
                                        }).limit(3).toArray(
                                            function (err, use) {
                                                if (use) {

                                                    var user_names = [];
                                                    var full_names = [];

                                                    res.suggested = use;

                                                    coll.aggregate([{$unwind: "$follower_user_name"}, {$match: {"user_name": msg.user_name}}, {
                                                        $project: {
                                                            _id: 0,
                                                            follower_user_name: 1
                                                        }
                                                    }])
                                                        .toArray(
                                                        function (err, iamfollowing) {
                                                            if (iamfollowing) {
                                                                console.log("iamfollowing is" + iamfollowing);
                                                               // res.iam = iamfollowing;


                                                                var coll = mongo.collection('tweet_details');


                                                                coll.count({"tweet.user_name": msg.user_name}, {"_id": 1},
                                                                    function (err, userss) {
                                                                        if (userss == 0) {

                                                                            res.tweet_count = 0;
                                                                        }
                                                                        else {

                                                                            if (userss) {


                                                                                console.log("count of tweet");
                                                                                console.log(userss);
                                                                                res.tweet_count = userss;
                                                                                res.iamfollowingcount = users[0].count;
                                                                                res.followingmecount = usersss;


                                                                            }
                                                                            else {
                                                                                res.tweet_count = 0;
                                                                            }


                                                                        }

                                                                        callback(null, res);

                                                                    });
                                                            }
                                                        });
                                                }
                                            }
                                        )
                                    }
                                    ;
                                }
                            });
                    }
                }
            });
    });
}



exports.handle_request = handle_request;






