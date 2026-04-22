import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';

const SALT_ROUNDS = 10;

const generateToken = (userId, displayName, role) => {
  return jwt.sign(
    { userId, displayName, role },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
};

const generateRefreshToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );
};

const checkUserExist = async (email) => {
  return await User.findOne({ email });
};

const generatePassword = async (password) => {
  return await bcrypt.hash(password, SALT_ROUNDS);
};

async function register(req, res, next) {
  try {
    const { displayName, email, password, role } = req.body;
    const userExist = await checkUserExist(email);
    if (userExist) {
      return res.status(400).json({ message: "User already exist" });
    }
    const userRole = role || "customer";
    const hashPassword = await generatePassword(password);
    const newUser = new User({
      displayName,
      email,
      hashPassword,
      role: userRole,
    });
    await newUser.save();
    res.status(201).json({ 
      message: "User created successfully",
      user: {
        displayName,
        email,
        role: userRole
      }
    });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const userExist = await User.findOne({ email });

    if (!userExist) {
      return res.status(400).json({ message: 'User does not exist.' });
    }

    const isMatch = await bcrypt.compare(password, userExist.hashPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(userExist._id, userExist.displayName, userExist.role);
    const refreshToken = generateRefreshToken(userExist._id);

    res.status(200).json({ 
      token, 
      refreshToken, 
      user: {
        _id: userExist._id,
        displayName: userExist.displayName,
        email: userExist.email,
        role: userExist.role
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
    next(error);
  }
}

async function refresh(req, res, next) {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ message: 'Refresh token is required' });
    }

    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      const user = await User.findById(decoded.userId);
      
      if (!user) {
        return res.status(403).json({ message: 'User not found' });
      }

      const newToken = generateToken(user._id, user.displayName, user.role);
      res.status(200).json({ token: newToken });
    } catch (err) {
      return res.status(403).json({ message: 'Invalid Refresh Token' });
    }
  } catch (error) {
    next(error);
  }
}

export { register, login, refresh };
