//super simple rpc server example
var amqp = require('amqp')
    , util = require('util');
var mongoSessionConnectURL = "mongodb://localhost:27017/twitter";
var express = require('express');
var expressSession = require("express-session");
var mongoStore = require("connect-mongo")(expressSession);
var mongo = require("C://Users/aneri/twitter/twitterclient/routes/mongo.js");
var login = require('./services/login');
var Signup = require('./services/signup');
var add_user_name=require('./services/add_user_name');
var insert_tweet=require('./services/insert_tweet');
var insert_followers=require('./services/insert_followers');
var display_home=require('./services/display_home');
var display_profile=require('./services/display_profile');
var edit_profile=require('./services/edit_profile');
var search_tweet=require('./services/search_tweet');
var app = express();
var search_tweet=require('./services/search_tweet');
var cnn = amqp.createConnection({host:'127.0.0.1'});


cnn.on('ready', function(){
  console.log("listening on login_queue");

  cnn.queue('login_queue', function(q){
    q.subscribe(function(message, headers, deliveryInfo, m){
      console.log("user name issss:"+message.user_name);
      util.log(util.format( deliveryInfo.routingKey, message));
      util.log("Message: "+JSON.stringify(message));
      util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
      if(message.functionToBeImplemented == "login")
      {
      login.handle_request(message, function(err,res){
        console.log("user name isssssssss:"+message.user_name);
        console.log("inside server");

        //return index sent
        cnn.publish(m.replyTo, res, {
          contentType:'application/json',
          contentEncoding:'utf-8',
          correlationId:m.correlationId
        });
      });}
     else if(message.functionToBeImplemented == "signup")
      {
      Signup.handle_request(message, function(err,res){
        console.log("fullname isssssssss:"+message.full_name);
        console.log("inside server");

        //return index sent
        cnn.publish(m.replyTo, res, {
          contentType:'application/json',
          contentEncoding:'utf-8',
          correlationId:m.correlationId
        });
      });}
    else  if(message.functionToBeImplemented == "add_user_name")
      {
        add_user_name.handle_request(message, function(err,res){
          console.log("username isssssssss:"+message.user_name);
          console.log("inside server");

          //return index sent
          cnn.publish(m.replyTo, res, {
            contentType:'application/json',
            contentEncoding:'utf-8',
            correlationId:m.correlationId
          });
        });
      }

    });
  });
  cnn.queue('tweet_queue', function(q){
    console.log("listening on tweet_queue");
    q.subscribe(function(message, headers, deliveryInfo, m) {

      //util.log(util.format( deliveryInfo.routingKey, message));
      //util.log("Message: "+JSON.stringify(message));
      // util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
      if (message.functionToBeImplemented == "insert_tweet") {
        insert_tweet.handle_request(message, function (err, res) {

          console.log("inside server");

          //return index sent
          cnn.publish(m.replyTo, res, {
            contentType: 'application/json',
            contentEncoding: 'utf-8',
            correlationId: m.correlationId
          });
        });
      }
      else if (message.functionToBeImplemented == "insert_followers") {
        insert_followers.handle_request(message, function (err, res) {

          console.log("inside server");

          //return index sent
          cnn.publish(m.replyTo, res, {
            contentType: 'application/json',
            contentEncoding: 'utf-8',
            correlationId: m.correlationId
          });
        });
      }
      else if (message.functionToBeImplemented == "search_tweet") {
        search_tweet.handle_request(message, function (err, res) {

          console.log("inside server");

          //return index sent
          cnn.publish(m.replyTo, res, {
            contentType: 'application/json',
            contentEncoding: 'utf-8',
            correlationId: m.correlationId
          });
        });
      }
    });
  });
      cnn.queue('display_home_queue', function (q) {
        console.log("listening on display home_queue");
        q.subscribe(function (message, headers, deliveryInfo, m) {

          //util.log(util.format( deliveryInfo.routingKey, message));
          //util.log("Message: "+JSON.stringify(message));
          // util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
          if (message.functionToBeImplemented == "get_iamfollowing_count") {
            console.log("inside server of get iam following count");
            display_home.handle_request(message, function (err, res) {

              console.log("inside server");

              //return index sent
              cnn.publish(m.replyTo, res, {
                contentType: 'application/json',
                contentEncoding: 'utf-8',
                correlationId: m.correlationId
              });
            });
          }
          if (message.functionToBeImplemented == "get_tweet_count") {
            console.log("inside server of get tweet count");
            get_tweet.handle_request(message, function (err, res) {

              console.log("inside server");

              //return index sent
              cnn.publish(m.replyTo, res, {
                contentType: 'application/json',
                contentEncoding: 'utf-8',
                correlationId: m.correlationId
              });
            });
          }




        });
      });
      cnn.queue('display_profile_queue', function (q) {
        console.log("listening on display_queue");
        q.subscribe(function (message, headers, deliveryInfo, m) {
          if (message.functionToBeImplemented == "display_profile") {
            display_profile.handle_request(message, function (err, res) {

              console.log("inside server");

              //return index sent
              cnn.publish(m.replyTo, res, {
                contentType: 'application/json',
                contentEncoding: 'utf-8',
                correlationId: m.correlationId
              });
            });
          }

          else if (message.functionToBeImplemented == "edit_profile") {
            edit_profile.handle_request(message, function (err, res) {

              console.log("inside server");

              //return index sent
              cnn.publish(m.replyTo, res, {
                contentType: 'application/json',
                contentEncoding: 'utf-8',
                correlationId: m.correlationId
              });
            });
          }
          else if (message.functionToBeImplemented == "search_tweet") {
            search_tweet.handle_request(message, function (err, res) {

              console.log("inside server");

              //return index sent
              cnn.publish(m.replyTo, res, {
                contentType: 'application/json',
                contentEncoding: 'utf-8',
                correlationId: m.correlationId
              });
            });
          }

        });
      });
    });

