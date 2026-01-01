const jwt = require('jsonwebtoken');

// Generate access token
exports.generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
  });
};

// Generate refresh token
exports.generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  });
};

// Verify token
exports.verifyToken = (token, secret) => {
  return jwt.verify(token, secret);
};

// Generate both tokens
exports.generateTokens = (userId) => {
  return {
    token: exports.generateAccessToken(userId),
    refreshToken: exports.generateRefreshToken(userId),
  };
};