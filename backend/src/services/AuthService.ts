import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export interface User {
    id: number;
    username: string;
    email: string;
    password: string;
    role: 'admin' | 'user';
    created_at: string;
}

export interface LoginRequest {
    username: string;
    password: string;
}

export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
}

export interface AuthResponse {
    user: Omit<User, 'password'>;
    token: string;
}

export class AuthService {
    private users: User[] = [];
    private nextId = 1;

    constructor() {
        // Create default admin user
        this.createDefaultAdmin();
    }

    private async createDefaultAdmin() {
        const hashedPassword = await bcrypt.hash('admin123', 10);
        this.users.push({
            id: this.nextId++,
            username: 'admin',
            email: 'admin@shopapp.com',
            password: hashedPassword,
            role: 'admin',
            created_at: new Date().toISOString()
        });
    }

    async login(loginData: LoginRequest): Promise<AuthResponse> {
        const user = this.users.find(u => u.username === loginData.username);

        if (!user || !await bcrypt.compare(loginData.password, user.password)) {
            throw new Error('Invalid credentials');
        }

        const token = jwt.sign(
            { userId: user.id, username: user.username, role: user.role },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        const { password, ...userWithoutPassword } = user;
        return { user: userWithoutPassword, token };
    }

    async register(registerData: RegisterRequest): Promise<AuthResponse> {
        // Check if user already exists
        const existingUser = this.users.find(u => 
            u.username === registerData.username || u.email === registerData.email
        );
        
        if (existingUser) {
            throw new Error('User already exists');
        }

        const hashedPassword = await bcrypt.hash(registerData.password, 10);
        
        const newUser: User = {
            id: this.nextId++,
            username: registerData.username,
            email: registerData.email,
            password: hashedPassword,
            role: 'user',
            created_at: new Date().toISOString()
        };

        this.users.push(newUser);
        
        const token = jwt.sign(
            { userId: newUser.id, username: newUser.username, role: newUser.role },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        const { password, ...userWithoutPassword } = newUser;
        return { user: userWithoutPassword, token };
    }

    verifyToken(token: string): any {
        return jwt.verify(token, JWT_SECRET);
    }
}