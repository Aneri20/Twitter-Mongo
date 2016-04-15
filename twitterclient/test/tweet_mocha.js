/**
 * Created by haneri on 20-03-2016.
 */

var request  = require('request')
    ,express = require('express')
    ,assert = require("assert")
    ,http = require("http");

describe('http tests', function(){

    it('display signup page if url is correct', function(done){
        http.get('http://localhost:3000/', function(res) {
            assert.equal(200, res.statusCode);
            done();
        })
    });

    it('should not display the home page if url is incorrect', function(done){
        http.get('http://localhost:3000/home', function(res) {
            assert.equal(404, res.statusCode);
            done();
        })
    });

    it(' display login', function(done) {
        request.post(
            'http://localhost:3000/afterSignIn',
            { form: { user_name: 'shraaaaa',password:'hello' } },
            function (error, response, body) {
                assert.equal(200, response.statusCode);
                done();
            }
        );
    });

    it('display login page', function(done) {
        request.get(
            'http://localhost:3000/login',
            function (error, response, body) {
                assert.equal(200, response.statusCode);
                done();
            }
        );
    });
    it('fetch tweets on profile page load ', function(done) {
        request.get(
            'http://localhost:3000/add_details',
           { form: { email : 'shryu@s.com', password:'hello', full_name:'henry' } },
            function (error, response, body) {
                assert.equal(200, response.statusCode);
                done();
            }
        );
    });
});
