var mongoose = require('mongoose');
var mongoose_csv = require('mongoose-csv');
schema.plugin(mongoose_csv);

var surveySchema = mongoose.Schema({

    survey            : {
        surveyname : String,
        submitID : Number,
        secret: {type : Number, csv : false},
        question     : [new Schema({
            description : String,
                answer : String
        })
        ]    
    },
}, {strict: false});

surveySchema.methods.whichSurvey = function(surveyname){
        return (surveyname == this.survey.surveyname);
     
}

surveySchema.methods.generateID = function(){
    return((Math.random() * 1000) + 1);
}

module.exports = mongoose.model('Survey', surveySchema);