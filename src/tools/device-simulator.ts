
import mqtt from 'mqtt';
import { v4 as uuidv4 } from 'uuid';

interface DeviceConfig {
  id: string;
  enterpriseId: string;
  type: string;
  sensors: {
    name: string;
    min: number;
    max: number;
    unit: string;
  }[];
}

class DeviceSimulator {
  // @ts-ignore
  private client: mqtt.Client;
  private isConnected: boolean = false;
  private readings: { [key: string]: number } = {};
  private publishInterval: NodeJS.Timeout | null = null;

  constructor(
    private config: DeviceConfig,
    private brokerUrl: string = 'mqtt://localhost:1883'
  ) {
    this.client = mqtt.connect(this.brokerUrl, {
      clientId: `device_${this.config.id}`
    });

    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {
    this.client.on('connect', () => {
      console.log(`Device ${this.config.id} connected to MQTT broker`);
      this.isConnected = true;

      // Subscribe to device-specific command topic
      const commandTopic = `devices/${this.config.id}/commands`;
      this.client.subscribe(commandTopic, (err: any) => {
        if (!err) {
          console.log(`Subscribed to ${commandTopic}`);
        }
      });

      // Start publishing readings
      this.startPublishing();
    });

    this.client.on('message', (topic: any, message: any) => {
      try {
        const command = JSON.parse(message.toString());
        console.log(`Received command:`, command);
        this.handleCommand(command);
      } catch (error) {
        console.error('Error processing command:', error);
      }
    });

    this.client.on('error', (error: any) => {
      console.error('MQTT error:', error);
    });

    this.client.on('close', () => {
      this.isConnected = false;
      console.log('Connection closed');
    });
  }

  private generateReading(sensor: typeof this.config.sensors[0]): number {
    return Number((Math.random() * (sensor.max - sensor.min) + sensor.min).toFixed(2));
  }

  private async startPublishing(): Promise<void> {
    // Generate initial readings
    this.config.sensors.forEach(sensor => {
      this.readings[sensor.name] = this.generateReading(sensor);
    });

    // Publish readings every 5 seconds
    this.publishInterval = setInterval(() => {
      // Update readings with small random changes
      this.config.sensors.forEach(sensor => {
        const currentValue = this.readings[sensor.name];
        const maxChange = (sensor.max - sensor.min) * 0.02; // 2% max change
        const change = (Math.random() - 0.5) * 2 * maxChange;
        this.readings[sensor.name] = Number(Math.min(sensor.max, Math.max(sensor.min, currentValue + change)).toFixed(2));
      });

      const message = {
        deviceId: this.config.id,
        enterpriseId: this.config.enterpriseId,
        type: this.config.type,
        timestamp: new Date().toISOString(),
        readings: this.readings
      };

      this.client.publish('devices/readings', JSON.stringify(message), { qos: 1 });
      console.log('Published readings:', message);
    }, 5000);
  }

  private handleCommand(command: any): void {
    switch (command.command) {
      case 'updateInterval':
        if (this.publishInterval) {
          clearInterval(this.publishInterval);
        }
        this.startPublishing();
        break;

      case 'reset':
        this.config.sensors.forEach(sensor => {
          this.readings[sensor.name] = this.generateReading(sensor);
        });
        break;

      default:
        console.log('Unknown command:', command);
    }
  }

  public stop(): void {
    if (this.publishInterval) {
      clearInterval(this.publishInterval);
    }
    this.client.end();
  }
}

// Create and start a simulated device
const device = new DeviceSimulator({
  id: uuidv4(),
  enterpriseId: 'enterprise_123',
  type: 'environmental_sensor',
  sensors: [
    { name: 'temperature', min: 18, max: 28, unit: '°C' },
    { name: 'humidity', min: 30, max: 70, unit: '%' },
    { name: 'co2', min: 400, max: 2000, unit: 'ppm' }
  ]
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('Stopping device simulator...');
  device.stop();
  process.exit();
});