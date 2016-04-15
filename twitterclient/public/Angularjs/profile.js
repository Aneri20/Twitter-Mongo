/**
 * Created by aneri on 13-03-2016.
 */
var suggestedusers=angular.module('suggestedusers',[]);
suggestedusers.controller('suggestedusers',function($scope,$http)
{
$scope.home=false;
$scope.profileforperson=true;
        $http({
            method : "get",
            url : '/getFeed',

        }).then(function(res){
            //alert(res.data.tweets);
            $scope.counttweet = res.data.tweetcount;
            $scope.followingme = res.data.cntfollowingme;
            $scope.userssuggested = res.data.userssuggested;
            $scope.iamfollowing=res.data.cntiamfollowing;
            

            console.log("inside");
        });
    /*$scope.suggestusers=function()
    {
        console.log("inside init function");
        $http({
            method:"POST",
            url:'/suggestedusers',
            data : {

            }
        })  .success(function(data)
        {
            console.log("andar to aaya");
            if (data.statusCode == 401) {
                $scope.oh_snap = false;
                console.log("error");
            }
            else
            {
                $scope.profileforperson = false;
                $scope.home=true;
                $scope.displayusers=[];
                $scope.displayusers=data.users;
                console.log("Users are: "+$scope.displayusers);
                $scope.displayfullnames=[];
                $scope.displayfullnames=data.fullnames;
               $scope.displayuserids=[];
                $scope.displayuserids=data.userid;
                console.log("Full names are:"+$scope.displayuserids);
            }
        })
            .error(function(error) {
                $scope.unexpected_error = false;
                $scope.oh_snap = true;
            });
    };*/




    $scope.btnclick=function(usernames,fullnames)
    {

        $http({
            method:"POST",
            url:'/insertFollowers',
            data : {
                "user_name" : usernames,
                "full_name":fullnames
            }
        }).success(function(data)
        {
            console.log(data);
            if (data.statusCode == 401) {
                console.log("follow error")
            }
            else {
                $scope.button = "Following";
                console.log("followed");
                 window.location.assign("/homepage");
            }
        })
            .error(function(error) {
                console.log("na thayu");
            });


    };
   $scope.inserttweet=function()
    {

        $http({
            method:"POST",
            url:'/insertTweet',
            data : {
                tweet_box: $scope.tweet_box
            }
        }).success(function(data)
        {
            console.log(data);
            if (data.statusCode == 401) {
                console.log("display error")
            }
            else {
                $scope.displayusername=[];
                $scope.displayusername=data.username;
                console.log("Usernames are: "+$scope.displayusername);
               $scope.displayrawtext=[];
                $scope.displayrawtext=data.rawtext;
                console.log("Rawtext is:"+$scope.displayrawtext);
                $scope.displaytimestamp=[];
                $scope.displaytimestamp=data.timestamp;
                console.log("timestamp is:"+$scope.displaytimestamp);

                 window.location.assign("/homepage");
            }
        })
            .error(function(error) {
                console.log("na thayu");
            });


    }
       $scope.profileforperson=function()
    {
        $http({
            method:"POST",
            url:'/justtodisplayprofile',
            data : {

            }
        }).success(function(data)
        {
            $scope.uname=data.username;
            window.location.assign("/profileforperson");

        })
            .error(function(error) {

            });


    };
    $scope.retweet=function(userid,tweetid)
    {

        $http({
            method:"POST",
            url:'/retweet',
            data : {
                "useridss":userid,
                "tweettid":tweetid
            }
        }).success(function(data)
        {
            console.log("BC");
            $scope.tweeet=data;
            console.log("tag");

            $scope.searchtags=false;
            $scope.searching=true;

        })
            .error(function(error) {

            });


    };
})





