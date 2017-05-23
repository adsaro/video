var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var options = { discriminatorKey: 'type' }

var userSchema = mongoose.Schema({
  name: {type: String, required: true}, //name of the user
  lastName: {type: String, required: true}, //last name of the user
  password: Object, //object containing the user password
  email: {type: String, unique: true, required: true}, //user's email address
  creation: {type: Date, default: Date.now}, //account's creation date
}, options);

var teacherSchema = mongoose.Schema({
  administrator: {type: Boolean, default: false},
}, options);


var studentSchema = mongoose.Schema({
  grade: String, //student's grade
  connections: {type: [Date], default: []}, //all the connections of the studens TODO
  ips: {type: [String], default: []}, //all the ip address of the student TODO
}, options);

userSchema.statics.findByUsername = function(em, cb){
    return this.findOne({email: em}, cb);
};

userSchema.methods.compare = function(pass){
    return bcrypt.compareSync(pass, this.password.hash);
};

process.on('SIGINT', function(){
  mongoose.connection.close(function(){
    console.log('mongoose disconnection through app termination');
    process.exit(0);
  });
});

var User = mongoose.model('User', userSchema);
var Teacher = User.discriminator('Teacher', teacherSchema);
var Student = User.discriminator('Student', studentSchema);

module.exports = {User: User, Student: Student, Teacher: Teacher};
