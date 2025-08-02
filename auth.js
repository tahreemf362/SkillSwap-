const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

function authenticateToken(req, res, next) {
  const token = req.headers['authorization'];

  if (!token) return res.status(401).json({ message: 'Access Denied' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid Token' });

    req.user = user;
    next();
  });
}

module.exports = authenticateToken;