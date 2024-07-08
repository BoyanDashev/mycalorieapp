const router = require("express").Router();
let Example = require("../modules/module.js");

router.route("/").get((req, res) => {
  Example.find()
    .then((examples) => res.json(examples))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/add").post((req, res) => {
  const newExample = new Example({ name: req.body.name });
  newExample
    .save()
    .then(() => res.json("Example added!"))
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;
