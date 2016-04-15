/**
 * Created by aneri on 18-03-2016.
 */
var suggesteduserss=angular.module('suggesteduserss',[]);
suggesteduserss.controller('suggesteduserss',function($scope,$http) {
    console.log("hello");
    $scope.locationhide = true;
    $http({
        method: "get",
        url: '/getProfile',
    }).then(function (res) {
        //alert(res.data.tweets);

        console.log(res.data.iamfollowingg[0].follower_user_name.user_name+ " lololol");
        $scope.searching = false;

        $scope.iamfollowinghide=true;
        $scope.myfollowers=true;

        $scope.tweets = res.data.followerstweets;
        console.log($scope.tweets);
        $scope.userssuggested = res.data.userssuggested;
        console.log($scope.userssuggested);
        $scope.iamfollowing=res.data.cntiamfollowing;
        $scope.followingme = res.data.cntfollowingme;
        $scope.tweetsmine = res.data.mitweets;
        $scope.counttweet = res.data.tweetcount;
        $scope.searchtags = true;
        $scope.searching = false;
        $scope.profile=false;
        $scope.followersss=res.data.followerss;
        console.log("haha"+res.data.followerss);
        $scope.iamfollowinggg=res.data.iamfollowingg;
        $scope.user_name=res.data.user_name;
        $scope.full_name=res.data.full_name;
        $scope.birthday=res.data.birthday;
        $scope.location=res.data.location;
        $scope.number=res.data.number;
        console.log("hey" + $scope.iamfollowinggg[0].full_name);
        console.log("hey" + $scope.followersss);


        console.log("inside");
    });
    $scope.info = function () {

        $http({
            method: "POST",
            url: '/justtoinfo',
            data: {}
        }).success(function (data) {
            console.log("hey");
            $scope.locationhide = false;
            $scope.profile=true;

        })
            .error(function (error) {

            });


    };
    $scope.search = function () {

        $http({
            method: "POST",
            url: '/search',
            data: {
                "searchtag": $scope.searchtag
            }
        }).success(function (data) {
            console.log("BC");
            $scope.tweeet = data.tweet;
            console.log("tag");

            $scope.searchtags = false;
            $scope.searching = true;

        })
            .error(function (error) {

            });


    };

})