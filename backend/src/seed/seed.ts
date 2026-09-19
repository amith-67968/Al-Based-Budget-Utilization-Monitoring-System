import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { connectDB } from '../config/database';
import { User } from '../models/User';
import { Department } from '../models/Department';
import { Budget } from '../models/Budget';
import { Expenditure } from '../models/Expenditure';
import { Alert } from '../models/Alert';
import { ThresholdRule } from '../models/ThresholdRule';
import { AuditLog } from '../models/AuditLog';

const seedDatabase = async () => {
  try {
    console.log('Connecting to database...');
    await connectDB();

    console.log('Clearing existing collections...');
    await Department.deleteMany({});
    await User.deleteMany({});
    await Budget.deleteMany({});
    await Expenditure.deleteMany({});
    await Alert.deleteMany({});
    await ThresholdRule.deleteMany({});
    await AuditLog.deleteMany({});

    console.log('Database cleared.');

    // --- DEPARTMENTS ---
    console.log('Seeding departments...');
    const deptsData = [
      { name: 'Public Works Department', description: 'Infrastructure development and maintenance', code: 'PWD' },
      { name: 'Education Department', description: 'Educational institutions and programs', code: 'EDU' },
      { name: 'Health Department', description: 'Healthcare services and public health', code: 'HLT' },
      { name: 'Transport Department', description: 'Transportation infrastructure and services', code: 'TRP' },
      { name: 'Water & Sanitation Department', description: 'Water supply and sanitation services', code: 'WAS' },
      { name: 'Rural Development Department', description: 'Rural infrastructure and livelihood programs', code: 'RUD' }
    ];
    
    const createdDepartments = await Department.insertMany(deptsData);
    const getDeptId = (name: string) => createdDepartments.find(d => d.name.startsWith(name))?._id;

    // --- USERS ---
    console.log('Seeding users...');
    const hashedPassword = await bcrypt.hash('Password123!', 12);
    
    const usersData = [
      { firstName: 'Admin', lastName: 'User', email: 'admin@budgetmonitor.gov.in', password: hashedPassword, role: 'admin' },
      { firstName: 'Finance', lastName: 'Officer 1', email: 'finance1@budgetmonitor.gov.in', password: hashedPassword, role: 'finance_officer' },
      { firstName: 'Finance', lastName: 'Officer 2', email: 'finance2@budgetmonitor.gov.in', password: hashedPassword, role: 'finance_officer' },
      { firstName: 'PWD', lastName: 'Head', email: 'head.publicworks@budgetmonitor.gov.in', password: hashedPassword, role: 'department_head', departmentId: getDeptId('Public Works') },
      { firstName: 'EDU', lastName: 'Head', email: 'head.education@budgetmonitor.gov.in', password: hashedPassword, role: 'department_head', departmentId: getDeptId('Education') },
      { firstName: 'HLT', lastName: 'Head', email: 'head.health@budgetmonitor.gov.in', password: hashedPassword, role: 'department_head', departmentId: getDeptId('Health') },
      { firstName: 'TRP', lastName: 'Head', email: 'head.transport@budgetmonitor.gov.in', password: hashedPassword, role: 'department_head', departmentId: getDeptId('Transport') },
      { firstName: 'WAS', lastName: 'Head', email: 'head.water@budgetmonitor.gov.in', password: hashedPassword, role: 'department_head', departmentId: getDeptId('Water & Sanitation') }
    ];

    const createdUsers = await User.insertMany(usersData);
    const adminUser = createdUsers.find(u => u.role === 'admin');
    const financeOfficer = createdUsers.find(u => u.role === 'finance_officer');
    
    // Update departments with headUserId
    for (const user of createdUsers) {
      if (user.role === 'department_head' && user.departmentId) {
        await Department.findByIdAndUpdate(user.departmentId, { headUserId: user._id });
      }
    }

    // --- BUDGETS ---
    console.log('Seeding budgets...');
    
    // Helper dates
    const start25 = new Date('2025-04-01');
    const end25 = new Date('2026-03-31');
    const start24 = new Date('2024-04-01');
    const end24 = new Date('2025-03-31');
    
    const budgetsData = [
      // FY 2025-26
      { name: 'Road Infrastructure', category: 'Infrastructure', allocatedAmount: 4500000, startDate: start25, endDate: end25, status: 'active', departmentId: getDeptId('Public Works'), createdBy: financeOfficer?._id, fiscalYear: '2025-2026' },
      { name: 'Building Maintenance', category: 'Maintenance', allocatedAmount: 1800000, startDate: start25, endDate: end25, status: 'active', departmentId: getDeptId('Public Works'), createdBy: financeOfficer?._id, fiscalYear: '2025-2026' },
      { name: 'School Development', category: 'Infrastructure', allocatedAmount: 3200000, startDate: start25, endDate: end25, status: 'active', departmentId: getDeptId('Education'), createdBy: financeOfficer?._id, fiscalYear: '2025-2026' },
      { name: 'Teacher Training', category: 'Training', allocatedAmount: 1200000, startDate: start25, endDate: end25, status: 'active', departmentId: getDeptId('Education'), createdBy: financeOfficer?._id, fiscalYear: '2025-2026' },
      { name: 'Primary Healthcare', category: 'Healthcare', allocatedAmount: 3800000, startDate: start25, endDate: end25, status: 'active', departmentId: getDeptId('Health'), createdBy: financeOfficer?._id, fiscalYear: '2025-2026' },
      { name: 'Medical Equipment', category: 'Equipment', allocatedAmount: 2200000, startDate: start25, endDate: end25, status: 'active', departmentId: getDeptId('Health'), createdBy: financeOfficer?._id, fiscalYear: '2025-2026' },
      { name: 'Road Safety', category: 'Safety', allocatedAmount: 1500000, startDate: start25, endDate: end25, status: 'active', departmentId: getDeptId('Transport'), createdBy: financeOfficer?._id, fiscalYear: '2025-2026' },
      { name: 'Water Supply', category: 'Infrastructure', allocatedAmount: 2800000, startDate: start25, endDate: end25, status: 'active', departmentId: getDeptId('Water & Sanitation'), createdBy: financeOfficer?._id, fiscalYear: '2025-2026' },
      { name: 'Village Roads', category: 'Infrastructure', allocatedAmount: 2000000, startDate: start25, endDate: end25, status: 'active', departmentId: getDeptId('Rural Development'), createdBy: financeOfficer?._id, fiscalYear: '2025-2026' },
      
      // FY 2024-25
      { name: 'Bridge Construction', category: 'Infrastructure', allocatedAmount: 5500000, startDate: start24, endDate: end24, status: 'closed', departmentId: getDeptId('Public Works'), createdBy: financeOfficer?._id, fiscalYear: '2024-2025' },
      { name: 'Digital Classroom', category: 'Infrastructure', allocatedAmount: 1500000, startDate: start24, endDate: end24, status: 'closed', departmentId: getDeptId('Education'), createdBy: financeOfficer?._id, fiscalYear: '2024-2025' },
      { name: 'Vaccination Drive', category: 'Healthcare', allocatedAmount: 2500000, startDate: start24, endDate: end24, status: 'closed', departmentId: getDeptId('Health'), createdBy: financeOfficer?._id, fiscalYear: '2024-2025' }
    ];

    const createdBudgets = await Budget.insertMany(budgetsData);
    const getBudgetId = (name: string) => createdBudgets.find(b => b.name === name)?._id;
    const getBudget = (name: string) => createdBudgets.find(b => b.name === name);

    // --- EXPENDITURES ---
    console.log('Seeding expenditures...');
    
    // Anchor date: September 19, 2025
    const anchorDate = new Date('2025-09-19T10:00:00Z');
    
    const generateExpenditures = (budgetName: string, amounts: number[], dates: Date[], descriptions: string[], category: string) => {
      const budget = getBudget(budgetName);
      if (!budget) return [];
      return amounts.map((amount, i) => ({
        budgetId: budget._id,
        departmentId: budget.departmentId,
        amount,
        date: dates[i] || anchorDate,
        description: descriptions[i] || 'General expenditure',
        category,
        createdBy: financeOfficer?._id,
        status: 'approved'
      }));
    };

    let allExpenditures: any[] = [];

    // 1. Normal spending (Public Works - Road Infrastructure) ~20,00,000
    allExpenditures.push(...generateExpenditures('Road Infrastructure',
      [250000, 300000, 200000, 450000, 150000, 350000, 100000, 200000],
      [new Date('2025-04-15'), new Date('2025-05-10'), new Date('2025-05-25'), new Date('2025-06-20'), new Date('2025-07-05'), new Date('2025-08-12'), new Date('2025-09-01'), new Date('2025-09-15')],
      ['Road resurfacing - NH44 section', 'Concrete supply for bridge deck', 'Consulting fees', 'Heavy machinery rental', 'Worker salaries - May', 'Asphalt procurement', 'Worker salaries - June', 'Site inspection and testing'],
      'Infrastructure'
    ));

    // 2. Under-utilization (Education - Teacher Training) ~1,50,000
    allExpenditures.push(...generateExpenditures('Teacher Training',
      [50000, 100000],
      [new Date('2025-05-15'), new Date('2025-08-20')],
      ['Initial workshop materials', 'Guest speaker honorarium'],
      'Training'
    ));

    // 3. Overspending (Health - Medical Equipment) ~24,00,000 (Budget is 22L)
    allExpenditures.push(...generateExpenditures('Medical Equipment',
      [400000, 500000, 350000, 450000, 300000, 400000],
      [new Date('2025-04-20'), new Date('2025-05-18'), new Date('2025-06-15'), new Date('2025-07-22'), new Date('2025-08-10'), new Date('2025-09-05')],
      ['X-Ray machine advance', 'Ventilators procurement', 'Surgical tools', 'X-Ray machine final payment', 'Patient monitors', 'Defibrillators'],
      'Equipment'
    ));

    // 4. Spending spike scenario (Transport - Road Safety)
    allExpenditures.push(...generateExpenditures('Road Safety',
      [50000, 75000, 60000, 250000, 300000],
      [new Date('2025-04-10'), new Date('2025-05-20'), new Date('2025-07-15'), new Date('2025-09-12'), new Date('2025-09-16')], // Spike in Sept
      ['Safety awareness campaign', 'Signage boards', 'Reflector installation', 'Major highway CCTV installation', 'Speed radar procurement'],
      'Safety'
    ));

    // 5. Normal well-utilized (Water & Sanitation - Water Supply) ~16,00,000
    allExpenditures.push(...generateExpenditures('Water Supply',
      [200000, 300000, 250000, 400000, 250000, 200000],
      [new Date('2025-04-25'), new Date('2025-05-28'), new Date('2025-06-25'), new Date('2025-07-30'), new Date('2025-08-25'), new Date('2025-09-10')],
      ['Pipeline laying Phase 1', 'Pumping station equipment', 'Pipeline laying Phase 2', 'Water treatment chemicals', 'Maintenance tools', 'Worker salaries'],
      'Infrastructure'
    ));

    // Closed FY 2024-25
    allExpenditures.push(...generateExpenditures('Bridge Construction', [5200000], [new Date('2024-11-15')], ['Bridge construction total payment'], 'Infrastructure'));
    allExpenditures.push(...generateExpenditures('Digital Classroom', [1450000], [new Date('2024-10-10')], ['Smart boards and computers'], 'Infrastructure'));
    allExpenditures.push(...generateExpenditures('Vaccination Drive', [2650000], [new Date('2024-08-20')], ['Vaccine procurement and logistics'], 'Healthcare'));

    await Expenditure.insertMany(allExpenditures);

    // Recalculate budget totals
    for (const budget of createdBudgets) {
      const expenditures = await Expenditure.find({ budgetId: budget._id });
      const totalSpent = expenditures.reduce((sum: number, exp: any) => sum + exp.amountSpent, 0);
      await Budget.findByIdAndUpdate(budget._id, { totalSpent });
    }

    // --- THRESHOLD RULES ---
    console.log('Seeding threshold rules...');
    const rulesData = [
      { type: 'UNDER_UTILIZATION', value: 40, secondaryValue: 70, description: 'Alert when budget utilization is below 40% after 70% of budget period has elapsed', createdBy: adminUser?._id, isActive: true },
      { type: 'OVERSPENDING', value: 100, description: 'Alert when spending exceeds allocated budget', createdBy: adminUser?._id, isActive: true },
      { type: 'SPENDING_SPIKE', value: 2.0, description: 'Alert when weekly spending exceeds 2x the standard deviation above mean', createdBy: adminUser?._id, isActive: true },
      { type: 'MAX_UTILIZATION', value: 90, description: 'Warning when utilization exceeds 90%', createdBy: adminUser?._id, isActive: true },
      { type: 'MIN_UTILIZATION', value: 25, secondaryValue: 50, description: 'Alert when utilization is below 25% after 50% of period elapsed', createdBy: adminUser?._id, isActive: true },
      { type: 'EXPENDITURE_LIMIT', value: 5000000, description: 'Alert when total spending exceeds ₹50,00,000', createdBy: adminUser?._id, isActive: true }
    ];
    await ThresholdRule.insertMany(rulesData);

    // --- ALERTS ---
    console.log('Seeding alerts...');
    const teacherTrainingBudget = getBudget('Teacher Training');
    const medEquipmentBudget = getBudget('Medical Equipment');
    const roadSafetyBudget = getBudget('Road Safety');
    const vaccinationBudget = getBudget('Vaccination Drive');

    const alertsData = [
      { 
        budgetId: teacherTrainingBudget?._id, departmentId: teacherTrainingBudget?.departmentId, 
        type: 'UNDER_UTILIZATION', severity: 'LOW', message: 'Budget utilization is very low (12.5%) for Teacher Training.', 
        status: 'UNRESOLVED', createdAt: anchorDate 
      },
      { 
        budgetId: medEquipmentBudget?._id, departmentId: medEquipmentBudget?.departmentId, 
        type: 'OVERSPENDING', severity: 'HIGH', message: 'Budget overspent (109%) for Medical Equipment.', 
        status: 'UNRESOLVED', createdAt: anchorDate 
      },
      { 
        budgetId: roadSafetyBudget?._id, departmentId: roadSafetyBudget?.departmentId, 
        type: 'SPENDING_SPIKE', severity: 'MEDIUM', message: 'Unusual spending spike detected in Road Safety budget.', 
        status: 'UNRESOLVED', createdAt: anchorDate 
      },
      { 
        budgetId: medEquipmentBudget?._id, departmentId: medEquipmentBudget?.departmentId, 
        type: 'THRESHOLD_BREACH', severity: 'HIGH', message: 'Max utilization (90%) breached for Medical Equipment.', 
        status: 'UNRESOLVED', createdAt: anchorDate 
      },
      { 
        budgetId: vaccinationBudget?._id, departmentId: vaccinationBudget?.departmentId, 
        type: 'OVERSPENDING', severity: 'HIGH', message: 'Budget overspent for Vaccination Drive.', 
        status: 'RESOLVED', createdAt: new Date('2025-03-01T00:00:00Z'), resolvedAt: new Date('2025-03-05T00:00:00Z'), resolvedBy: adminUser?._id
      }
    ];
    
    await Alert.insertMany(alertsData.filter(a => a.budgetId));

    // --- SUMMARY ---
    console.log('\n--- Seeding Complete ---');
    console.log('\nBudgets Summary:');
    
    const finalBudgets = await Budget.find().populate('departmentId');
    const summaryData = finalBudgets.map((b: any) => ({
      Department: b.departmentId.name,
      Budget: b.name,
      Allocated: b.allocatedAmount,
      Spent: b.totalSpent,
      Utilization: `${b.allocatedAmount ? ((b.totalSpent / b.allocatedAmount) * 100).toFixed(1) : 0}%`,
      Status: b.status
    }));
    
    console.table(summaryData);
    
    console.log('\nDemo Credentials:');
    console.log('Admin: admin@budgetmonitor.gov.in / Password123!');
    console.log('Finance: finance1@budgetmonitor.gov.in / Password123!');
    console.log('Dept Head (PWD): head.publicworks@budgetmonitor.gov.in / Password123!');
    
    console.log('\nDisconnecting from database...');
    await mongoose.disconnect();
    process.exit(0);
    
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
