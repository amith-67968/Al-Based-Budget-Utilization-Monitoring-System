import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import { connectDB } from './config/database';
import { config } from './config/env';

import { User } from './models/User';
import { seedDB } from './seed/seed';

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    
    // Auto-seed if database is empty (0 users) or AUTO_SEED is set
    try {
      const userCount = await User.countDocuments();
      if (userCount === 0 || process.env.AUTO_SEED === 'true') {
        console.log(`\n🌱 Auto-seeding database (current user count: ${userCount})...`);
        await seedDB(false);
        console.log('✅ Initial database seed completed successfully.\n');
      } else {
        console.log(`\nℹ️  Database contains ${userCount} users. Auto-seed skipped.`);
      }
    } catch (seedErr) {
      console.error('⚠️  Auto-seed encountered an error:', seedErr);
    }

    // Start Express server
    const PORT = config.PORT;
    app.listen(PORT, () => {
      console.log(`\n🚀 Server running on port ${PORT}`);
      console.log(`📊 Environment: ${config.NODE_ENV}`);
      console.log(`🔗 API: http://localhost:${PORT}/api`);
      console.log(`❤️  Health: http://localhost:${PORT}/api/health\n`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
