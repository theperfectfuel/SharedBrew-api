const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

mongoose.Promise = global.Promise;

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    googleId: {
        type: String
    },
    createdDate: {
        type: Date,
        default: Date.now
    }
});

UserSchema.methods.serialize = function() {
    return {
      username: this.username || '',
      firstName: this.firstName || '',
      lastName: this.lastName || ''
    };
  };
  
  UserSchema.methods.validatePassword = function(password) {
    return bcrypt.compare(password, this.password);
  };
  
  UserSchema.statics.hashPassword = function(password) {
    return bcrypt.hash(password, 10);
  };

module.exports = mongoose.model('User', UserSchema);