var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');


var userSchema = mongoose.Schema({

    acc            : {
        username     : String,
        password     : String
    },
});

// hash generation
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}

// check if pass. is ok
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.acc.password);
}

// export the model
module.exports = mongoose.model('User', userSchema);