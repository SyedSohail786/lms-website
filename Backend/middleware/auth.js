const jwt = require('jsonwebtoken');

const auth = (roles = []) => (req, res, next) => {
  const token = req.cookies.sToken || req.cookies.aToken ||
               (req.headers.authorization?.startsWith('Bearer') 
                ? req.headers.authorization.split(' ')[1] 
                : null);

  if (!token) return res.status(401).json({ message: 'Authentication required' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (roles.length && !roles.includes(decoded.role)) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }
    
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = auth;