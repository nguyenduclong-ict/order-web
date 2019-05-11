const mongoose = require("../helpers/MyMongoose").mongoose;
const validator = require("../helpers/Validator");
var Schema = mongoose.Schema;
var schema = new Schema({
  title: String,
  content: String,
  type: String,
  created: Date
});

var Log = {};
Log = mongoose.model("Log", schema);
Log.methods = {};
schema.pre("save", next => {
  this.create = Date.now();
  next();
});

Log.methods.addLog = (title, content, type) => {
  let newLog = new Log({ title, content, type });
  newLog.save();
};

Log.methods.getLogs = (from, page, type, sort) => {
  from = Number(from);
  page = Number(page);
  sort = Number(sort);
  let query = validator.validateRemove({ type }, ["all", undefined]);
  let result = Log.find(query);
  if (from) result.skip(from);
  if (page) result.limit(page);
  if (sort) result.sort({ created: sort });
  return result.exec();
};

Log.methods.getLogById = (id) => {
  return Log.find({_id : id}).exec();
}


// export module
module.exports = Log;
