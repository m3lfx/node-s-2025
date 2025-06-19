const connection = require('../config/database');
const bcrypt = require('bcrypt')

const registerUser = async (req, res) => {
  // {
  //   "name": "steve",
  //   "email": "steve@gmail.com",
  //   "password": "password"
  // }
  const { name, password, email, } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const userSql = 'INSERT INTO users (name, password, email) VALUES (?, ?, ?)';
  try {
    connection.execute(userSql, [name, hashedPassword, email], (err, result) => {
      if (err instanceof Error) {
        console.log(err);

        return res.status(401).json({
          error: err
        });
      }

      return res.status(200).json({
        success: true,
        result
      })
    });
  } catch (error) {
    console.log(error)
  }

};

const loginUser =  (req, res) => {
  const { email, password } = req.body;
  const sql = 'SELECT id, name, email, password FROM users WHERE email = ? AND deleted_at IS NULL';
  connection.execute(sql, [email], async (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: 'Error logging in', details: err });
    }
    if (results.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const user = results[0];
    
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // Remove password from response
    delete user.password;

    return res.status(200).json({
      success: "welcome back",
      user: results[0]
    });
  });
};

module.exports = { registerUser, loginUser };