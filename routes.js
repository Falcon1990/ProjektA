var Survey = require('./models/survey');

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

        app.post('/search', function(req, res) {
            var searchValue = req.body['SurveyName'];
            
                if(err) {
                    return done(null, false, req.flash('searchMessage', 'No such Survey found found.'));
                }

                else {
                    res.redirect(__dirname + '/views/' + searchValue);
                }
        });

        app.post('/submit', passport.authenticate('submit'));

        app.get('/export', passport.authenticate('export'));

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