# IoT Platform

A modular monolith IoT platform built with Fastify that manages business data and IoT device communications.

## Architecture Overview

The platform uses a dual-database approach:
- **PostgreSQL**: For business data (enterprises, employees, device registrations)
- **MongoDB**: For IoT data (device readings, sensor data)
- **MQTT**: For real-time device communication

### Key Features

- Modular Monolith Architecture
- Real-time device data processing
- Device command & control
- Scalable data storage
- Type-safe development with TypeScript

## Prerequisites

- Node.js (v16 or higher)
- Docker and Docker Compose
- TypeScript knowledge
- Basic understanding of MQTT protocol

## Getting Started

1. **Clone the repository**
```bash
git clone <repository-url>
cd iot-platform
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup environment variables**
Create a `.env` file in the root directory:
```env
PORT=3000
MONGO_URI=mongodb://root:example@localhost:27017/iot_data?authSource=admin
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=iot_business
JWT_SECRET=your-secret-key
```

4. **Start the infrastructure**
```bash
docker-compose up -d
```

This will start:
- MongoDB (port 27017)
- MongoDB Express (port 8081)
- PostgreSQL (port 5432)
- pgAdmin (port 8082)
- MQTT Broker (port 1883)

5. **Run the application**
```bash
npm run dev
```

## Project Structure

```
src/
├── modules/
│   ├── business/          # Business module (PostgreSQL)
│   │   ├── entities/
│   │   ├── routes/
│   │   └── services/
│   ├── iot/              # IoT module (MongoDB)
│   │   ├── models/
│   │   ├── routes/
│   │   └── services/
│   └── mqtt/             # MQTT module
│       ├── plugin.ts
│       └── service.ts
├── shared/
│   ├── config/
│   ├── plugins/
│   └── types/
└── tools/
    └── device-simulator.ts
```

## API Endpoints

### Business Module
- `GET /api/business/enterprises` - List enterprises
- `POST /api/business/enterprises` - Create enterprise
- `GET /api/business/enterprises/:id` - Get enterprise details

### IoT Module
- `GET /api/iot/readings` - Get device readings
- `GET /api/iot/readings/aggregated` - Get aggregated readings

### MQTT Module
- `POST /api/mqtt/devices/:deviceId/command` - Send command to device
- `POST /api/mqtt/publish` - Publish MQTT message

## Device Simulator

The project includes a device simulator for testing:

```bash
# Start a simulated device
ts-node src/tools/device-simulator.ts
```

### Available Device Commands

1. Update Publishing Interval
```bash
curl -X POST http://localhost:3000/api/mqtt/devices/{deviceId}/command \
  -H "Content-Type: application/json" \
  -d '{
    "command": "updateInterval",
    "payload": {
      "interval": 10000
    }
  }'
```

2. Reset Device
```bash
curl -X POST http://localhost:3000/api/mqtt/devices/{deviceId}/command \
  -H "Content-Type: application/json" \
  -d '{
    "command": "reset",
    "payload": {}
  }'
```

3. Sleep/Wake Commands
```bash
# Sleep
curl -X POST http://localhost:3000/api/mqtt/devices/{deviceId}/command \
  -H "Content-Type: application/json" \
  -d '{
    "command": "sleep",
    "payload": {}
  }'

# Wake
curl -X POST http://localhost:3000/api/mqtt/devices/{deviceId}/command \
  -H "Content-Type: application/json" \
  -d '{
    "command": "wake",
    "payload": {}
  }'
```

## Development

### Add New Business Entity

1. Create entity in `src/modules/business/entities/`
2. Create routes in `src/modules/business/routes/`
3. Register routes in `src/modules/business/index.ts`

### Add New IoT Feature

1. Create model in `src/modules/iot/models/`
2. Create service in `src/modules/iot/services/`
3. Add routes in `src/modules/iot/routes/`

## Management Interfaces

- MongoDB Express: http://localhost:8081
- pgAdmin: http://localhost:8082
  - Email: admin@admin.com
  - Password: admin

## Contributing

[Add contribution guidelines here]

## License

[Add license information here]