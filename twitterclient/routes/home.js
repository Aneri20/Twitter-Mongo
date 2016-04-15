var ejs = require('ejs');
var mysql = require('./mysql');
var async = require('async');
var crypto=require('crypto');
var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/twitter";
var mq_client = require('../rpc/client');

function login(req, res)
{
    res.render('login');
}
function justtodisplayprofile(req,res)
{
    console.log("hey");
    res.send({username:req.session.user_name});
}

function justtoinfo(req,res)
{
    console.log("hey");
    res.send("hey");
}
function logout(req,res)
{console.log("hello");
    ejs.renderFile('./views/login.ejs',function(err, result) {
        if (!err) {

            req.session.destroy();
        }
        else{
            res.end('An error occurred');
            console.log(err);
        }
    });
}
function profileforperson(req,res)
{
    ejs.renderFile('./views/profileforperson.ejs',{user:req.session.user_name,name:req.session.fullname},function(err, result) {
        if (!err) {
            res.end(result);

        }
        else{
            res.end('An error occurred');
            console.log(err);
        }
    });
}


function displayProfile(req,res)
{

    ejs.renderFile('./views/profile.ejs',function(err, result) {
        if (!err) {
            res.end(result);
        }
        else{
            res.end('An error occurred');
            console.log(err);
        }
    });
}

function afterSignIn(req, res) {
    var decipher = crypto.createDecipher('aes-256-ctr', 'd6F3Efeqwerty')
    var decrypt = decipher.update(req.param("password"),'utf8','hex')
    decrypt += decipher.final('hex');
   // var getUser = "select * from users where user_name='" + req.param("user_name") + "' and password='" + decrypt + "'";
console.log("inside after");
    var msg_payload={"user_name":req.param("user_name"),"password":decrypt,"functionToBeImplemented":"login"};

    mq_client.make_request('login_queue',msg_payload, function(err,results){
        console.log(results);
        if(err){
            throw err;
        }
        else
        {
            if(results.code == 200){
                req.session.user_name =results.user_name;
                req.session.user_id=results.user_id;
                global.userid = results.user_id;
                console.log("user id after login"+global.userid);
                global.full_name = results.full_name;
                req.session.full_name =results.full_name;
                console.log("valid Login");
                json_responses1=results.user_name;
                res.send({"statusCode":200,uname:json_responses1});
            }
            else {

                json_responses = {"statusCode" : 401};
                res.send(json_responses);
            }
        }
    });
}
function save(req,res) {

var name=req.param("fullname");
    var bdate = req.param("date");
    var loc = req.param("location");
    var num = req.param("number");
    var msg_payload={"birthday":req.param("date"),"location":req.param("location"),"number":req.param("number"),"functionToBeImplemented":"edit_profile","user_name":req.session.user_name,"full_name":req.param("fullname")};
    mq_client.make_request('display_profile_queue',msg_payload, function(err,results){
        console.log(results);
        if(err){
            throw err;
        }
        else
        {
            if(results.code == 200){
               console.log("details updated");
                res.render('profileforperson');
            }
            else {

                json_responses = {"statusCode" : 401};
                res.send(json_responses);
            }
        }
    });
}
   /* var details= "update users set birthday='"+req.param("date")+"',locationn='"+req.param("location")+"',contact='"+req.param("number")+"',full_name='"+req.param("fullname")+"' where user_id='"+global.userid+"'";
    mysql.fetchData(function (err, results) {


        if (results.affectedRows > 0) {
            console.log("updated details");

            res.render('profileforperson');
        }
        else {
            json_responses = {"statusCode": 401};
            res.send(json_responses);
        }



    }, details);




}

*/
function signup(req, res){
    ejs.renderFile('./views/signup.ejs',function(err, result) {
        if (!err) {
            res.end(result);
        }
        else{
            res.end('An error occurred');
            console.log(err);
        }
    });
}

function add_details(req,res) {


    var full_name = req.param("full_name");
    var password = req.param("password");
    var email = req.param("email");
    var json_responses;
global.email=req.param("email");
    req.session.full_name=req.param("full_name");
    encryption : var cipher = crypto.createCipher('aes-256-ctr', 'd6F3Efeqwerty')
    var encrypted = cipher.update(req.param("password"), 'utf8', 'hex')
    encrypted += cipher.final('hex');
    var msg_payload = {
        "full_name": req.param("full_name"),
        "password": encrypted,
        "email": req.param("email"),
        "functionToBeImplemented":"signup"
    };

    mq_client.make_request('login_queue', msg_payload, function (err, results) {
        console.log(results);
        if (err) {
            throw err;
        }
        else {
            if (results.code == 200) {
console.log("hey I got 200");
                res.send({"statusCode":200});


            }
            else if (results.code == 400) {
                res.send({"statusCode": 400});
            }
            else {
                res.send({"statusCode": 401});

            }
        }


    });
}


function insert_tweet(req,res) {
    console.log("tweet");


console.log("user id is"+global.userid );

    var raw_text = req.param("tweet_box");

    var hash = raw_text.match(/#\w+/g);

    console.log(hash);
    var hashids=[];
    var hashcontent = [];
    if (hash) {
        for (var i = 0; i < hash.length; i++) {
            hashcontent = hash[i].substr(1);

        }
        console.log(hashcontent);

        console.log("hash tags are" + hashcontent);

console.log(global.userid);
        var msg_payload = {
            "user_id": global.userid,
            "user_name":req.session.user_name,
            "full_name":req.session.full_name,
            "raw_text": req.param("tweet_box"),
            "current_date": new Date(),
            "hash_content": hashcontent,
            "functionToBeImplemented": "insert_tweet"
        };

        mq_client.make_request('tweet_queue', msg_payload, function (err, results) {
            console.log(results);
            if (err) {
                throw err;
            }
            else {
                if (results.code == 200) {
                    console.log("tweet insertion successful");
                    global.tweetid = results.tweet_id;

                }
                else {

                    console.log("tweet insertion failed");
                }
            }


        });
    }


                }





       /* function inserthashid(tweet_id,raw,callback)
        {
    ------------SEARCH TWEET_ID---------
            var msg_payload = {
                "hashtag":hashcontent,
                "functionToBeImplemented":"insert_hash_tag"

            };



            mq_client.make_request_tweet('tweet_queue', msg_payload, function (err, results) {
                console.log(results);
                if (err) {
                    throw err;
                }
                else {
                    if (results.code== 0) {
                        console.log("innnerrr");
                        //req.session.tweet_id = results[0].tweet_id;
                        console.log("********************************************************************");
                        console.log("Hash_id of hashtag " + results.hash_id);
                        hashids = results.hash_id;
                        var msg_payload = {
                            "hash_ids":hashids,
                            "tweet_id":tid,
                            "functionToBeImplemented":"insert_hash_message"

                        };

                        mq_client.make_request_tweet('tweet_queue', msg_payload, function (err, results) {
                            console.log(results);
                            if (err) {
                                throw err;
                            }
                            else {
                                if (results.code==200) {
                                    console.log("innnerrr");
                                    //req.session.tweet_id = results[0].tweet_id;
                                    console.log("********************************************************************");
                                    console.log("Hash_id of hashtag " + results.hash_id);
                                    hashids = results.hash_id;

                                    res.render('profile', {fullname: req.session.fullname, user: req.session.user_name});
                                }
                                else {

                                    console.log("insert into hash failed");
                                }
                            }
                        });

                    }
                    else {

                        console.log("insert into hash failed");
                    }
                }
                callback(null);
            });



        },



}*/
function add_username(req,res)
{
    var json_responses;
    var user_name='"+req.param("user_name")+"';
console.log("user id is"+global.email);
    req.session.user_name=req.param("user_name");
    var msg_payload={"user_name":req.param("user_name"),"email":global.email,"functionToBeImplemented":"add_user_name"};
    mq_client.make_request('login_queue', msg_payload, function (err, results) {
        console.log(results);
        if (err) {
            throw err;
        }
        else {
            if (results.code == 200) {
                console.log("hey I got 200");
                res.send({"statusCode":200});


            }
            else if (results.code == 400) {
                res.send({"statusCode": 400});
            }
            else {
                res.send({"statusCode": 401});

            }
        }


    });
}


function signup(req, res)
{
    ejs.renderFile('./views/signup.ejs',function(err, result)
    {
        if (!err)
        {
            res.end(result);
        }
        else
        {
            res.end('An error occurred');
            console.log(err);
        }
    });

}

function setup_profile(req,res)
{
    var insert_profile="update users set ='"+req.param("user_name")+"' where email='"+req.session.email+"'";

    mysql.fetchData(function(err,results) {
        if(err){
            throw err;
        }
        else {
            if(results>0){
                console.log("data entered");
                ejs.renderFile('./views/loggedin.ejs', { data: results } , function(err, result) {
                    if (!err) {
                        res.end(result);
                    }
                    else {
                        res.end('An error occurred');
                        console.log(err);
                    }
                });}
            else{
                console.log("Signup Failed");
                ejs.renderFile('./views/add_username.ejs',function(err, result){
                    if(!err){
                        res.end(result);
                    }
                    else{
                        res.end("error occured");
                        console.log(err);
                    }
                });
            }
        }

    }, insert_profile);
}


function getAllUsers(req, res){
    var getAllUsers = "select * from users";
    console.log(getAllUsers);

    mysql.fetchData(function(err, results){
        if(err){
            throw err;
        }
        else{
            if(results.length > 0){
                var rows = results;
                var jsonString = JSON.stringify(results);
                var jsonParse = JSON.parse(jsonString);
                console.log("Results Type: "+(typeof results));
                console.log("Result Element Type:"+(typeofrows[0].emailid));
                console.log("Results Stringify Type:"+(typeofjsonString));
                console.log("Results Parse Type:"+(typeofjsString));
                console.log("Results: "+(results));
                console.log("Result Element:"+(rows[0].emailid));
                console.log("Results Stringify:"+(jsonString));
                console.log("Results Parse:"+(jsonParse));

                ejs.renderFile('./views/successLogin.ejs',{data:jsonParse},function(err, result){
                    if(!err){
                        res.end(result);
                    }
                    else{
                        res.end("Error occured");
                        console.log(err);
                    }
                });
            }
            else{
                console.log("No users found in database");
                ejs.renderFile('./views/failLogin.ejs',function(err, result){
                    if(!err){
                        res.end(result);
                    }
                    else{
                        res.end("Error occured");
                        console.log(err);
                    }
                });
            }
        }
    }, getAllUsers);
}
function redirectToHomepage(req,res)
{
    //Checks before redirecting whether the session is valid
    if(req.session.user_name)
    {
        console.log("fname"+global.full_name);
        //Set these headers to notify the browser not to maintain any cache for the page being loaded
        res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
        res.render("profile",{user:req.session.user_name,fullname:global.full_name});
    }
    else
    {
        res.redirect('/');
    }
};

function adding_username(req, res){
    ejs.renderFile('./views/add_username.ejs',function(err, result) {
        if (!err) {
            res.end(result);
        }
        else{
            res.end('An error occurred');
            console.log(err);
        }
    });
}
function settingup_profile(req, res){
    ejs.renderFile('./views/setup_profile.ejs',function(err, result) {
        if (!err) {
            res.end(result);
        }
        else{
            res.end('An error occurred');
            console.log(err);
        }
    });
}
function gotohome(req, res){

    //Set these headers to notify the browser not to maintain any cache for the page being loaded

    res.render("profile",{user:req.session.user_name,fullname:req.session.full_name});

}


function insertFollowers(req, res) {
console.log("inside insert follower");
    console.log(req.param("user_name"));
    console.log(req.param("full_name"));
    var msg_payload = {
        "user_name":req.session.user_name,
        "follower_name": req.param("user_name"),
        "functionToBeImplemented":"insert_followers",
        "full_name":req.param("full_name")
    };

    mq_client.make_request('tweet_queue', msg_payload, function (err, results) {
        console.log(results);
        if (err) {
            throw err;
        }
        else {
            if (results) {
                console.log("follow insertion successful");
                var json_responses = {"statusCode": 200};
                res.send(json_responses);
            }
            else {

                console.log("follow insertion failed");
            }
        }


    });



}


/*  var followers = "insert into follows(user_id,follower_id) values('" + global.userid + "','" + req.param("userids") + "')";
  var json_responses = {};
  mysql.fetchData(function (err, results) {

      if (results.affectedRows > 0) {
          console.log("values entered");
          json_responses = {"statusCode": 200};
          res.send(json_responses);

      }
      else {
          json_responses = {"statusCode": 401};
          res.send(json_responses);
      }


  }, followers);

}*/


function getFeed(req,res) {
console.log("inside get Feed");
    var msg_payload = {
        "user_name": req.session.user_name,
        "user_id":global.userid,
        "functionToBeImplemented": "get_iamfollowing_count"
    };
    console.log("going to display home queue");

    mq_client.make_request('display_home_queue',msg_payload, function(err,results){
        console.log(results);
        if(err){
            throw err;
        }
        else
        {
            if(results){
                console.log("i am following count");
                console.log(results.iamfollowingcount);
                console.log(results.tweet_count);
                console.log(results.followingmecount);
                var jsonString2 = JSON.stringify(results.suggested);
                var suggestedusers = JSON.parse(jsonString2);

                res.send({"cntiamfollowing":results.iamfollowingcount,"tweetcount":results.tweet_count,"cntfollowingme":results.followingmecount,userssuggested: suggestedusers});



        }
            else{
                console.log("unexpected error");
            }
        }
    });
}
/*console.log(global.userid);
    var msg_payload = {
        "user_id":global.userid,
"user_name":req.session.user_name,
        "functionToBeImplemented":"display_homepage"
    };

    mq_client.make_request('display_home_queue', msg_payload, function (err, results) {

        if (err) {
            throw err;
            console.log("error")
        }
        else {
            if (results) {
                console.log("display data successful"+results[0].tweet);

               // console.log("result"+tweetsoffollowers);


                 res.send({
                     followerstweets: results
                });


            }
            else
            {
                console.log("unexpected");
            }

        }


    });

 */


function getProfile(req,res)
{
    console.log(global.userid);
    var msg_payload = {
        "user_id":global.userid,
        "user_name":req.session.user_name,
        "functionToBeImplemented":"display_profile"
    };

    mq_client.make_request('display_profile_queue', msg_payload, function (err, results) {

        if (err) {
            throw err;
            console.log("error")
        }
        else {
            if (results) {
                console.log("display profile info");
               var jsonString2 = JSON.stringify(results.iam);
                var suggestedusers = JSON.parse(jsonString2);
console.log(suggestedusers);
                var jsonString3 = JSON.stringify(results.tweett);
                var tweets = JSON.parse(jsonString3);
console.log("tweet is"+tweets);
                console.log("i am following count");
                console.log(results.iamfollowingcount);
                console.log(results.tweet_count);
                console.log(results.followingmecount);
                var jsonString3 = JSON.stringify(results.me);
                var followersss = JSON.parse(jsonString3)
console.log("hdhhd"+followersss);
                res.send({

                    mitweets:tweets,followerss:followersss,iamfollowingg:suggestedusers, full_name:results.full_name,user_name:results.user_name,birthday:results.birthday,location:results.location,number:results.number,"cntiamfollowing":results.iamfollowingcount,"tweetcount":results.tweet_count,"cntfollowingme":results.followingmecount
                });


            }
            else
            {
                console.log("unexpected");
            }

        }


    });



}




/* var gettweet = "SELECT tweet_details.raw_text,tweet_details.tweet_id,tweet_details.user_id, tweet_details.user_name, tweet_details.timestamp, users.full_name FROM tweet_details INNER JOIN users ON tweet_details.user_id = users.user_id WHERE tweet_details.user_id IN (SELECT follower_id FROM follows WHERE user_id='" + global.userid + "') OR tweet_details.user_id='" + global.userid + "' ORDER BY tweet_details.timestamp DESC  LIMIT 30";


 mysql.fetchData(function (err, results) {

         if (req.session.user_name) {
             console.log("dispying tweet");

             var jsonString1 = JSON.stringify(results);
             var tweetsoffollowers = JSON.parse(jsonString1);



                     var getsuggestedusers = "select * from users where user_id not in (select follower_id from follows where user_id='" + global.userid + "') and user_id!='" + global.userid + "' limit 3";
                     mysql.fetchData(function (err, results) {

                         if (req.session.user_name) {
                             console.log("displaying suggested users");
                             var jsonString2 = JSON.stringify(results);
                             var suggestedusers = JSON.parse(jsonString2);

                             var iamfollowing = "SELECT COUNT(*) AS num1 FROM follows WHERE user_id ='" + global.userid + "'";
                             mysql.fetchData(function (err, results) {
                                 if (err) {
                                     throw err;
                                 } else {

//
                                     var countiamfollowing = results[0].num1;
                                     console.log("following" + countiamfollowing);

                                     var followingme = "select count(*) as num from follows where follower_id='" + global.userid + "'";
                                     mysql.fetchData(function (err, results) {
                                         if (err) {
                                             throw err;
                                         } else {
                                             var countfollowingme = results[0].num;

                                             var counttweet = "select count(*) as cnt from tweet_details where user_id='" + global.userid + "'";
                                             mysql.fetchData(function (err, results) {
                                                 if (err) {
                                                     throw err;
                                                 }
                                                 else {
                                                     var counttweet = results[0].cnt;
                                                     var tweetsmine= "SELECT tweet_details.raw_text, tweet_details.user_name, tweet_details.timestamp, users.full_name,users.contact,users.birthday,users.locationn FROM tweet_details INNER JOIN users ON tweet_details.user_id = users.user_id where tweet_details.user_id='" + global.userid + "' ORDER BY tweet_details.timestamp DESC";
                                                     var json_responses = {};
                                                     mysql.fetchData(function (err, results) {

                                                         if (req.session.user_name) {
                                                             console.log("values entered"+results);
                                                             var jsonString = JSON.stringify(results);
                                                             var mytweets = JSON.parse(jsonString);

var iamfollowingg="select follows.follower_id, users.user_name, users.full_name, users.user_id FROM follows INNER JOIN users ON follows.follower_id = users.user_id WHERE follows.user_id = '"+global.userid+"'" ;
                                                             mysql.fetchData(function (err, results) {

                                                                 if(req.session.user_name) {
                                                                     console.log("got iamfollowing list");
                                                                     var jsonString5 = JSON.stringify(results);
                                                                     var iamfollowing = JSON.parse(jsonString5);
                                                                     var followers = "SELECT follows.user_id, users.user_name, users.full_name, users.user_id  FROM follows INNER JOIN users ON follows.user_id = users.user_id WHERE follows.follower_id= '"+global.userid+"'";
                                                                     mysql.fetchData(function (err, results) {
                                                                     if (req.session.user_name) {
                                                                         console.log("got following list");
                                                                         var jsonstring6 = JSON.stringify(results);
                                                                         var followerss = JSON.parse(jsonstring6);

                                                                     return res.send({
                                                                         followerstweets: tweetsoffollowers,
                                                                         userssuggested: suggestedusers,
                                                                         cntiamfollowing: countiamfollowing,
                                                                         cntfollowingme: countfollowingme,
                                                                         tweetcount: counttweet,
                                                                         mitweets: mytweets,
                                                                         iamfollowingg:iamfollowing,
                                                                         followerss:followerss
                                                                     });

                                                                 }},followers);
                                                                 }},iamfollowingg);
                                                         }},tweetsmine);
                                                 }

                                             }, counttweet);

                                         }
                                     }, followingme);


                                 }
                             }, iamfollowing);

                         }
                     }, getsuggestedusers);



         }
         else {
             console.log("follower id search failed");


         }


     }

 , gettweet);

}*/

function search(req,res) {
    var tweet = req.param("searchtag");
    var hash = tweet.match(/#\w+/g);

    console.log(hash);

    var hashcontent = [];


    for (var i = 0; i < hash.length; i++) {
        hashcontent = hash[i].substr(1);
    }
    var msg_payload = {
        "hashtag": hashcontent,
        "functionToBeImplemented": "search_tweet"
    };

    mq_client.make_request('tweet_queue', msg_payload, function (err, results) {
        console.log(results);
        if (err) {
            throw err;
        }
        else {
            if (results) {
                var jsonString5 = JSON.stringify(results.tweet);
                var tweets = JSON.parse(jsonString5);
console.log("tweet is"+tweets);
                res.send({tweet:tweets});
               // console.log("tweet insertion successful");
               // global.tweetid = results.tweet_id;

            }
            else {

                console.log("hash search failed");
            }
        }


    });
}



       /* var search = "select hash_message.tweet_id,tweet_details.raw_text from hash_message INNER JOIN tweet_details on hash_message.tweet_id=tweet_details.tweet_id  where hash_message.hash_id in (select hash_id from hashtags where hashtag like '" + hashcontent + "') ";

        mysql.fetchData(function (err, results) {
                if (results.length > 0) {
                    console.log("Search success");
                    var jsonString2 = JSON.stringify(results);
                    console.log(results[0].raw_text);
                    var json_responses = JSON.parse(jsonString2);
                    res.send( json_responses);
                }
                else {
                    console.log("Searchtag failed");
                }
            }
            , search);

}
*/
function retweet(req,res) {


    var retweet= "update tweet_details set retweet='"+global.userid+"' where user_id='"+req.param("useridss")+"' and tweet_id='"+req.param("tweettid")+"'";
    mysql.fetchData(function (err, results) {


        if (results.affectedRows > 0) {
            console.log("updated retweet details");

            res.render('/profile' ,{fullname:req.session.fullname,user:req.session.user_name});
        }
        else {
            json_responses = {"statusCode": 401};
            res.send(json_responses);
        }



    }, retweet);




}

exports.logout=logout;
exports.login=login;
exports.afterSignIn=afterSignIn;
exports.getAllUsers=getAllUsers;
exports.signup=signup;
exports.add_details=add_details;
exports.add_username=add_username;
exports.setup_profile=setup_profile;
exports.insert_tweet=insert_tweet;
exports.displayProfile=displayProfile;
exports.redirectToHomepage =redirectToHomepage;
exports.adding_username=adding_username;
exports.settingup_profile=settingup_profile;
exports.gotohome=gotohome;
/*exports.suggestedusers=suggestedusers;*/
exports.insertFollowers=insertFollowers;
exports.profileforperson=profileforperson;
exports.getFeed=getFeed;
exports.getProfile=getProfile;
exports.justtodisplayprofile=justtodisplayprofile;
exports.profileforperson=profileforperson;
exports.justtoinfo=justtoinfo;
exports.save=save;
exports.search=search;
exports.retweet=retweet;