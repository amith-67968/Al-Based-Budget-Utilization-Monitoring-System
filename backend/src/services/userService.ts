import bcrypt from 'bcryptjs';
import { User } from '../models/User';

export class UserService {
  static async getAll(filters: { role?: string; status?: string; page?: number; limit?: number; search?: string }): Promise<{ users: any[]; total: number }> {
    try {
      const query: any = {};

      if (filters.role) query.role = filters.role;
      if (filters.status) query.status = filters.status;
      
      if (filters.search) {
        query.$or = [
          { name: { $regex: filters.search, $options: 'i' } },
          { email: { $regex: filters.search, $options: 'i' } }
        ];
      }

      const page = filters.page || 1;
      const limit = filters.limit || 10;
      const skip = (page - 1) * limit;

      const [users, total] = await Promise.all([
        User.find(query)
          .select('-passwordHash')
          .populate('departmentId', 'name')
          .skip(skip)
          .limit(limit)
          .sort({ createdAt: -1 }),
        User.countDocuments(query)
      ]);

      return { users, total };
    } catch (error: any) {
      throw new Error(error.message || 'Error fetching users');
    }
  }

  static async getById(id: string): Promise<object> {
    try {
      const user = await User.findById(id).select('-passwordHash').populate('departmentId');
      if (!user) throw new Error('User not found');
      return user.toObject();
    } catch (error: any) {
      throw new Error(error.message || 'Error fetching user');
    }
  }

  static async create(data: { name: string; email: string; password: string; role: string; departmentId?: string }): Promise<object> {
    try {
      const existingUser = await User.findOne({ email: data.email });
      if (existingUser) {
        throw new Error('Email already in use');
      }

      const passwordHash = await bcrypt.hash(data.password, 12);
      
      const user = new User({
        name: data.name,
        email: data.email,
        passwordHash,
        role: data.role,
        departmentId: data.departmentId || null
      });

      await user.save();
      
      const userObject: any = user.toObject();
      delete userObject.passwordHash;
      return userObject;
    } catch (error: any) {
      throw new Error(error.message || 'Error creating user');
    }
  }

  static async update(id: string, data: Partial<{ name: string; email: string; role: string; departmentId: string; status: string }>): Promise<object> {
    try {
      if (data.email) {
        const existingUser = await User.findOne({ email: data.email, _id: { $ne: id } });
        if (existingUser) {
          throw new Error('Email already in use by another account');
        }
      }

      const user = await User.findByIdAndUpdate(id, data, { new: true, runValidators: true }).select('-passwordHash');
      if (!user) throw new Error('User not found');
      
      return user.toObject();
    } catch (error: any) {
      throw new Error(error.message || 'Error updating user');
    }
  }

  static async updateStatus(id: string, status: string): Promise<object> {
    try {
      const user = await User.findByIdAndUpdate(id, { status }, { new: true }).select('-passwordHash');
      if (!user) throw new Error('User not found');
      return user.toObject();
    } catch (error: any) {
      throw new Error(error.message || 'Error updating user status');
    }
  }
}
