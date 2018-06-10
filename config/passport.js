var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');
var Data = require('../models/survey');

// expose our config directly to our application using module.exports
module.exports = function (passport) {

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    //Login

    passport.use('login', new LocalStrategy({
           
            usernameField: 'username',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
        },
        function (req, username, password, done) {
            if (username)
                username = username.toLowerCase();

            // asynchronous
            process.nextTick(function () {
                User.findOne({
                    'acc.username': username
                }, function (err, user) {
                    // if there are any errors, return the error
                    if (err)
                        return done(err);

                    // if no user is found, return the message
                    if (!user)
                        return done(null, false, req.flash('loginMessage', 'No user found.'));

                    if (!user.validPassword(password))
                        return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));

                    // all is well, return user
                    else
                        return done(null, user);
                });
            });

        }));


    // Register

    passport.use('register', new LocalStrategy({

            usernameField: 'username',
            passwordField: 'password',
            passReqToCallback: true
        },
        function (req, username, password, done) {
            if (username)
                username = username.toLowerCase(); 

            // asynchronous
            process.nextTick(function () {
                // if the user is not already logged in:
                if (!req.user) {
                    User.findOne({
                        'acc.username': username
                    }, function (err, user) {
                        // if there are any errors, return the error
                        if (err)
                            return done(err);

                        // check to see if theres already a user with that username
                        if (user) {
                            return done(null, false, req.flash('registerMessage', 'That username is already taken.'));
                        } else {

                            // create the user
                            var newUser = new User();

                            newUser.acc.username = username;
                            newUser.acc.password = newUser.generateHash(password);

                            newUser.save(function (err) {
                                if (err)
                                    return done(err);

                                return done(null, newUser);
                            });
                        }

                    });

                }

            });

        }));

    passport.use('submit', function(req, done) {

        var newSurvey = new Data();
        var sName =  testsurvey;

        Data.findOne({
           'survey.surveyname': sName
        }, function(err, sName) {

            if(err)
                return done(err);
        

            else {
                
                newSurvey.survey.secret = 1234;
                newSurvey.survey.surveyname = sName;

                newSurvey.save(function (err) {
                    if (err)
                        return done(err);

                    return done(null, newSurvey);
                });
            }
        });

        var AllQuestions = document.body.getElementsByTagName("fieldset");

            //ansync
            process.nextTick(function(){

                Data.findOne({
                    'survey.surveyname': sName
                }, function(err) {

                    if(err)
                        return done(err);

                    var newSubmit = new Data();

                    newSubmit.survey.submitID = newSubmit.generateID();
                    newSubmit.survey.question = AllQuestions;
                     
                    newSubmit.save(function (err) {
                        if (err)
                            return done(err);
    
                        return done(null, newSubmit);
                    });
                }
            );

            });
        });

    passport.use('export', function(req, res, done) {

        //ansync
         process.nextTick(function(){

             Data.findOne({
                 'survey.surveyname': sName
                }, function(err) {
    
                    if(err)
                        return done(err);

                    }
                ).csv(res);
    
                });

    });
}