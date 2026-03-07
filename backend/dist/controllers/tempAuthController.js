"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tempGetMe = exports.tempLogin = exports.tempRegister = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// Use the same persistent storage as complaintController
const USERS_FILE = path_1.default.join(__dirname, '../../data/users.json');
// Load users from file
let users = [];
try {
    if (fs_1.default.existsSync(USERS_FILE)) {
        users = JSON.parse(fs_1.default.readFileSync(USERS_FILE, 'utf8'));
    }
}
catch (error) {
    console.log('Starting with empty users array in tempAuth');
}
const saveUsers = () => {
    try {
        fs_1.default.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
    }
    catch (error) {
        console.error('Error saving users:', error);
    }
};
const tempRegister = async (req, res) => {
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
        const hashedPassword = await bcryptjs_1.default.hash(password, saltRounds);
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
        saveUsers(); // Save to file
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
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
    }
    catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
};
exports.tempRegister = tempRegister;
const tempLogin = async (req, res) => {
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
        // Verify password - handle both bcrypt and plain text for testing
        let isValidPassword = false;
        if (user.password.startsWith('$2a$') || user.password.startsWith('$2b$')) {
            // Hashed password - use bcrypt
            isValidPassword = await bcryptjs_1.default.compare(password, user.password);
        }
        else {
            // Plain text password - direct comparison
            isValidPassword = password === user.password;
        }
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid credentials.' });
        }
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
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
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
};
exports.tempLogin = tempLogin;
const tempGetMe = async (req, res) => {
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
    }
    catch (error) {
        console.error('Get me error:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
};
exports.tempGetMe = tempGetMe;
//# sourceMappingURL=tempAuthController.js.map