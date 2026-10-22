const jwt = require('jsonwebtoken');

const generateToken = (id, role = 'student') => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET || 'super_secret_jwt_key_campus_connect_2026',
    {
      expiresIn: '30d',
    }
  );
};

module.exports = generateToken;
