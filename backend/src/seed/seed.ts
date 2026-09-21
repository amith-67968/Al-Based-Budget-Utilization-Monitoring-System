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
    const departmentDefinitions = [
      {
        name: 'Public Works Department (PWD)',
        description: 'Roads, bridges, flyovers, highways and state civil public infrastructure'
      },
      {
        name: 'Health & Family Welfare Department',
        description: 'Public health systems, primary health centers, hospitals and medical welfare schemes'
      },
      {
        name: 'Education Department',
        description: 'Primary, secondary, higher education, school infrastructure and literacy programs'
      },
      {
        name: 'Water Resources & Sanitation Department',
        description: 'Drinking water distribution, canal irrigation, river basin management and rural sanitation'
      },
      {
        name: 'Transport Department',
        description: 'State public road transport fleet, electric mobility, traffic and road safety'
      },
      {
        name: 'Rural Development Department',
        description: 'Panchayati Raj institutions, rural employment guarantee, housing and livelihood schemes'
      },
      {
        name: 'Urban Development & Housing Department',
        description: 'Smart city initiatives, urban town planning, municipal infrastructure and affordable housing'
      },
      {
        name: 'Agriculture & Farmers Welfare Department',
        description: 'Crop insurance, agricultural subsidies, micro-irrigation, seeds and farmer welfare'
      }
    ];

    const departments = await Department.insertMany(
      departmentDefinitions.map(d => ({ ...d, status: 'active' as const }))
    );
    console.log(`${departments.length} departments seeded.`);

    console.log('Seeding Users...');
    const usersData: any[] = [
      // Admins
      { name: 'Amitabh Sharma', email: 'admin1@gov.in', passwordHash, role: 'admin' as const, status: 'active' as const },
      { name: 'Priya Patel', email: 'admin2@gov.in', passwordHash, role: 'admin' as const, status: 'active' as const },
      // Finance Officers
      { name: 'Rajesh Kumar', email: 'finance1@gov.in', passwordHash, role: 'finance_officer' as const, status: 'active' as const },
      { name: 'Sneha Gupta', email: 'finance2@gov.in', passwordHash, role: 'finance_officer' as const, status: 'active' as const },
      { name: 'Vikram Singh', email: 'finance3@gov.in', passwordHash, role: 'finance_officer' as const, status: 'active' as const },
    ];

    // Department Heads
    const headDetails = [
      { name: 'Dr. Suresh Desai, IAS', email: 'head.public@gov.in', deptIdx: 0 },
      { name: 'Dr. Anita Reddy, MD', email: 'head.health@gov.in', deptIdx: 1 },
      { name: 'Shri Manoj Tiwari, IAS', email: 'head.education@gov.in', deptIdx: 2 },
      { name: 'Smt. Kavita Iyer, IAS', email: 'head.water@gov.in', deptIdx: 3 },
      { name: 'Shri Ramesh Nair', email: 'head.transport@gov.in', deptIdx: 4 },
      { name: 'Dr. Pooja Joshi, IAS', email: 'head.rural@gov.in', deptIdx: 5 },
      { name: 'Shri Deepak Verma, IAS', email: 'head.urban@gov.in', deptIdx: 6 },
      { name: 'Smt. Meera Menon', email: 'head.agriculture@gov.in', deptIdx: 7 }
    ];

    headDetails.forEach(h => {
      usersData.push({
        name: h.name,
        email: h.email,
        passwordHash,
        role: 'department_head' as const,
        departmentId: departments[h.deptIdx]._id as any,
        status: 'active' as const
      });
    });

    const users = await User.insertMany(usersData);
    console.log(`${users.length} users seeded.`);

    // Assign department heads
    for (const h of headDetails) {
      const u = users.find(user => user.email === h.email);
      if (u) {
        await Department.findByIdAndUpdate(departments[h.deptIdx]._id, { headUserId: u._id });
      }
    }

    const adminUser = users.find(u => u.role === 'admin')!;
    const financeUser = users.find(u => u.role === 'finance_officer')!;

    // Schemes mapped per department
    const departmentSchemes: Record<number, string[]> = {
      0: [ // PWD
        "National Highway Corridor Expansion (NH-48)",
        "Pradhan Mantri Gram Sadak Yojana Phase-IV",
        "State Strategic Flyovers & Elevated Corridors",
        "Inter-District Expressway Widening Project",
        "District Court & Civil Complex Construction"
      ],
      1: [ // Health
        "Ayushman Bharat - PMJAY Tertiary Care Implementation",
        "National Health Mission - Sub-District Health Centers",
        "Critical Care Hospital Blocks & Medical Oxygen Grid",
        "Free Essential Diagnostics & Dialysis Network",
        "Maternal & Child Health Nutrition Comprehensive Drive"
      ],
      2: [ // Education
        "Samagra Shiksha Integrated School Grant Scheme",
        "PM SHRI Schools of Excellence Development",
        "PM-POSHAN National Nutritious Meal Program",
        "State Digital Classrooms & High-Tech STEM Labs",
        "Teacher Training & Curriculum Modernization Initiative"
      ],
      3: [ // Water
        "Jal Jeevan Mission - Har Ghar Nal Se Jal",
        "Swachh Bharat Mission (Grameen) Phase-II ODF Plus",
        "National River Basin Conservation & Desiltation",
        "Automated Micro-Canal Irrigation Network",
        "Groundwater Recharge & Community Amrit Sarovars"
      ],
      4: [ // Transport
        "Electric Bus Induction & Fast-Charging Network",
        "State Road Transport Fleet Fleet Modernization",
        "Intelligent Traffic Command & Enforcement System",
        "Automated Vehicle Fitness Testing Stations",
        "State Highway Road Safety & Incident Response Patrol"
      ],
      5: [ // Rural Dev
        "Mahatma Gandhi National Rural Employment (MGNREGA)",
        "Pradhan Mantri Awaas Yojana - Gramin Housing",
        "Deendayal Antyodaya Yojana - National Rural Livelihoods",
        "Sansad Adarsh Gram Integrated Village Cluster Project",
        "Rural Community Common Service Centers Infrastructure"
      ],
      6: [ // Urban Dev
        "Atal Mission for Rejuvenation and Urban Transformation (AMRUT 2.0)",
        "Smart Cities Mission Integrated Command Center",
        "Pradhan Mantri Awas Yojana - Urban Affordable Housing",
        "City Solid Waste Processing & Biomethanation Plants",
        "Stormwater Drainage & Urban Flood Mitigation Network"
      ],
      7: [ // Agriculture
        "PM-KISAN Direct Benefit Income Support Scheme",
        "Pradhan Mantri Fasal Bima Yojana (Crop Insurance)",
        "Per Drop More Crop - Micro Irrigation Program",
        "Rashtriya Krishi Vikas Yojana (RKVY Infrastructure)",
        "Cold Chain Storage & Farmer Producer Organizations (FPO)"
      ]
    };

    const financialYears = ['2023-24', '2024-25', '2025-26', '2026-27'];
    const categories = ['salaries', 'infrastructure', 'equipment', 'supplies', 'travel', 'maintenance', 'consulting', 'training', 'utilities', 'miscellaneous'] as const;

    const budgetsData: any[] = [];
    const expendituresData: any[] = [];
    const alertsData: any[] = [];

    console.log('Generating budgets across all departments and financial years...');

    let voucherSeq = 1000;

    departments.forEach((dept, deptIdx) => {
      const schemes = departmentSchemes[deptIdx] || [];
      const deptHead = users.find(u => u.departmentId?.toString() === dept._id.toString()) || adminUser;

      schemes.forEach((schemeName, sIdx) => {
        // We create budgets for 2023-24, 2024-25, 2025-26, and some 2026-27
        financialYears.forEach((fy) => {
          // Skip some 2026-27 to make it realistic
          if (fy === '2026-27' && sIdx % 2 !== 0) return;

          const budgetId = new mongoose.Types.ObjectId();
          // Allocated amount between 1 Crore and 25 Crores
          const allocatedAmount = Math.floor(Math.random() * (250000000 - 15000000 + 1) + 15000000);

          let status: 'draft' | 'active' | 'closed' | 'exceeded' = 'active';
          let targetSpendPercentage = 0.75; // default 75%

          if (fy === '2023-24') {
            status = 'closed';
            targetSpendPercentage = 0.92 + Math.random() * 0.08; // 92% to 100%
          } else if (fy === '2024-25') {
            const r = Math.random();
            if (r > 0.85) {
              status = 'exceeded';
              targetSpendPercentage = 1.05 + Math.random() * 0.15; // 105% to 120%
            } else {
              status = 'closed';
              targetSpendPercentage = 0.88 + Math.random() * 0.11; // 88% to 99%
            }
          } else if (fy === '2025-26') { // Current active year
            const r = Math.random();
            if (r < 0.15) {
              status = 'draft';
              targetSpendPercentage = 0.0;
            } else if (r < 0.30) {
              status = 'exceeded';
              targetSpendPercentage = 1.08 + Math.random() * 0.14; // 108% to 122%
            } else if (r < 0.50) {
              status = 'active';
              targetSpendPercentage = 0.20 + Math.random() * 0.15; // Under-utilized (20-35%)
            } else {
              status = 'active';
              targetSpendPercentage = 0.60 + Math.random() * 0.32; // Normal active (60-92%)
            }
          } else { // 2026-27
            status = 'draft';
            targetSpendPercentage = 0.0;
          }

          const targetTotalSpent = Math.floor(allocatedAmount * targetSpendPercentage);
          let actualTotalSpent = 0;

          // Determine date ranges based on FY
          const startYear = parseInt(fy.split('-')[0], 10);
          const startDate = new Date(`${startYear}-04-01`);
          const endDate = new Date(`${startYear + 1}-03-31`);
          const allocationDate = new Date(`${startYear}-04-01`);

          // Generate expenditures if targetTotalSpent > 0
          if (targetTotalSpent > 0) {
            const numExpenditures = Math.floor(Math.random() * 5) + 4; // 4 to 8 expenditures
            let remainingToSpend = targetTotalSpent;

            for (let e = 0; e < numExpenditures; e++) {
              const isLast = e === numExpenditures - 1;
              const spendThis = isLast 
                ? remainingToSpend 
                : Math.floor(remainingToSpend / (numExpenditures - e) * (0.7 + Math.random() * 0.6));
              
              if (spendThis <= 0) continue;
              remainingToSpend -= spendThis;
              actualTotalSpent += spendThis;

              // Date inside the FY
              const expDate = new Date(startDate);
              const maxMonths = fy === '2025-26' ? 10 : 11;
              expDate.setMonth(expDate.getMonth() + Math.floor(Math.random() * maxMonths));
              expDate.setDate(Math.floor(Math.random() * 26) + 1);

              const category = categories[Math.floor(Math.random() * categories.length)];
              voucherSeq++;

              expendituresData.push({
                budgetId,
                departmentId: dept._id,
                amountSpent: spendThis,
                expenseCategory: category,
                date: expDate,
                description: `Voucher #${voucherSeq}: Disbursal for ${category} under ${schemeName}`,
                supportingDocumentReference: `SAN-${startYear}-${dept.name.substring(0, 3).toUpperCase()}-${voucherSeq}`,
                recordedBy: deptHead._id
              });
            }
          }

          budgetsData.push({
            _id: budgetId,
            financialYear: fy,
            departmentId: dept._id,
            projectName: schemeName,
            allocatedAmount,
            totalSpent: actualTotalSpent,
            allocationDate,
            startDate,
            endDate,
            status,
            createdBy: adminUser._id
          });

          // Generate realistic Alerts for noticeable conditions in 2025-26 & 2024-25
          if (status === 'exceeded') {
            const util = ((actualTotalSpent / allocatedAmount) * 100).toFixed(1);
            alertsData.push({
              budgetId,
              departmentId: dept._id,
              alertType: 'OVERSPENDING' as const,
              severity: 'CRITICAL' as const,
              message: `CRITICAL: Budget limit exceeded for ${schemeName}. Utilized: ${util}% of ₹${(allocatedAmount / 10000000).toFixed(2)} Cr`,
              triggeredValue: parseFloat(util),
              thresholdValue: 100,
              status: fy === '2025-26' ? 'OPEN' as const : 'RESOLVED' as const,
              reviewedBy: fy === '2024-25' ? financeUser._id : undefined,
              reviewedAt: fy === '2024-25' ? new Date(`${startYear + 1}-02-15`) : undefined
            });
          } else if (fy === '2025-26' && targetSpendPercentage > 0 && targetSpendPercentage < 0.35) {
            const util = ((actualTotalSpent / allocatedAmount) * 100).toFixed(1);
            alertsData.push({
              budgetId,
              departmentId: dept._id,
              alertType: 'UNDER_UTILIZATION' as const,
              severity: 'HIGH' as const,
              message: `WARNING: Substantial under-utilization detected for ${schemeName}. Only ${util}% utilized entering Q4.`,
              triggeredValue: parseFloat(util),
              thresholdValue: 40,
              status: 'OPEN' as const
            });
          } else if (fy === '2025-26' && sIdx === 0 && actualTotalSpent > 0) {
            alertsData.push({
              budgetId,
              departmentId: dept._id,
              alertType: 'SPENDING_SPIKE' as const,
              severity: 'MEDIUM' as const,
              message: `Spike detected: Monthly expenditure in ${schemeName} increased by 42% over baseline.`,
              triggeredValue: 42,
              thresholdValue: 30,
              status: Math.random() > 0.5 ? 'OPEN' as const : 'REVIEWED' as const,
              reviewedBy: financeUser._id,
              reviewedAt: new Date()
            });
          }
        });
      });
    });

    console.log(`Inserting ${budgetsData.length} budgets...`);
    const budgets = await Budget.insertMany(budgetsData);
    console.log(`${budgets.length} budgets seeded successfully.`);

    console.log(`Inserting ${expendituresData.length} expenditures...`);
    const expenditures = await Expenditure.insertMany(expendituresData);
    console.log(`${expenditures.length} expenditures seeded successfully.`);

    console.log('Seeding Threshold Rules...');
    const rulesData = [
      { ruleType: 'OVERSPENDING' as const, value: 90, description: 'Alert when spending exceeds 90% of allocated budget', enabled: true, createdBy: adminUser._id },
      { ruleType: 'OVERSPENDING' as const, value: 100, description: 'Critical alert when spending exceeds 100% of allocation', enabled: true, createdBy: adminUser._id },
      { ruleType: 'UNDER_UTILIZATION' as const, value: 25, description: 'Alert when less than 25% utilized by end of Q3', enabled: true, createdBy: adminUser._id },
      { ruleType: 'SPENDING_SPIKE' as const, value: 30, description: 'Alert on sudden 30% jump in monthly departmental spending', enabled: true, createdBy: adminUser._id },
      { ruleType: 'MAX_UTILIZATION' as const, value: 95, description: 'Critical limit triggered at 95% utilization', enabled: true, createdBy: adminUser._id },
      { ruleType: 'EXPENDITURE_LIMIT' as const, value: 50000000, description: 'Mandatory scrutiny for single expenditure above 5 Crores', enabled: true, createdBy: adminUser._id },
      { ruleType: 'SPENDING_SPIKE' as const, value: 50, description: 'Alert on 50% jump in weekly expenditure velocity', enabled: true, createdBy: adminUser._id },
      { ruleType: 'UNDER_UTILIZATION' as const, value: 15, description: 'Alert when less than 15% utilized by Q2 end', enabled: true, createdBy: adminUser._id }
    ];
    await ThresholdRule.insertMany(rulesData);
    console.log(`${rulesData.length} threshold rules seeded.`);

    console.log(`Inserting ${alertsData.length} alerts...`);
    const alerts = await Alert.insertMany(alertsData);
    console.log(`${alerts.length} alerts seeded.`);

    console.log('Seeding Audit Logs...');
    const auditActions = ['CREATE', 'UPDATE', 'STATUS_CHANGE', 'LOGIN'];
    const entityTypes = ['budget', 'expenditure', 'user', 'department', 'alert', 'threshold_rule', 'auth'] as const;

    const auditLogsData: any[] = [];
    const ipList = ['10.20.14.88', '10.20.14.92', '192.168.1.105', '192.168.1.45', '172.16.0.12'];

    for (let i = 0; i < 60; i++) {
      const user = users[i % users.length];
      const action = auditActions[i % auditActions.length];
      const entityType = entityTypes[i % entityTypes.length];
      const logDate = new Date();
      logDate.setHours(logDate.getHours() - (i * 4));

      let prevVal: any = undefined;
      let newVal: any = undefined;

      if (action === 'STATUS_CHANGE') {
        prevVal = { status: 'OPEN' };
        newVal = { status: 'REVIEWED' };
      } else if (action === 'UPDATE') {
        prevVal = { allocatedAmount: 20000000 };
        newVal = { allocatedAmount: 25000000, revisionNote: 'Cabinet approved supplementary grant' };
      } else if (action === 'CREATE') {
        newVal = { recordCreated: true, createdBy: user.name };
      }

      auditLogsData.push({
        userId: user._id,
        action,
        entityType,
        entityId: new mongoose.Types.ObjectId().toString(),
        ipAddress: ipList[i % ipList.length],
        previousValue: prevVal,
        newValue: newVal,
        createdAt: logDate,
        updatedAt: logDate
      });
    }

    await AuditLog.insertMany(auditLogsData);
    console.log(`${auditLogsData.length} audit logs seeded.`);

    console.log('\n=============================================');
    console.log('SEEDING COMPLETED SUCCESSFULLY!');
    console.log('=============================================');
    console.log(`Departments : ${departments.length}`);
    console.log(`Users       : ${users.length}`);
    console.log(`Budgets     : ${budgets.length} (spanning 2023-24, 2024-25, 2025-26, 2026-27)`);
    console.log(`Expenditures: ${expenditures.length}`);
    console.log(`Alerts      : ${alerts.length}`);
    console.log(`Rules       : ${rulesData.length}`);
    console.log(`Audit Logs  : ${auditLogsData.length}`);
    console.log('---------------------------------------------');
    console.log('Authorized Credentials (Password: Password123!):');
    console.log(`Admin                  : admin1@gov.in`);
    console.log(`Finance Officer        : finance1@gov.in`);
    console.log(`Dept Head (PWD)        : head.public@gov.in`);
    console.log(`Dept Head (Health)     : head.health@gov.in`);
    console.log(`Dept Head (Education)  : head.education@gov.in`);
    console.log(`Dept Head (Agriculture): head.agriculture@gov.in`);
    console.log('=============================================\n');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDB();
