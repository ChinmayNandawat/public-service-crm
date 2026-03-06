import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Temporary mock database for testing
const users: any[] = [];

export const tempRegister = async (req: Request, res: Response) => {
  try {
    const { fullName, email, phone, password, role } = req.body;

    // Validate input
    if (!fullName || !email || !phone || !password || !role) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    // Validate role
    const validRoles = ['citizen', 'officer', 'admin'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ error: 'Invalid role.' });
    }

    // Check if user already exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists.' });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = {
      id: users.length + 1,
      fullName,
      email,
      phone,
      password: hashedPassword,
      role,
      createdAt: new Date()
    };

    users.push(user);

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '1h' }
    );

    const userResponse = {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      createdAt: user.createdAt
    };

    res.status(201).json({
      message: 'User registered successfully.',
      token,
      user: userResponse
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

export const tempLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    // Find user
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '1h' }
    );

    const userResponse = {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      createdAt: user.createdAt
    };

    res.json({
      message: 'Login successful.',
      token,
      user: userResponse
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

export const tempGetMe = async (req: any, res: Response) => {
  try {
    const user = users.find(u => u.id === req.user.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const userResponse = {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      createdAt: user.createdAt
    };

    res.json({ user: userResponse });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};
