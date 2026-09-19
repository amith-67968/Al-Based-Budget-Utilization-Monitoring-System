import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

export class AuthService {
  static async login(email: string, password: string): Promise<{ token: string; user: object }> {
    try {
      const user = await User.findOne({ email }).populate('departmentId');
      
      if (!user) {
        throw new Error('Invalid email or password');
      }

      if (user.status !== 'active') {
        throw new Error('User account is inactive');
      }

      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) {
        throw new Error('Invalid email or password');
      }

      const payload = {
        _id: user._id,
        email: user.email,
        role: user.role,
        departmentId: user.departmentId ? (user.departmentId as any)._id : null
      };

      const secret = process.env.JWT_SECRET || 'fallback_secret';
      const expiresIn = process.env.JWT_EXPIRES_IN || '1d';

      const token = jwt.sign(payload, secret, { expiresIn } as jwt.SignOptions);

      const userObject: any = user.toObject();
      delete userObject.passwordHash;

      return { token, user: userObject };
    } catch (error: any) {
      throw new Error(error.message || 'Login failed');
    }
  }

  static async getProfile(userId: string): Promise<object> {
    try {
      const user = await User.findById(userId).populate('departmentId');
      if (!user) {
        throw new Error('User not found');
      }

      const userObject: any = user.toObject();
      delete userObject.passwordHash;

      return userObject;
    } catch (error: any) {
      throw new Error(error.message || 'Error fetching profile');
    }
  }
}
