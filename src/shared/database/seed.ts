import { DataSource } from 'typeorm';
import { typeormConfig } from './typeorm.config';
import { Enterprise } from '../../modules/business/entities/enterprise.entity';
import { Employee } from '../../modules/business/entities/employee.entity';
import { Device } from '../../modules/business/entities/device.entity';

async function seed() {
  console.log('Starting database seed...');

  const dataSource = new DataSource(typeormConfig);
  await dataSource.initialize();

  try {
    // Create test enterprise
    const enterprise = await dataSource.getRepository(Enterprise).save({
      name: 'Test Enterprise',
      address: '123 Test Street',
      phone: '555-0123',
    });

    console.log('Created enterprise:', enterprise);

    // Create test employee
    const employee = await dataSource.getRepository(Employee).save({
      name: 'John Doe',
      email: 'john@test.com',
      role: 'admin',
      password: 'hashedpassword', // In real app, hash this password
      enterprise: enterprise,
    });

    console.log('Created employee:', employee);

    // Create test devices
    const devices = await dataSource.getRepository(Device).save([
      {
        name: 'Temperature Sensor 1',
        type: 'temperature',
        location: 'Building A',
        enterprise: enterprise,
        serialNumber: 'abc123',
      },
      {
        name: 'Humidity Sensor 1',
        type: 'humidity',
        location: 'Building A',
        enterprise: enterprise,
        serialNumber: 'abc456',
      },
    ]);

    console.log('Created devices:', devices);

    console.log('Seed completed successfully');
  } catch (error) {
    console.error('Error during seed:', error);
  } finally {
    await dataSource.destroy();
  }
}

// Run the seed
seed().catch(console.error);
