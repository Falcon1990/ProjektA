var Data = require('./models/survey');
var mongoose_csv = require('mongoose-csv');

module.exports = function(app, passport) {

    // normal routes ===============================================================
    
        // HOMEpage
        app.get('/', function (req, res) {
            res.render('login');
        });
    

        app.get('/content', isLoggedIn, function(req, res) {
            res.render('content', {
                user : req.user
            });
        });
        
        app.get('/createSurvey', isLoggedIn, function(req, res) {
            res.render('createSurvey', {
                user : req.user
            });
        });

        app.get('/test', isLoggedIn, function(req, res) {
            res.render('test', {
                user : req.user
            });
        });

        app.post('/logout', function(req, res) {
            req.logout();
            res.redirect('/login');
        });
    
        
        // Login ============================
    
            app.get('/login', function(req, res) {
            res.render('login.ejs', { message: req.flash('loginMessage') });
            });

            // process the login form
            app.post('/login', passport.authenticate('login', {
                successRedirect : '/content', 
                failureRedirect : '/login', 
                failureFlash : true 
            }));
    
    
            // process the register form
            app.post('/register', passport.authenticate('register', {
                successRedirect : '/content', 
                failureRedirect : '/register', // redirect back to the register page if there is an error
                failureFlash : true // allow flash messages
            }));

            function isLoggedIn(req, res, next) {
                if (req.isAuthenticated())
                    return next();
            
                res.redirect('/');
            }

        // process queries

        app.post('/search', function(req, res, err) {
            var searchValue = req.body['SurveyName'];
            res.redirect('/' + searchValue);
            
                if(err) {
                     req.flash('loginMessage', 'No such survey found!')
                }
        });

        app.post('/submit',  function(req, res ) {

            var sName =  "testsurvey";
    
            Data.findOne({
               'survey.surveyname': sName
            }, function(err, sName) {       
                
                if(err){
                    return err;
                    }
                
                var newSurvey = new Data();
                    
                newSurvey.survey.secret = 1234;
                newSurvey.survey.surveyname = sName;
    
                newSurvey.save(function (err) {
                    if (err)
                        return (err);
    
                        return (null, newSurvey);
                    });
                
            });
    
                //ansync
                process.nextTick(function(){
    
                    Data.findOne({
                        'survey.surveyname': sName
                    }, function(err) {
    
                        if(err)
                            return (err);
    
                        var newSubmit = new Data();
    
                        newSubmit.survey.submitID = newSubmit.generateID();

                        for(var description in req.body) {
                            if(req.body.hasOwnProperty(description)) {
                                newSubmit.survey.questions.description = req.body[description];
                            }
                        }

                        for(var answer in req.body) {
                            if(req.body.hasOwnProperty(answer)) {
                                newSubmit.survey.questions.answer = req.body[answer];
                            }
                        }
                         
                        newSubmit.save(function (err) {
                            if (err)
                                return (err);
        
                            return (null, newSubmit);
                    
                        });
                       
                    }
                );
                res.redirect('/content');
    
                });
            });

        app.get('/export',  function(req, res ) {

            //ansync
             process.nextTick(function(){
    
                 Data.findOne({
                     'survey.secret': req.body['SurveyNumber']
                    }, function(err) {
        
                        if(err)
                            return (err);
    
                        }
                    ).csv(res);
        
                    });
    
        });

        /* Protoype of the create custom Survey
        app.post('/createSurvey', function (req, res) {
            req.addListener('data', function(message)
                {
                    var command = JSON.parse(message);
                    var document = {
                        surveyname : command.surveyname,
                        surveyid : command.surveyid,
                        question     : [{
                            description : command.description,
                                answer : command.answer
                        }]
                    };
                    Survey.insert(document,function(err, records){
                    res.send('Inserted');
                    res.redirect('/content');
                    });
                });
            });*/
}       