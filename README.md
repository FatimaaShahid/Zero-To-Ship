# 🛡️ Sentinel-Sync

<div align="center">

### The Adaptive Campus Intelligence Hub

*A scalable microservices-based campus management system built with modern backend technologies.*

![Stars](https://img.shields.io/github/stars/FatimaaShahid/Zero-To-Ship?style=for-the-badge)
![Forks](https://img.shields.io/github/forks/FatimaaShahid/Zero-To-Ship?style=for-the-badge)
![Issues](https://img.shields.io/github/issues/FatimaaShahid/Zero-To-Ship?style=for-the-badge)
![License](https://img.shields.io/github/license/FatimaaShahid/Zero-To-Ship?style=for-the-badge)

</div>

---

# 📖 About the Project

**Sentinel-Sync** is a cloud-native Smart Campus Resource Management System designed using a **Microservices Architecture**. The project aims to centralize multiple university services into a single scalable platform while following industry-standard software engineering practices.

Instead of building one large monolithic application, Sentinel-Sync separates every major domain into its own independently deployable service with an isolated PostgreSQL database.

The project emphasizes:

- 🏗️ Microservices Architecture
- 🐳 Docker Containerization
- 🐘 PostgreSQL Databases
- ⚡ FastAPI Backend Services
- 🔐 Secure API Design
- 📦 Independent Database per Service
- 📈 Scalability & Maintainability

---

# 🎯 Project Goals

- Centralized campus resource management
- Independent deployable services
- Database isolation
- Clean API contracts
- Containerized development
- Production-ready architecture

---

# 🏗️ Microservices

| Service | Purpose | Database |
|----------|----------|----------|
| 👤 User Service | Authentication & Users | `user_db` |
| 🍽 Cafeteria Service | Menu & Inventory | `cafeteria_db` |
| 📚 Library Service | Books & Checkouts | `library_db` |
| 🚌 Bus Service | Routes & Live Locations | `bus_db` |
| 🔔 Notification Service | User Notifications | `notification_db` |
| 🤖 AI FAQ Service *(Phase 3)* | AI Chatbot | `chatbot_db` |

Each service owns its own database.

No service accesses another service's database directly.

---

# 🛠️ Tech Stack

## Backend

- FastAPI
- Python
- PostgreSQL
- Docker
- SQL



---


# 🚀 Development Roadmap

## ✅ Phase 1 — System Foundation *(Completed)*

This phase establishes the complete backend foundation before writing any application logic.

### Completed

- ✅ Microservice architecture finalized
- ✅ Individual PostgreSQL database for every service
- ✅ Docker container setup
- ✅ Database schema design
- ✅ Constraints & relationships
- ✅ SQL initialization scripts
- ✅ API contract documentation
- ✅ Manual test seed scripts
- ✅ Cross-service architecture planning

No backend code has been written yet.

---

# 🗄️ Databases

| Database | Port |
|----------|------|
| user_db | 5433 |
| cafeteria_db | 5434 |
| library_db | 5435 |
| bus_db | 5436 |
| chatbot_db | 5437 *(Future)* |
| notification_db | 5438 |

---

# 🐳 Running the Project

## Clone Repository

```bash
git clone https://github.com/FatimaaShahid/Zero-To-Ship.git

cd Sentinel-Sync
```

---

## Start PostgreSQL Containers

```bash
docker compose -f database/docker-compose.db.yml up -d
```

Check running containers

```bash
docker ps
```

---

## Stop Containers

```bash
docker compose -f database/docker-compose.db.yml down
```

---

## Rebuild Containers

```bash
docker compose -f database/docker-compose.db.yml down -v

docker compose -f database/docker-compose.db.yml up --build -d
```

---

# 🐘 PostgreSQL Commands

Connect to User Database

```bash
psql -h localhost -p 5433 -U postgres -d user_db
```

Connect to Cafeteria Database

```bash
psql -h localhost -p 5434 -U postgres -d cafeteria_db
```

Connect to Library Database

```bash
psql -h localhost -p 5435 -U postgres -d library_db
```

Connect to Bus Database

```bash
psql -h localhost -p 5436 -U postgres -d bus_db
```

Connect to Notification Database

```bash
psql -h localhost -p 5438 -U postgres -d notification_db
```

---

# 🧪 Database Initialization

## 👤 User Service

```bash
docker cp user_schema.sql user-postgres:/user_schema.sql
docker exec -it user-postgres psql -U postgres -d user_db
\i /user_schema.sql
```

---

## 🍽️ Cafeteria Service

```bash
docker cp cafeteria_schema.sql cafeteria-postgres:/cafeteria_schema.sql
docker exec -it cafeteria-postgres psql -U postgres -d cafeteria_db
\i /cafeteria_schema.sql
```

---

## 📚 Library Service

```bash
docker cp library_schema.sql library-postgres:/library_schema.sql
docker exec -it library-postgres psql -U postgres -d library_db
\i /library_schema.sql
```

---

## 🚌 University Bus Service

```bash
docker cp bus_schema.sql bus-postgres:/bus_schema.sql
docker exec -it bus-postgres psql -U postgres -d bus_db
\i /bus_schema.sql
```

---

## 🤖 AI Chatbot Service

```bash
docker cp chatbot_schema.sql chatbot-postgres:/chatbot_schema.sql
docker exec -it chatbot-postgres psql -U postgres -d chatbot_db
\i /chatbot_schema.sql
```

---

## 🔔 Notification Service

```bash
docker cp notification_schema.sql notification-postgres:/notification_schema.sql
docker exec -it notification-postgres psql -U postgres -d notification_db
\i /notification_schema.sql
```

---

## 📊 Event Logging Service

```bash
docker cp event_schema.sql event-postgres:/event_schema.sql
docker exec -it event-postgres psql -U postgres -d event_db
\i /event_schema.sql
```


---

# 🧪 Test Seed

run the separateseed files in the databasterminals with command :
```bash

\i /service_name_seed.sql
```

It validates:

- UNIQUE Constraints
- CHECK Constraints
- Foreign Keys
- Logical Cross-Service References
- Manual Verification Checklist

---

# 📄 API Contract

The project follows an **API-First Development** approach.

Every route is documented before implementation.

```
docs/api_contract.md
```

The API contract contains:

- Request payloads
- Response formats
- HTTP methods
- Service responsibilities
- Future event-driven architecture

---

# 🏛️ Architecture Principles

✔ Database per Microservice

✔ Independent Deployment

✔ No Shared Database

✔ API Communication Between Services

✔ Event-Driven Ready

✔ Containerized Development

✔ Scalable Infrastructure

---

# 👩‍💻 Author

# 👥 Authors

## Abdul Moazzim

**Full-Stack & Systems-Oriented Software Engineer**

Karachi, Pakistan 🇵🇰

I build production-grade web platforms using **Next.js, TypeScript, Prisma, PostgreSQL, Elasticsearch, Docker, and cloud technologies**.

Currently exploring **Kubernetes, Prometheus, Grafana, Rust, distributed systems, and scalable backend architectures**.

Passionate about understanding how computers work—from computer organization and operating systems to scalable backend engineering.

Preparing to transition into **Artificial Intelligence and Machine Learning** after building a strong foundation in:

* System Design
* Distributed Systems
* Data Structures & Algorithms
* Backend Engineering

I enjoy building real-world products rather than tutorial projects, including scalable campus platforms, SaaS applications, and intelligent resource management systems.

---

## Fatima Shahid

**Full Stack Developer | AI-ML Enthusiast | Computer Systems Engineering Undergraduate**

Karachi, Pakistan 🇵🇰

I build modern full-stack applications using **FastAPI, Django, React, Next.js, PostgreSQL, MySQL and Docker**, with a strong focus on clean architecture and scalable backend systems.

Currently expanding my expertise in **Microservices, Kubernetes, Distributed Systems, Cloud Infrastructure, and DevOps**, while strengthening my problem-solving skills through Data Structures & Algorithms.

I'm passionate about understanding how software interacts with hardware—from computer organization and operating systems to database systems, networking, and high-performance backend engineering.

My long-term goal is to transition into **Artificial Intelligence and Machine Learning** after building a solid foundation in:

* System Design
* Data Structures & Algorithms
* Backend Engineering
* Computer Systems

I enjoy building real-world software that solves practical problems, including campus management platforms, intelligent resource systems, web applications, and scalable SaaS-style products. Beyond development, I continuously learn new technologies, contribute to open-source projects, and challenge myself through competitive programming and software engineering best practices.

# 🌐 Connect With Me

<p align="center">

<a href="https://github.com/FatimaaShahid" target="_blank">
  <img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white"/>
</a>

<a href="https://www.linkedin.com/in/fatima-shahid-46723429a/" target="_blank">
  <img src="https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white"/>
</a>

<a href="mailto:fatimashahid781@gmail.com">
  <img src="https://img.shields.io/badge/Email-EA4335?style=for-the-badge&logo=gmail&logoColor=white"/>
</a>

<a href="https://leetcode.com/u/FatimaaShahid/" target="_blank">
  <img src="https://img.shields.io/badge/LeetCode-FFA116?style=for-the-badge&logo=leetcode&logoColor=black"/>
</a>

</p>

<p align="center">

<a href="https://www.hackerrank.com/" target="_blank">
  <img src="https://img.shields.io/badge/HackerRank-2EC866?style=for-the-badge&logo=hackerrank&logoColor=white"/>
</a>

<a href="https://medium.com/@fatimashahid781" target="_blank">
  <img src="https://img.shields.io/badge/Medium-12100E?style=for-the-badge&logo=medium&logoColor=white"/>
</a>

<a href="https://www.instagram.com/fatimas_abstract" target="_blank">
  <img src="https://img.shields.io/badge/Photography-E4405F?style=for-the-badge&logo=instagram&logoColor=white"/>
</a>

<a href="https://github.com/FatimaaShahid?tab=repositories" target="_blank">
  <img src="https://img.shields.io/badge/Projects-6E40C9?style=for-the-badge&logo=github&logoColor=white"/>
</a>

</p>



---

# ⭐ Future Improvements

- Kubernetes Deployment
- CI/CD Pipeline
- Prometheus Monitoring
- Grafana Dashboards
- RabbitMQ Event Bus
- Distributed Tracing
- AI Knowledge Base
- Role-Based Access Control
- Cloud Deployment

---

<div align="center">

### ⭐ If you like this project, consider giving it a star!

**Built with ❤️ using FastAPI, PostgreSQL, Docker, and Microservices**

</div>
