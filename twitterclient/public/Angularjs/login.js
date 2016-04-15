
//var mysql = require('./mysql');
var Login=angular.module('login',[]);
Login.controller('login',function($scope,$http)
{
    $scope.invalid_login=true;
    $scope.unexpected_error=true;    $scope.submit=function()
    {
        $http({
            method:"POST",
            url:'/afterSignIn',
            data : {
                "user_name" : $scope.user_name,
                "password" : $scope.password
            }
        }).success(function(data)
        {
            if (data.statusCode == 401) {
                $scope.invalid_login = false;
                $scope.unexpected_error = true;


            }
            else {
                $scope.name=data.uname;
                console.log("u"+$scope.name);
                window.location.assign("/homepage");
            }
            })
            .error(function(error) {
            $scope.unexpected_error = false;
            $scope.invalid_login = true;
        });


    };


})
