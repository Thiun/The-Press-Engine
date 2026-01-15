# The Press Engine

## Prerequisites
- Java 25 (per the backend Maven configuration).
- Maven wrapper (included).
- Node.js + npm (for the React frontend).
- MongoDB running locally (default: `mongodb://localhost:27017/the_press_engine`).

## Backend (Spring Boot)
```bash
cd TPE
./mvnw spring-boot:run
```

Windows PowerShell:
```powershell
cd TPE
.\mvnw.cmd spring-boot:run
```

### Configuration
The backend reads the following properties from `TPE/src/main/resources/application.properties`:
- `spring.data.mongodb.uri` (default: `mongodb://localhost:27017/the_press_engine`)
- `spring.data.mongodb.database` (default: `the_press_engine`)
- `file.upload-dir` (default: `uploads` or override with `FILE_UPLOAD_DIR` env var)

## Frontend (React)
```bash
cd frontend
npm install
npm start
```

The frontend runs on `http://localhost:3000` by default and expects the backend on `http://localhost:8080`.

## Quick Start (both)
Open two terminals:

**Terminal 1**
```bash
cd TPE
./mvnw spring-boot:run
```

**Terminal 2**
```bash
cd frontend
npm install
npm start
```
