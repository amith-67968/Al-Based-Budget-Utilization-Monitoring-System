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

async function seed() {
  try {
    await connectDB();
    console.log('Connected to MongoDB. Starting seed...\n');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Department.deleteMany({}),
      Budget.deleteMany({}),
      Expenditure.deleteMany({}),
      Alert.deleteMany({}),
      ThresholdRule.deleteMany({}),
      AuditLog.deleteMany({})
    ]);
    console.log('Cleared existing data.');

    // --- DEPARTMENTS ---
    console.log('Seeding departments...');
    const deptsData = [
      { name: 'Public Works Department', description: 'Handles infrastructure, roads, bridges, and government buildings.' },
      { name: 'Education Department', description: 'Manages schools, training programs, and educational infrastructure.' },
      { name: 'Health Department', description: 'Oversees hospitals, clinics, vaccination drives, and public health.' },
      { name: 'Transport Department', description: 'Manages public transport, road safety, and vehicle regulations.' },
      { name: 'Water & Sanitation Department', description: 'Manages water supply, sewage treatment, and sanitation projects.' },
      { name: 'Rural Development Department', description: 'Focuses on village infrastructure, rural employment, and development.' }
    ];
    const createdDepartments = await Department.insertMany(deptsData);
    const getDeptId = (name: string) => createdDepartments.find(d => d.name.startsWith(name))!._id;
    console.log(`  Created ${createdDepartments.length} departments.`);

    // --- USERS ---
    console.log('Seeding users...');
    const hashedPassword = await bcrypt.hash('Password123!', 12);
    
    const usersData = [
      { name: 'Admin User', email: 'admin@budgetmonitor.gov.in', passwordHash: hashedPassword, role: 'admin' },
      { name: 'Rajesh Kumar', email: 'finance1@budgetmonitor.gov.in', passwordHash: hashedPassword, role: 'finance_officer' },
      { name: 'Priya Sharma', email: 'finance2@budgetmonitor.gov.in', passwordHash: hashedPassword, role: 'finance_officer' },
      { name: 'Amit Verma', email: 'head.publicworks@budgetmonitor.gov.in', passwordHash: hashedPassword, role: 'department_head', departmentId: getDeptId('Public Works') },
      { name: 'Sunita Patel', email: 'head.education@budgetmonitor.gov.in', passwordHash: hashedPassword, role: 'department_head', departmentId: getDeptId('Education') },
      { name: 'Dr. Ramesh Gupta', email: 'head.health@budgetmonitor.gov.in', passwordHash: hashedPassword, role: 'department_head', departmentId: getDeptId('Health') },
      { name: 'Vikram Singh', email: 'head.transport@budgetmonitor.gov.in', passwordHash: hashedPassword, role: 'department_head', departmentId: getDeptId('Transport') },
      { name: 'Meena Devi', email: 'head.water@budgetmonitor.gov.in', passwordHash: hashedPassword, role: 'department_head', departmentId: getDeptId('Water & Sanitation') }
    ];

    const createdUsers = await User.insertMany(usersData);
    const adminUser = createdUsers.find(u => u.role === 'admin')!;
    const financeOfficer = createdUsers.find(u => u.role === 'finance_officer')!;
    console.log(`  Created ${createdUsers.length} users.`);

    // Update departments with headUserId
    for (const user of createdUsers) {
      if (user.role === 'department_head' && user.departmentId) {
        await Department.findByIdAndUpdate(user.departmentId, { headUserId: user._id });
      }
    }

    // --- BUDGETS ---
    console.log('Seeding budgets...');
    const now = new Date();
    const fy2526Start = new Date('2025-04-01');
    const fy2526End = new Date('2026-03-31');
    const fy2425Start = new Date('2024-04-01');
    const fy2425End = new Date('2025-03-31');

    const budgetsData = [
      // FY 2025-26 Active Budgets
      { financialYear: '2025-26', projectName: 'Road Infrastructure Development', allocatedAmount: 4500000, totalSpent: 1875000, allocationDate: fy2526Start, startDate: fy2526Start, endDate: fy2526End, status: 'active', departmentId: getDeptId('Public Works'), createdBy: financeOfficer._id },
      { financialYear: '2025-26', projectName: 'Government Building Maintenance', allocatedAmount: 1800000, totalSpent: 950000, allocationDate: fy2526Start, startDate: fy2526Start, endDate: fy2526End, status: 'active', departmentId: getDeptId('Public Works'), createdBy: financeOfficer._id },
      { financialYear: '2025-26', projectName: 'School Development Program', allocatedAmount: 3200000, totalSpent: 2100000, allocationDate: fy2526Start, startDate: fy2526Start, endDate: fy2526End, status: 'active', departmentId: getDeptId('Education'), createdBy: financeOfficer._id },
      { financialYear: '2025-26', projectName: 'Teacher Training Initiative', allocatedAmount: 1200000, totalSpent: 180000, allocationDate: fy2526Start, startDate: fy2526Start, endDate: fy2526End, status: 'active', departmentId: getDeptId('Education'), createdBy: financeOfficer._id },
      { financialYear: '2025-26', projectName: 'Primary Healthcare Centers', allocatedAmount: 3800000, totalSpent: 4100000, allocationDate: fy2526Start, startDate: fy2526Start, endDate: fy2526End, status: 'exceeded', departmentId: getDeptId('Health'), createdBy: financeOfficer._id },
      { financialYear: '2025-26', projectName: 'Medical Equipment Procurement', allocatedAmount: 2200000, totalSpent: 1100000, allocationDate: fy2526Start, startDate: fy2526Start, endDate: fy2526End, status: 'active', departmentId: getDeptId('Health'), createdBy: financeOfficer._id },
      { financialYear: '2025-26', projectName: 'Road Safety Program', allocatedAmount: 1500000, totalSpent: 600000, allocationDate: fy2526Start, startDate: fy2526Start, endDate: fy2526End, status: 'active', departmentId: getDeptId('Transport'), createdBy: financeOfficer._id },
      { financialYear: '2025-26', projectName: 'Clean Water Supply', allocatedAmount: 2800000, totalSpent: 1200000, allocationDate: fy2526Start, startDate: fy2526Start, endDate: fy2526End, status: 'active', departmentId: getDeptId('Water & Sanitation'), createdBy: financeOfficer._id },
      { financialYear: '2025-26', projectName: 'Village Roads Construction', allocatedAmount: 2000000, totalSpent: 450000, allocationDate: fy2526Start, startDate: fy2526Start, endDate: fy2526End, status: 'active', departmentId: getDeptId('Rural Development'), createdBy: financeOfficer._id },

      // FY 2024-25 Closed Budgets
      { financialYear: '2024-25', projectName: 'Bridge Construction Project', allocatedAmount: 5500000, totalSpent: 5200000, allocationDate: fy2425Start, startDate: fy2425Start, endDate: fy2425End, status: 'closed', departmentId: getDeptId('Public Works'), createdBy: financeOfficer._id },
      { financialYear: '2024-25', projectName: 'Digital Classroom Initiative', allocatedAmount: 1500000, totalSpent: 1450000, allocationDate: fy2425Start, startDate: fy2425Start, endDate: fy2425End, status: 'closed', departmentId: getDeptId('Education'), createdBy: financeOfficer._id },
      { financialYear: '2024-25', projectName: 'Vaccination Drive 2024', allocatedAmount: 2500000, totalSpent: 2650000, allocationDate: fy2425Start, startDate: fy2425Start, endDate: fy2425End, status: 'exceeded', departmentId: getDeptId('Health'), createdBy: financeOfficer._id }
    ];

    const createdBudgets = await Budget.insertMany(budgetsData);
    console.log(`  Created ${createdBudgets.length} budgets.`);

    // --- EXPENDITURES ---
    console.log('Seeding expenditures...');
    const expenseCategories = ['salaries', 'infrastructure', 'equipment', 'supplies', 'travel', 'maintenance', 'consulting', 'training', 'utilities', 'miscellaneous'];

    const expendituresData: any[] = [];

    // Generate realistic expenditures for each budget
    for (const budget of createdBudgets) {
      const numExpenditures = Math.floor(Math.random() * 6) + 3; // 3-8 expenditures per budget
      let remainingSpent = budget.totalSpent;

      for (let i = 0; i < numExpenditures; i++) {
        const isLast = i === numExpenditures - 1;
        const amount = isLast ? remainingSpent : Math.floor(remainingSpent * (Math.random() * 0.4 + 0.1));
        remainingSpent -= amount;
        if (amount <= 0) continue;

        const budgetStart = new Date(budget.startDate);
        const budgetEnd = new Date(budget.endDate);
        const range = budgetEnd.getTime() - budgetStart.getTime();
        const randomDate = new Date(budgetStart.getTime() + Math.random() * Math.min(range, now.getTime() - budgetStart.getTime()));

        const descriptions = [
          'Material procurement and delivery', 'Staff salary disbursement', 'Equipment purchase and installation',
          'Contractor payment for phase work', 'Travel and inspection expenses', 'Maintenance and repair work',
          'Consulting fees for project review', 'Training program expenses', 'Utility bills and operational costs',
          'Miscellaneous operational expenses', 'Procurement of medical supplies', 'Construction material purchase',
          'Software licenses and IT infrastructure', 'Fuel and transportation costs', 'Safety equipment procurement'
        ];

        expendituresData.push({
          budgetId: budget._id,
          departmentId: budget.departmentId,
          amountSpent: amount,
          expenseCategory: expenseCategories[Math.floor(Math.random() * expenseCategories.length)],
          date: randomDate,
          description: descriptions[Math.floor(Math.random() * descriptions.length)],
          supportingDocumentReference: `DOC-${budget.financialYear}-${Math.floor(Math.random() * 9000) + 1000}`,
          recordedBy: financeOfficer._id
        });
      }
    }

    await Expenditure.insertMany(expendituresData);
    console.log(`  Created ${expendituresData.length} expenditures.`);

    // --- THRESHOLD RULES ---
    console.log('Seeding threshold rules...');
    const rulesData = [
      { ruleType: 'OVERSPENDING', value: 100, description: 'Alert when budget utilization exceeds 100%', enabled: true, createdBy: adminUser._id },
      { ruleType: 'OVERSPENDING', value: 90, description: 'Warning when budget utilization exceeds 90%', enabled: true, createdBy: adminUser._id },
      { ruleType: 'UNDER_UTILIZATION', value: 30, secondaryValue: 60, description: 'Alert when utilization is below 30% after 60% of period elapsed', enabled: true, createdBy: adminUser._id },
      { ruleType: 'SPENDING_SPIKE', value: 2, description: 'Alert when weekly spending exceeds 2x standard deviation above mean', enabled: true, createdBy: adminUser._id },
      { ruleType: 'MAX_UTILIZATION', value: 95, description: 'Alert when utilization approaches maximum at 95%', enabled: true, createdBy: adminUser._id },
      { ruleType: 'EXPENDITURE_LIMIT', value: 5000000, description: 'Alert when total expenditure exceeds ₹50,00,000', enabled: true, createdBy: adminUser._id }
    ];
    await ThresholdRule.insertMany(rulesData);
    console.log(`  Created ${rulesData.length} threshold rules.`);

    // --- ALERTS ---
    console.log('Seeding alerts...');
    const healthBudget = createdBudgets.find(b => b.projectName === 'Primary Healthcare Centers');
    const vaccineBudget = createdBudgets.find(b => b.projectName === 'Vaccination Drive 2024');
    const trainingBudget = createdBudgets.find(b => b.projectName === 'Teacher Training Initiative');

    const alertsData = [
      {
        budgetId: healthBudget?._id, departmentId: getDeptId('Health'),
        alertType: 'OVERSPENDING', severity: 'CRITICAL',
        message: 'Primary Healthcare Centers budget exceeded. Utilization at 107.89%. Immediate review required.',
        triggeredValue: 107.89, thresholdValue: 100, status: 'OPEN'
      },
      {
        budgetId: vaccineBudget?._id, departmentId: getDeptId('Health'),
        alertType: 'OVERSPENDING', severity: 'HIGH',
        message: 'Vaccination Drive 2024 exceeded allocated budget by ₹1,50,000.',
        triggeredValue: 106, thresholdValue: 100, status: 'REVIEWED', reviewedBy: adminUser._id, reviewedAt: new Date()
      },
      {
        budgetId: trainingBudget?._id, departmentId: getDeptId('Education'),
        alertType: 'UNDER_UTILIZATION', severity: 'MEDIUM',
        message: 'Teacher Training Initiative has only 15% utilization with 47% of the period elapsed.',
        triggeredValue: 15, thresholdValue: 30, status: 'OPEN'
      },
      {
        budgetId: createdBudgets.find(b => b.projectName === 'School Development Program')?._id,
        departmentId: getDeptId('Education'),
        alertType: 'OVERSPENDING', severity: 'HIGH',
        message: 'School Development Program approaching budget limit. Utilization at 65.6%.',
        triggeredValue: 65.6, thresholdValue: 90, status: 'RESOLVED', reviewedBy: financeOfficer._id, reviewedAt: new Date()
      },
      {
        budgetId: createdBudgets.find(b => b.projectName === 'Road Infrastructure Development')?._id,
        departmentId: getDeptId('Public Works'),
        alertType: 'SPENDING_SPIKE', severity: 'MEDIUM',
        message: 'Unusual spending spike detected in Road Infrastructure Development this week.',
        triggeredValue: 350000, thresholdValue: 200000, status: 'OPEN'
      }
    ];
    await Alert.insertMany(alertsData);
    console.log(`  Created ${alertsData.length} alerts.`);

    // --- AUDIT LOGS ---
    console.log('Seeding audit logs...');
    const auditLogsData = [
      { userId: adminUser._id, action: 'CREATE', entityType: 'user', entityId: financeOfficer._id.toString(), newValue: { name: 'Rajesh Kumar', role: 'finance_officer' }, ipAddress: '192.168.1.1' },
      { userId: financeOfficer._id, action: 'CREATE', entityType: 'budget', entityId: createdBudgets[0]._id.toString(), newValue: { projectName: 'Road Infrastructure Development' }, ipAddress: '192.168.1.2' },
      { userId: financeOfficer._id, action: 'LOGIN', entityType: 'auth', ipAddress: '192.168.1.2' },
      { userId: adminUser._id, action: 'LOGIN', entityType: 'auth', ipAddress: '192.168.1.1' },
      { userId: adminUser._id, action: 'UPDATE', entityType: 'threshold_rule', newValue: { ruleType: 'OVERSPENDING', value: 100 }, ipAddress: '192.168.1.1' }
    ];
    await AuditLog.insertMany(auditLogsData);
    console.log(`  Created ${auditLogsData.length} audit logs.`);

    console.log('\n✅ Seed completed successfully!');
    console.log('\n📋 Demo Credentials:');
    console.log('  Admin:            admin@budgetmonitor.gov.in / Password123!');
    console.log('  Finance Officer:  finance1@budgetmonitor.gov.in / Password123!');
    console.log('  Dept Head (PWD):  head.publicworks@budgetmonitor.gov.in / Password123!');
    console.log('  Dept Head (EDU):  head.education@budgetmonitor.gov.in / Password123!');
    console.log('  Dept Head (HLT):  head.health@budgetmonitor.gov.in / Password123!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
}

seed();
