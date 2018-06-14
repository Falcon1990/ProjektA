var mongoose = require('mongoose');
var plugin = require('plugin');
var mongoose_csv = require('mongoose-csv');
var Schema = mongoose.Schema;

var surveySchema = new Schema({

    survey: {
    surveyname : String,
    submitID : Number,
    secret: {type : Number, csv : false},
    questions : [{type :Schema.Types.ObjectId, ref: 'Question' }]
    }
    
}, {strict: false});

var questionSchema =  new Schema({
    
    questions:{
    survey : [{type :Schema.Types.ObjectId, ref: 'Survey'}],
    description : String,
    answer : String
    }

}, {strict: false});

surveySchema.plugin(mongoose_csv);
questionSchema.plugin(mongoose_csv);

surveySchema.methods.whichSurvey = function(surveyname){
        return (surveyname == this.survey.surveyname);
     
}

surveySchema.methods.generateID = function(){
    return((Math.random() * 1000) + 1);
}

module.exports = mongoose.model('Question', questionSchema);
module.exports = mongoose.model('Survey', surveySchema);