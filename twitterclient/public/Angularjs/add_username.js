/**
 * Created by aneri on 10-03-2016.
 */
var add_username=angular.module('add_username',[]);
add_username.controller('add_username',function($scope,$http)
{
    $scope.username_exists=true;
    $scope.unexpected_error=true;
    $scope.submit=function()
    {
        $http({
            method:"POST",
            url:'/add_username',
            data : {
                "user_name" : $scope.user_name,
            }

        }).success(function(data)
        {
            if (data.statusCode == 401) {
                $scope.username_exists = false;
                $scope.unexpected_error = true;
            }
            else
            {
                window.location.assign("/settingup_profile");
            }

        })
            .error(function(error) {
                $scope.unexpected_error = false;
                $scope.registered_user = true;
            });


    };


})