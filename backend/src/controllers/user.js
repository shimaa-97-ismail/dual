import { userModel } from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendEmail } from "../utils/email.js";

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );
};

export const getUser = async (req, res) => {
  try {
    const users = await userModel.find().select('-password');
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

export const createUser = async (req, res) => {
  const { username, password, role, email } = req.body;
   const assignedRole = req.user.role === 'admin' ? role : 'supervisor';
  const newUser = new userModel({ username, password, role:assignedRole, email });
  try {
    await newUser.save();
    const { password: _, ...userWithoutPassword } = newUser.toObject();
    res.status(201).json({ success: true, data: userWithoutPassword });
  } catch (error) {
    res.status(409).json({ success: false, message: error.message });
  }
};
export const updateUser = async (req, res) => {
  // console.log(req.params,req.body);
  
  const { id } = req.params;
  const  { username, email, role }  = req.body;
  try {
      const user = await userModel.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'المستخدم غير موجود' });
    }
      if (username) user.username = username;
    if (email) user.email = email;
     if (role && req.user.role === 'admin') user.role = role;
  //  console.log(user);
   
    const updatedUser = await user.save();
    console.log(updatedUser);
    
    const { password: _, ...userWithoutPassword } = updatedUser.toObject();
    console.log(userWithoutPassword);
    
    res.status(200).json({ success: true, data: userWithoutPassword });
  } catch (error) {
    console.log(error);
    
    res.status(409).json({ success: false, message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
     const deletedUser = await userModel.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ success: false, message: 'المستخدم غير موجود' });
    }
    res.status(200).json({ success: true, data: id });
  } catch (error) {
    res.status(409).json({ success: false, message: error.message });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body.data;
  try {
    const user = await userModel.findOne({ email });
    if (!user) {   
      return res.status(404).json({ message: "المستخدم غير موجود" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log(isPasswordValid);
    
    if (!isPasswordValid) {
      // console.log("invalid password");
      return res
        .status(401)
        .json({ message: "البريد الإلكتروني أو كلمة المرور غير صحيحة" });
    }
    // console.log("successful");
    const token = generateToken(user);
    res.status(200).json({ success: true, data: user, token: token });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMe = async (req, res) => {
  res.json({ user: req.user });

  // const userId = req.user.id;
  // try {
  //     const user = await userModel.findById(userId).select("-password");
  //     if (!user) {
  //         return res.status(404).json({ message: "User not found" });
  //     }
  //     res.status(200).json({ user });
  // } catch (error) {
  //     res.status(500).json({ message: error.message });
  // }
};

export const logoutUser = async (req, res) => {
  // Since JWT is stateless, we can't truly "log out" on the server side.
  // However, we can instruct the client to delete the token.
  res.status(200).json({ success: true, message: "Logged out successfully" });
};

export const forgetPassword = async (req, res) => {
  const { email } = req.body;
  
  
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "إذا كان البريد الإلكتروني مسجلاً، ستتلقى رابط إعادة التعيين.",
      });
    }

    const payload = {
      email: user.email,
    //   iat: Math.floor(Date.now() / 1000), // تاريخ الإصدار بالمللي ثانية
    };
     const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5m' });
     console.log("Generated token:", token);
     
    const resetLink = `${process.env.CLIENT_URL}reset-password?token=${token}`;
    await sendEmail(
      email,
      "إعادة تعيين كلمة المرور",
      `اضغط على الرابط التالي لإعادة تعيين كلمة المرور الخاصة بك:\n${resetLink}\n\nالرابط صالح لمدة خمس دقايق.`,
    );

    res.json({
      message: "إذا كان البريد الإلكتروني مسجلاً، ستتلقى رابط إعادة التعيين.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "حدث خطأ، حاول مرة أخرى." });
  }
};

export const verifyResetToken = async (req, res) => {
  const { token } = req.body;

  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findOne({ email: decoded.email });
    console.log(user,decoded);
    
    if (!user) {
      return res.status(404).json({ message: "المستخدم غير موجود" });
    }

    if (user.passwordChangedAt) {
      const tokenIssuedAt = decoded.iat; // تاريخ الإصدار بالمللي ثانية
      const passwordChangedAt = user.passwordChangedAt.getTime(); // تحويل التاريخ إلى مللي ثانية
      // if (tokenIssuedAt < passwordChangedAt) {
      //   return res
      //     .status(400)
      //     .json({ message: "الرمز غير صالح (تم تغيير كلمة المرور مسبقاً)." });
      // }
    }
    res.json({ valid: true, email: user.email });
  } catch (error) {
    console.log(error);
    
    if (error.name === "TokenExpiredError") {
      return res.status(400).json({ message: "انتهت صلاحية الرمز." });
    } else if (error.name === "JsonWebTokenError") {

      return res.status(400).json({ message: "الرمز غير صالح." });
    }
    res.status(500).json({ message: "خطأ في الخادم." });
  }
};


export const resetPassword = async (req, res) => {
  const { token, password,confirmPassword } = req.body;
  console.log(req.body);
  

    if(password !== confirmPassword){
        return res.status(400).json({ message: "كلمتا المرور غير متطابقتين." });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findOne({ email: decoded.email });
        if (!user) {
            return res.status(404).json({ message: "المستخدم غير موجود" });
        }
         if (user.passwordChangedAt) {
      const tokenIssuedAt = decoded.iat;
      const passwordChangedAt = user.passwordChangedAt.getTime();
      // if (tokenIssuedAt < passwordChangedAt) {
      //   return res.status(400).json({ message: 'الرمز غير صالح (تم تغيير كلمة المرور مسبقاً).' });
      // }
    }
    //  const hashedPassword = await bcrypt.hash(password, 10);

    // تحديث كلمة المرور وتعيين passwordChangedAt إلى الوقت الحالي
    user.password = password;
    user.passwordChangedAt = new Date();
    await user.save();
     await sendEmail(
      user.email,
      'تم تغيير كلمة المرور',
      'تم تغيير كلمة المرور لحسابك بنجاح. إذا لم تكن قمت بهذا الإجراء، تواصل مع الدعم فوراً.'
    );

    res.json({ message: 'تم تحديث كلمة المرور بنجاح. يمكنك تسجيل الدخول الآن.' });
  } catch (error) {
    console.log(error);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(400).json({ message: 'انتهت صلاحية الرمز.' });
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(400).json({ message: 'الرمز غير صالح.' });
    }
    res.status(500).json({ message: 'خطأ في الخادم.' });
  }
};