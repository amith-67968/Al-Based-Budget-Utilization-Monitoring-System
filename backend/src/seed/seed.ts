import mongoose from 'mongoose';
import bcrypt from 'bcrypt'; // or bcryptjs depending on the project
import dotenv from 'dotenv';
import { connectDB } from '../config/database';

import { User } from '../models/User';
import { Department } from '../models/Department';
import { Budget } from '../models/Budget';
import { Expenditure } from '../models/Expenditure';
import { Alert } from '../models/Alert';
import { ThresholdRule } from '../models/ThresholdRule';
import { AuditLog } from '../models/AuditLog';

dotenv.config();

const seedDB = async () => {
  try {
    console.log('Connecting to database...');
    await connectDB();
    console.log('Database connected successfully.');

    console.log('Clearing existing data...');
    await Promise.all([
      User.deleteMany({}),
      Department.deleteMany({}),
      Budget.deleteMany({}),
      Expenditure.deleteMany({}),
      Alert.deleteMany({}),
      ThresholdRule.deleteMany({}),
      AuditLog.deleteMany({})
    ]);
    console.log('Previous data cleared.');

    const passwordHash = await bcrypt.hash('Password123!', 12);

    console.log('Seeding Departments...');
    const departmentNames = [
      'Public Works Department (PWD)',
      'Education Department',
      'Health & Family Welfare Department',
      'Transport Department',
      'Water Resources & Sanitation Department',
      'Rural Development Department',
      'Urban Development & Housing Department',
      'Agriculture & Farmers Welfare Department'
    ];

    const departmentsData = departmentNames.map(name => ({
      name,
      description: `Official ${name} of the Government`,
      status: 'active' as const
    }));

    const departments = await Department.insertMany(departmentsData);
    console.log(`${departments.length} departments seeded.`);

    console.log('Seeding Users...');
    const usersData = [
      // Admins
      { name: 'Amitabh Sharma', email: 'admin1@gov.in', passwordHash, role: 'admin' as const, status: 'active' as const },
      { name: 'Priya Patel', email: 'admin2@gov.in', passwordHash, role: 'admin' as const, status: 'active' as const },
      // Finance Officers
      { name: 'Rajesh Kumar', email: 'finance1@gov.in', passwordHash, role: 'finance_officer' as const, status: 'active' as const },
      { name: 'Sneha Gupta', email: 'finance2@gov.in', passwordHash, role: 'finance_officer' as const, status: 'active' as const },
      { name: 'Vikram Singh', email: 'finance3@gov.in', passwordHash, role: 'finance_officer' as const, status: 'active' as const },
    ];

    // Department Heads
    const headNames = [
      'Suresh Desai', 'Anita Reddy', 'Manoj Tiwari', 'Kavita Iyer',
      'Ramesh Nair', 'Pooja Joshi', 'Deepak Verma', 'Meera Menon'
    ];

    departments.forEach((dept, index) => {
      usersData.push({
        name: headNames[index],
        email: `head.${dept.name.split(' ')[0].toLowerCase()}@gov.in`,
        passwordHash,
        role: 'department_head' as const,
        departmentId: dept._id as any,
        status: 'active' as const
      });
    });

    // Staff (additional dept heads for demo purposes, or just staff with dept head role)
    usersData.push(
      { name: 'Rahul Choudhary', email: 'staff1.pwd@gov.in', passwordHash, role: 'department_head' as const, departmentId: departments[0]._id as any, status: 'active' as const },
      { name: 'Neha Sharma', email: 'staff2.edu@gov.in', passwordHash, role: 'department_head' as const, departmentId: departments[1]._id as any, status: 'active' as const }
    );

    const users = await User.insertMany(usersData);
    console.log(`${users.length} users seeded.`);

    // Update departments with headUserId
    for (let i = 0; i < departments.length; i++) {
      const headUser = users.find(u => u.email === `head.${departments[i].name.split(' ')[0].toLowerCase()}@gov.in`);
      if (headUser) {
        await Department.findByIdAndUpdate(departments[i]._id, { headUserId: headUser._id });
      }
    }

    const adminUser = users.find(u => u.role === 'admin')!;
    const financeUser = users.find(u => u.role === 'finance_officer')!;

    console.log('Seeding Budgets & Expenditures...');
    const projectNames = [
      "National Highway Expansion Phase-III", "Pradhan Mantri Gram Sadak Yojana",
      "Mid-Day Meal Scheme 2025-26", "Swachh Bharat Mission - Rural",
      "Ayushman Bharat Health Infrastructure", "Smart Cities Mission",
      "PM-KISAN Direct Benefit Transfer", "Jal Jeevan Mission",
      "Digital India Initiative", "Make in India Subsidies",
      "National Rural Employment Guarantee", "Urban Metro Rail Project",
      "Agricultural Irrigation Expansion", "Women Empowerment Scheme",
      "Youth Skill Development Program", "State Transport Fleet Modernization"
    ];

    const financialYears = ['2024-25', '2025-26'];
    const statuses = ['active', 'closed', 'exceeded', 'draft'] as const;
    const categories = ['salaries', 'infrastructure', 'equipment', 'supplies', 'travel', 'maintenance', 'consulting', 'training', 'utilities', 'miscellaneous'] as const;

    const budgetsData = [];
    const expendituresData = [];

    // Create 30+ budgets
    for (let i = 0; i < 35; i++) {
      const department = departments[i % departments.length];
      const deptHead = users.find(u => u.departmentId?.toString() === department._id.toString()) || adminUser;
      const allocatedAmount = Math.floor(Math.random() * (100000000 - 5000000 + 1) + 5000000); // 50 lakhs to 10 crores
      const financialYear = financialYears[Math.floor(Math.random() * financialYears.length)];
      
      let status = statuses[Math.floor(Math.random() * statuses.length)];
      if (financialYear === '2024-25' && status === 'active') status = 'closed';

      const budgetId = new mongoose.Types.ObjectId();
      
      let totalSpent = 0;
      const numExpenditures = Math.floor(Math.random() * 7) + 4; // 4 to 10
      
      const isExceeded = status === 'exceeded';
      const maxSpend = isExceeded ? allocatedAmount * 1.2 : allocatedAmount * 0.9;
      
      // Generate expenditures for this budget
      for (let j = 0; j < numExpenditures; j++) {
        const amountSpent = Math.floor(Math.random() * (maxSpend / numExpenditures));
        totalSpent += amountSpent;
        
        const date = new Date();
        date.setMonth(date.getMonth() - Math.floor(Math.random() * 6));
        
        expendituresData.push({
          budgetId,
          departmentId: department._id,
          amountSpent,
          expenseCategory: categories[Math.floor(Math.random() * categories.length)],
          date,
          description: `Payment for ${categories[Math.floor(Math.random() * categories.length)]} - ${projectNames[i % projectNames.length]}`,
          recordedBy: deptHead._id
        });
      }

      budgetsData.push({
        _id: budgetId,
        financialYear,
        departmentId: department._id,
        projectName: `${projectNames[i % projectNames.length]} - Part ${Math.floor(i / projectNames.length) + 1}`,
        allocatedAmount,
        totalSpent,
        allocationDate: new Date('2024-04-01'),
        startDate: new Date('2024-04-01'),
        endDate: new Date('2025-03-31'),
        status,
        createdBy: adminUser._id
      });
    }

    const budgets = await Budget.insertMany(budgetsData);
    const expenditures = await Expenditure.insertMany(expendituresData);
    console.log(`${budgets.length} budgets and ${expenditures.length} expenditures seeded.`);

    console.log('Seeding Threshold Rules...');
    const rulesData = [
      { ruleType: 'OVERSPENDING' as const, value: 90, description: 'Alert when spending exceeds 90% of allocated budget', enabled: true, createdBy: adminUser._id },
      { ruleType: 'OVERSPENDING' as const, value: 100, description: 'Alert when spending exceeds 100% of allocated budget', enabled: true, createdBy: adminUser._id },
      { ruleType: 'UNDER_UTILIZATION' as const, value: 20, description: 'Alert when less than 20% utilized by Q3', enabled: true, createdBy: adminUser._id },
      { ruleType: 'SPENDING_SPIKE' as const, value: 30, description: 'Alert on sudden 30% jump in monthly spending', enabled: true, createdBy: adminUser._id },
      { ruleType: 'MAX_UTILIZATION' as const, value: 95, description: 'Critical limit at 95% utilization', enabled: true, createdBy: adminUser._id },
      { ruleType: 'EXPENDITURE_LIMIT' as const, value: 5000000, description: 'Alert on any single expenditure above 50 Lakhs', enabled: true, createdBy: adminUser._id },
      { ruleType: 'SPENDING_SPIKE' as const, value: 50, description: 'Alert on 50% jump in weekly spending', enabled: false, createdBy: adminUser._id },
      { ruleType: 'UNDER_UTILIZATION' as const, value: 10, description: 'Alert when less than 10% utilized by Q2', enabled: true, createdBy: adminUser._id }
    ];
    await ThresholdRule.insertMany(rulesData);
    console.log(`${rulesData.length} threshold rules seeded.`);

    console.log('Seeding Alerts...');
    const alertTypes = ['UNDER_UTILIZATION', 'OVERSPENDING', 'SPENDING_SPIKE', 'THRESHOLD_BREACH'] as const;
    const severities = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as const;
    const alertStatuses = ['OPEN', 'REVIEWED', 'RESOLVED'] as const;
    
    const alertsData = [];
    for (let i = 0; i < 20; i++) {
      const budget = budgets[Math.floor(Math.random() * budgets.length)];
      const status = alertStatuses[Math.floor(Math.random() * alertStatuses.length)];
      
      alertsData.push({
        budgetId: budget._id,
        departmentId: budget.departmentId,
        alertType: alertTypes[Math.floor(Math.random() * alertTypes.length)],
        severity: severities[Math.floor(Math.random() * severities.length)],
        message: `System detected potential budget anomaly for project: ${budget.projectName}`,
        triggeredValue: Math.floor(Math.random() * 100),
        thresholdValue: 80,
        status,
        reviewedBy: status !== 'OPEN' ? financeUser._id : undefined,
        reviewedAt: status !== 'OPEN' ? new Date() : undefined
      });
    }
    await Alert.insertMany(alertsData);
    console.log(`${alertsData.length} alerts seeded.`);

    console.log('Seeding Audit Logs...');
    const auditActions = ['LOGIN', 'CREATE', 'UPDATE', 'DELETE'];
    const entityTypes = ['budget', 'expenditure', 'user', 'department', 'alert', 'threshold_rule', 'auth'] as const;
    
    const auditLogsData = [];
    for (let i = 0; i < 30; i++) {
      const user = users[Math.floor(Math.random() * users.length)];
      const action = auditActions[Math.floor(Math.random() * auditActions.length)];
      const entityType = entityTypes[Math.floor(Math.random() * entityTypes.length)];
      
      auditLogsData.push({
        userId: user._id,
        action,
        entityType,
        entityId: new mongoose.Types.ObjectId().toString(),
        ipAddress: '192.168.1.' + Math.floor(Math.random() * 255),
        previousValue: action === 'UPDATE' ? { status: 'draft' } : undefined,
        newValue: action === 'UPDATE' ? { status: 'active' } : undefined
      });
    }
    
    await AuditLog.insertMany(auditLogsData).catch(err => console.log('Non-critical audit log error:', err.message));
    console.log(`${auditLogsData.length} audit logs seeded.`);

    console.log('\n=============================================');
    console.log('SEEDING COMPLETE!');
    console.log('=============================================');
    console.log('Demo Credentials (Password: Password123!):');
    console.log(`Admin: admin1@gov.in`);
    console.log(`Finance Officer: finance1@gov.in`);
    console.log(`Department Head (PWD): head.public@gov.in`);
    console.log('=============================================\n');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDB();
