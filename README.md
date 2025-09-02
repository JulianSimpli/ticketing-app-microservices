# 🎫 Ticketing Microservices Platform

Distributed ticket selling system built with **microservices** architecture using **Node.js**, **TypeScript**, **MongoDB** and **Kubernetes**.

## 🏗️ Architecture

**5 Independent Microservices:**
- **Auth** - JWT authentication + user registration/login
- **Tickets** - Ticket CRUD with optimistic concurrency control
- **Orders** - Order management with automatic expiration (15 min)
- **Payments** - Payment processing with **Stripe**
- **Expiration** - Expiration jobs using **Bull Queue** + **Redis**

**Frontend:** Next.js with SSR and Bootstrap

## 🔧 Tech Stack

- **Backend:** Node.js + TypeScript + Express
- **Frontend:** Next.js + React + Bootstrap
- **Database:** MongoDB (one instance per service)
- **Message Broker:** NATS Streaming Server (event-driven)
- **Queue:** Bull + Redis (for expiration jobs)
- **Payments:** Stripe API
- **Orchestration:** Kubernetes + Skaffold
- **CI/CD:** GitHub Actions + Docker Hub

## 🚀 Quick Setup

### Prerequisites
```bash
# Install dependencies
kubectl, docker, skaffold
```

### Required Environment Variables
```bash
# Kubernetes secrets
JWT_KEY=<random-string>
STRIPE_KEY=<stripe-secret-key>
```

### Local Development
```bash
# 1. Add local host
echo "127.0.0.1 ticketing.dev" >> /etc/hosts

# 2. Create k8s secrets
kubectl create secret generic jwt-secret --from-literal=JWT_KEY=asdf
kubectl create secret generic stripe-secret --from-literal=STRIPE_KEY=sk_test_...

# 3. Start with Skaffold
skaffold dev

# 4. Access the app
open https://ticketing.dev
```

## 📡 Event-Driven Communication

**Main Events:**
- `TicketCreated/Updated` - Synchronization between tickets and orders
- `OrderCreated/Cancelled` - Coordinates reservations and payments
- `PaymentCreated` - Confirms order after successful payment
- `ExpirationComplete` - Cancels expired orders

## 🔒 Key Features

- **Optimistic Concurrency Control** with versioning
- **Event sourcing** for inter-service communication
- **Automatic order expiration** (15 minutes)
- **Per-service database isolation**
- **JWT authentication** with cookies
- **Comprehensive testing** (Jest + Supertest)
- **Docker containerization** + Kubernetes deployment

## 🌐 Endpoints

```
https://ticketing.dev/api/users    - Auth service
https://ticketing.dev/api/tickets  - Tickets service  
https://ticketing.dev/api/orders   - Orders service
https://ticketing.dev/api/payments - Payments service
https://ticketing.dev/             - Client (Next.js)
```
