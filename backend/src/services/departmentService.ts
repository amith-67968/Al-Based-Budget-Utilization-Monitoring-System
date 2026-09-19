import { Department } from '../models/Department';

export class DepartmentService {
  static async getAll(filters: { status?: string; search?: string }): Promise<any[]> {
    try {
      const query: any = {};

      if (filters.status) query.status = filters.status;
      
      if (filters.search) {
        query.name = { $regex: filters.search, $options: 'i' };
      }

      const departments = await Department.find(query)
        .populate('headUserId', 'name email')
        .sort({ name: 1 });

      return departments;
    } catch (error: any) {
      throw new Error(error.message || 'Error fetching departments');
    }
  }

  static async getById(id: string): Promise<object> {
    try {
      const department = await Department.findById(id).populate('headUserId', 'name email');
      if (!department) throw new Error('Department not found');
      return department.toObject();
    } catch (error: any) {
      throw new Error(error.message || 'Error fetching department');
    }
  }

  static async create(data: { name: string; description?: string; headUserId?: string }): Promise<object> {
    try {
      const existing = await Department.findOne({ name: data.name });
      if (existing) throw new Error('Department with this name already exists');

      const department = new Department(data);
      await department.save();
      return department.toObject();
    } catch (error: any) {
      throw new Error(error.message || 'Error creating department');
    }
  }

  static async update(id: string, data: Partial<{ name: string; description: string; headUserId: string; status: string }>): Promise<object> {
    try {
      if (data.name) {
        const existing = await Department.findOne({ name: data.name, _id: { $ne: id } });
        if (existing) throw new Error('Department with this name already exists');
      }

      const department = await Department.findByIdAndUpdate(id, data, { new: true, runValidators: true });
      if (!department) throw new Error('Department not found');
      return department.toObject();
    } catch (error: any) {
      throw new Error(error.message || 'Error updating department');
    }
  }
}
