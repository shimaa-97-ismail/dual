// middleware/auth.js
import jwt from 'jsonwebtoken';
import { userModel } from '../models/user.js';

export const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return res.status(401).json({ message: 'غير مصرح به، يرجى تسجيل الدخول' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'المستخدم غير موجود' });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'رمز غير صالح أو منتهي' });
  }
};

// Role-based access control
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `ليس لديك صلاحية. الدور المطلوب: ${roles.join(' أو ')}`,
      });
    }
    next();
  };
};