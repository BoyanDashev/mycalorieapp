const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const exampleSchema = new Schema({
  name: { type: String, required: false },
});

const Example = mongoose.model("Example", exampleSchema);

module.exports = Example;
