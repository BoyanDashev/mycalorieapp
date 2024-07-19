const router = require("express").Router();
let User = require("../modules/module.js");

// router.route("/").get((req, res) => {
//   // Example.find()
//   //   .then((examples) => res.json(examples))
//   //   .catch((err) => res.status(400).json("Error: " + err));
//   res.json({message: 'Hello world'})
// });

// Registration route
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = new User({ username, password });
    await user.save();
    res.status(201).json({ message: 'User created successfully', user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || !(await user.isValidPassword(password))) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    res.status(200).json({ message: 'Login successful', user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;