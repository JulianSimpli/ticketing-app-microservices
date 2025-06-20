# Ticketing Microservices App

This project is a ticketing application built using a microservices architecture.

## Tech Stack

- **Frontend:** React (Next.js)
- **Backend:** Multiple Node.js services (TypeScript)
- **Database:** MongoDB
- **Authentication:** JWT (stored in cookies)
- **Containerization & Orchestration:** Docker & Kubernetes
- **Development Workflow:** Skaffold
- **Deployment:** Local or Google Cloud Build

## Architecture Overview

- **Microservices:** Each core domain (e.g., Auth, Tickets, Orders) is implemented as a separate Node.js service.
- **Frontend:** A Next.js app communicates with backend services via REST APIs.
- **Auth Service:** Handles user authentication using JWTs, with tokens stored securely in cookies

## Local Development

1. **Prerequisites:** Docker, Kubernetes (e.g., Docker Desktop or Minikube), Skaffold, and Node.js.
2. **Start Services:** Use Skaffold to build and deploy all services locally:

```bash
skaffold dev
```

3. **Access the App:** The frontend will be available at the configured Kubernetes ingress URL.

## Deployment

- **Kubernetes:** All services are containerized and managed via Kubernetes manifests.
- **Google Cloud Build:** Optionally, you can automate builds and deployments using Google Cloud Build.

## Auth Module

- **Database:** MongoDB
- **Authentication:** JWTs issued on login/signup, stored in HTTP-only cookies for security.

## Future Plans

- Implement additional services (e.g., Tickets, Orders, Payments)
- Add CI/CD pipelines
- Enhance security and monitoring
