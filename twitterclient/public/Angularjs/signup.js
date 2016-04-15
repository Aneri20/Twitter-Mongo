/**
 * Created by aneri on 10-03-2016.
 */
var Signup=angular.module('signup',[]);
Signup.controller('signup',function($scope,$http)
{
    $scope.registered_email=true;
    $scope.unexpected_error=true;

    $scope.submit=function()
    {
        $http({
            method:"POST",
            url:'/add_details',
            data : {
                "full_name" : $scope.full_name,
                "email":$scope.email,
                "password" : $scope.password
            }

        }).success(function(data)
        {
            if (data.statusCode == 401) {
                $scope.registered_email = false;
                $scope.unexpected_error = true;
            }
           if(data.statusCode==200)
           {
                window.location.assign("/adding_username");
            }
        })
            .error(function(error) {
                $scope.unexpected_error = false;
                $scope.registered_email = true;
            });


    };


})