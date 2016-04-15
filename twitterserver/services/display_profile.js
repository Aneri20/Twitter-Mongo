/**
 * Created by aneri on 11-04-2016.
 */
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
function handle_request(msg, callback) {
    var res = {};
    mongo.connect(mongoURL, function () {
        console.log('Connected to mongo at: ' + mongoURL);
        var coll = mongo.collection('users');
        console.log("inside mongo function");
        coll.findOne({user_name: msg.user_name}, {
                "full_name": 1,
                "birthday": 1,
                "location": 1,
                "number": 1,
                user_name: 1
            }, {upsert: true},

            function (err, userssss) {

                if (userssss) {


                    res.full_name = userssss.full_name;
                    res.user_name = userssss.user_name;
                    res.birthday = userssss.birthday;
                    res.location = userssss.location;
                    res.number = userssss.number;

                    console.log(userssss.full_name);


                    res.code = "200";
                    coll.aggregate({$match: {"user_name": msg.user_name}}, {
                            $project: {
                                count: {$size: "$follower_user_name"},
                                _id: 0
                            }
                        },
                        function (err, users) {
                            if (err) {

                                //res.raw_text = user.tweet.raw_text;
                                //console.log(user.tweet.raw_text);
                                console.log("errpr");
                            }
                            else {

                                if (users) {

                                    console.log(users);
                                    console.log(users[0].count);
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
                                                res.iam = iamfollowing;
                                               // res.iam = iamfollowing;
                                                coll.count({"follower_user_name.user_name": msg.user_name},
                                                    function (err, usersss) {

                                                        if (err) {
                                                            console.log("error");
                                                        }
                                                        else {
                                                            if (usersss) {
                                                                coll.find({"follower_user_name.user_name": msg.user_name}, {
                                                                    "_id": 0,
                                                                    "user_name": 1,
                                                                    "full_name": 1
                                                                }).toArray
                                                                (function (err, followingme) {

                                                                    if (followingme) {
                                                                        res.me = followingme;


                                                                        var coll = mongo.collection('tweet_details');


                                                                        coll.count({"tweet.user_name": msg.user_name}, {"_id": 1},
                                                                            function (err, userss) {
                                                                                if (err) {

                                                                                    //res.raw_text = user.tweet.raw_text;
                                                                                    //console.log(user.tweet.raw_text);
                                                                                    console.log("errpr");
                                                                                }
                                                                                else {

                                                                                    if (userss) {
                                                                                        coll.find({"tweet.user_name": msg.user_name}, {"tweet": 1,_id:0}).sort({"tweet.timestamp":-1}).toArray(
                                                                                            function (err, tweet) {
                                                                                                if (tweet) {
console.log("eefbwfbefb"+tweet);
                                                                                                    res.tweett = tweet;

                                                                                                    console.log("count of tweet");
                                                                                                    console.log(userss);
                                                                                                    res.tweet_count = userss;
                                                                                                    res.iamfollowingcount = users[0].count;
                                                                                                    res.followingmecount = usersss;


                                                                                                }
                                                                                                callback(null, res);

                                                                                            }
                                                                                        )
                                                                                    }
                                                                                }
                                                                            });
                                                                    }
                                                                })
                                                            }
                                                        }
                                                    });
                                            }
                                        });
                                }}})}})})}




exports.handle_request = handle_request;



