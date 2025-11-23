# Admin Dashboard J2E

A full-stack admin dashboard built with Spring Boot (API) and Next.js (frontend), using PostgreSQL for data storage. Supports CI with Jenkins and local development with Docker.

## Features

- **API**: RESTful backend with Spring Boot, JPA, and security.
- **Frontend**: Modern UI with Next.js, Tailwind CSS, and TypeScript.
- **Database**: PostgreSQL for persistent data.
- **CI/CD**: Automated builds and tests with Jenkins.
- **Deployment**: Local Docker Compose; scalable for cloud/Kubernetes.

## Prerequisites

- Java 17+
- Node.js 18+
- Docker & Docker Compose
- Maven (for API)
- Git

## Local Development Setup

1. **Clone the Repo**:

   ```
   git clone https://github.com/your-username/admin-dash-j2e.git
   cd admin-dash-j2e
   ```

2. **Environment Variables**:

   - Copy `api/.env.example` to `api/.env` and update (e.g., DB credentials).
   - Copy `front/.env.example` to `front/.env` and set `NEXT_PUBLIC_BACKEND_URL=http://localhost:8080`.

3. **Run Locally**:

   - **API**: `cd api && ./mvnw spring-boot:run`
   - **Frontend**: `cd front && npm run dev`
   - Access: Frontend at `http://localhost:3000`, API at `http://localhost:8080`.

4. **With Docker Compose** (recommended):
   ```
   docker-compose up --build
   ```
   - Builds and runs API, frontend, and DB in containers.
   - Access same URLs.

## CI/CD with Jenkins

1. **Setup Jenkins**:

   - Install Jenkins, create a Pipeline job.
   - Set SCM to Git, point to this repo.

2. **Jenkinsfile**:

   - The `Jenkinsfile` at root handles checkout, parallel builds/tests, and Docker image prep.
   - Runs on push; monitors for failures.

3. **Run Pipeline**:
   - Trigger manually or on webhook.
   - Builds API (Maven), frontend (npm), runs tests, builds images.

## Project Structure

```
admin-dash-j2e/
├── .gitignore
├── .dockerignore (optional)
├── [`docker-compose.yml`](docker-compose.yml )
├── Jenkinsfile
├── README.md
├── api/  # Spring Boot API
│   ├── .dockerignore
│   ├── .env
│   ├── Dockerfile
│   ├── pom.xml
│   └── src/
├── front/  # Next.js Frontend
│   ├── .dockerignore
│   ├── .env
│   ├── Dockerfile
│   ├── package.json
│   └── app/
└── (future: helm/ for Kubernetes)
```

## API Endpoints

- `GET /api/dashboard` - Dashboard data
- `POST /api/auth/login` - User login
- See `api/src/main/java/...` for full list.

## Frontend Pages

- `/` - Dashboard
- `/auth/signin` - Login
- `/users` - User management
- See `front/app/` for routes.

## Testing

- **API**: `cd api && ./mvnw test`
- **Frontend**: `cd front && npm test`
- Jenkins runs these automatically.

## Deployment

- **Local**: Use `docker-compose up -d`.
- **Production**: Push images to registry, deploy to cloud (e.g., AWS ECS, Kubernetes).

## Contributing

1. Fork the repo.
2. Create a feature branch.
3. Commit changes, push, and create a PR.
4. Ensure tests pass in Jenkins.

## License

MIT License.
