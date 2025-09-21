import app from './app.js';
import User from './models/User.js';

const PORT = process.env.PORT || 5000;

/**
 * Seed admin user if no admin exists
 */
const seedAdminUser = async () => {
  try {
    const adminExists = await User.findOne({ role: 'Admin' });

    if (!adminExists) {
      const adminUser = new User({
        name: 'Super Admin',
        email: 'admin@paramdairy.com',
        password: 'Admin@123', // In production, this should be changed
        role: 'Admin'
      });

      await adminUser.save();
      console.log('✅ Admin user seeded successfully');
      console.log('📧 Email: admin@paramdairy.com');
      console.log('🔑 Password: Admin@123');
      console.log('⚠️  Please change the default password after first login');
    }
  } catch (error) {
    console.error('❌ Error seeding admin user:', error.message);
  }
};

// Start server
const startServer = async () => {
  try {
    // Seed admin user
    await seedAdminUser();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`🔐 API Base URL: http://localhost:${PORT}/api/auth`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', err);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

startServer();
