# Gaslighter

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-13+-336791.svg)](https://www.postgresql.org/)
[![Redis](https://img.shields.io/badge/Redis-6+-DC382D.svg)](https://redis.io/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

---

## Executive Summary

Gaslighter is an enterprise-grade, real-time Ethereum transaction and gas price alert system designed for developers, traders, and enterprises who require reliable blockchain event monitoring and instant notifications. Built with a focus on reliability, scalability, and developer experience, Gaslighter provides comprehensive monitoring of Ethereum transactions, wallet balances, token transfers, and network gas prices with zero-duplicate alert delivery.

**Key Value Propositions:**
- Real-time Ethereum monitoring with <2 second latency
- Prevents notification spam with intelligent cooldown mechanisms
- Reliable job processing with automatic retry logic
- Multi-channel alert delivery (Email, Webhooks)
- Production-ready with full audit trails and monitoring capabilities

---

## Table of Contents

- [Gaslighter](#gaslighter)
  - [Executive Summary](#executive-summary)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
    - [Alert Types](#alert-types)
    - [Core Capabilities](#core-capabilities)
  - [System Architecture](#system-architecture)
    - [High-Level Architecture Diagram](#high-level-architecture-diagram)
    - [Component Responsibilities](#component-responsibilities)
  - [Technology Stack](#technology-stack)
    - [Core Framework](#core-framework)
    - [Data Storage](#data-storage)
    - [Blockchain Integration](#blockchain-integration)
    - [Job Queue \& Background Processing](#job-queue--background-processing)
    - [Security \& Authentication](#security--authentication)
    - [Email \& Notifications](#email--notifications)
    - [Development \& Monitoring](#development--monitoring)
  - [Prerequisites](#prerequisites)
    - [System Requirements](#system-requirements)
    - [External Services](#external-services)
    - [Development Tools (Optional)](#development-tools-optional)
  - [Installation \& Setup](#installation--setup)
    - [Step 1: Clone Repository](#step-1-clone-repository)
    - [Step 2: Install Dependencies](#step-2-install-dependencies)
    - [Step 3: Environment Configuration](#step-3-environment-configuration)
    - [Step 4: Database Setup](#step-4-database-setup)
    - [Step 5: Verify Redis Connection](#step-5-verify-redis-connection)
    - [Step 6: Start the Application](#step-6-start-the-application)
    - [Expected Startup Output](#expected-startup-output)
    - [Verify Installation](#verify-installation)
  - [Configuration](#configuration)
    - [Environment Variables Reference](#environment-variables-reference)
      - [Database Configuration](#database-configuration)
      - [Redis Configuration](#redis-configuration)
      - [Blockchain Configuration](#blockchain-configuration)
      - [Security Configuration](#security-configuration)
      - [Email Configuration](#email-configuration)
      - [Application Configuration](#application-configuration)
    - [Alert Parameters](#alert-parameters)
      - [Cooldown Period](#cooldown-period)
      - [Cache Duration](#cache-duration)
    - [Production Considerations](#production-considerations)
      - [Security Best Practices](#security-best-practices)
      - [Performance Tuning](#performance-tuning)
      - [Monitoring \& Logging](#monitoring--logging)
  - [API Documentation](#api-documentation)
    - [Base URL](#base-url)
    - [Authentication](#authentication)
    - [Authentication Endpoints](#authentication-endpoints)
      - [Register User](#register-user)
      - [Login](#login)
      - [Get User Profile](#get-user-profile)
      - [Change Password](#change-password)
    - [Alert Rules Endpoints](#alert-rules-endpoints)
      - [Create Alert Rule](#create-alert-rule)
      - [List Alert Rules](#list-alert-rules)
      - [Get Alert Rule Details](#get-alert-rule-details)
      - [Update Alert Rule](#update-alert-rule)
      - [Delete Alert Rule](#delete-alert-rule)
    - [Alert History Endpoints](#alert-history-endpoints)
      - [List Alert History](#list-alert-history)
      - [Get Alert History Details](#get-alert-history-details)
    - [System Health Endpoints](#system-health-endpoints)
      - [Queue Health Status](#queue-health-status)
  - [Alert Types](#alert-types-1)
    - [Incoming ETH](#incoming-eth)
    - [Outgoing ETH](#outgoing-eth)
    - [Wallet Balance](#wallet-balance)
    - [Gas Price](#gas-price)
    - [Token Transfer](#token-transfer)
    - [Contract Interaction](#contract-interaction)
    - [Large Transaction](#large-transaction)
    - [NFT Transfer](#nft-transfer)
    - [Redis CLI Monitoring](#redis-cli-monitoring)
    - [Log Levels](#log-levels)
    - [Performance Monitoring](#performance-monitoring)
      - [Check System Load](#check-system-load)
      - [Database Queries](#database-queries)
      - [Block Processing Latency](#block-processing-latency)
  - [Troubleshooting](#troubleshooting)
    - [Issue: Workers Not Processing Jobs](#issue-workers-not-processing-jobs)
    - [Issue: Duplicate Email Alerts](#issue-duplicate-email-alerts)
    - [Issue: Database Connection Timeouts](#issue-database-connection-timeouts)
    - [Issue: Redis Connection Failed](#issue-redis-connection-failed)
    - [Issue: Email Not Sending](#issue-email-not-sending)
    - [Issue: High Memory Usage](#issue-high-memory-usage)
  - [Contributing](#contributing)
    - [Development Setup](#development-setup)
    - [Code Style](#code-style)
    - [Commit Messages](#commit-messages)
    - [Worker Concurrency](#worker-concurrency)
  - [Security Considerations](#security-considerations)
    - [Data Protection](#data-protection)
    - [API Security](#api-security)
    - [Blockchain Security](#blockchain-security)
  - [Roadmap](#roadmap)
    - [Q3 2026](#q3-2026)
    - [Q4 2026](#q4-2026)
    - [2027](#2027)
  - [License](#license)
  - [Support](#support)
    - [Getting Help](#getting-help)
    - [Reporting Issues](#reporting-issues)
    - [Feature Requests](#feature-requests)
  - [Acknowledgments](#acknowledgments)
  - [Version History](#version-history)

---

## Features

### Alert Types

Gaslighter supports 8 distinct alert types covering comprehensive blockchain monitoring scenarios:

| Alert Type | Trigger Condition | Use Case | Example |
|---|---|---|---|
| **Incoming ETH** | Transaction received to address | Monitor deposits | Alert when wallet receives ETH |
| **Outgoing ETH** | Transaction sent from address | Track withdrawals | Alert when wallet sends ETH |
| **Wallet Balance** | Balance exceeds/falls below threshold | Account monitoring | Alert when balance > 10 ETH |
| **Gas Price** | Network gas price changes | Transaction optimization | Alert when gas < 50 gwei |
| **Token Transfer** | ERC20 token movement | Asset tracking | Alert on USDC transfers |
| **Contract Interaction** | Specific contract called | DeFi monitoring | Alert on Uniswap usage |
| **Large Transaction** | High-value transaction detected | Whale watching | Alert on 100+ ETH transfers |
| **NFT Transfer** | ERC721 token movement | NFT portfolio tracking | Alert on BAYC transfers |

### Core Capabilities

**Real-Time Monitoring**
- WebSocket connection to Ethereum mainnet via Alchemy RPC
- Block-by-block transaction analysis with <2 second latency
- Automatic reconnection and checkpoint recovery

**Reliability & Durability**
- BullMQ job queue with exponential backoff retry logic
- Redis-based alert rule caching (5-minute TTL)
- Atomic database transactions for data consistency
- Complete audit trail of all triggered alerts

**Alert Management**
- Intelligent cooldown periods (1 hour default) to prevent notification spam
- Duplicate alert detection using transaction hash + rule ID combination
- RESTful API for comprehensive CRUD operations on alert rules
- User-specific alert history with filtering and pagination

**Multi-Channel Delivery**
- Email notifications with HTML templates
- Webhook integration for custom workflows
- Delivery status tracking and retry management
- Failed delivery logging and recovery

**Enterprise Features**
- JWT-based authentication with token expiration
- Role-based access control (RBAC) ready
- Comprehensive logging and monitoring
- Health check endpoints for system status
- Bull Board dashboard for queue visualization

---

## System Architecture

### High-Level Architecture Diagram



### Component Responsibilities

| Component | Responsibility | Technology |
|---|---|---|
| **Ethereum Listener** | Monitor blockchain, filter alerts, maintain cache | Node.js + ethers.js + WebSocket |
| **Worker Processes** | Process queued jobs, check conditions, save results | BullMQ + Node.js |
| **REST API** | Handle user requests, manage rules, return data | Express.js + TypeScript |
| **Data Layer** | Persist user data and alert history | PostgreSQL + TypeORM |
| **Cache Layer** | Store rules, reduce database queries | Redis |
| **Queue Layer** | Reliable job processing with retries | BullMQ + Redis |
| **Notification** | Deliver alerts to users | NodeMailer + HTTP webhooks |

---

## Technology Stack

### Core Framework
- **Runtime:** Node.js 18+ LTS
- **Language:** TypeScript 5.0+
- **API Framework:** Express.js 4.18+

### Data Storage
- **Primary Database:** PostgreSQL 13+
  - User accounts, alert rules, alert history, audit logs
- **Cache Layer:** Redis 6+
  - Alert rule caching, job queue storage, session management
- **ORM:** TypeORM 0.3+
  - Type-safe database operations, migrations, relationships

### Blockchain Integration
- **Ethereum Library:** ethers.js v6
  - Transaction parsing, balance queries, contract interaction
- **RPC Provider:** Alchemy (https://alchemy.com)
  - Mainnet WebSocket access, reliable node infrastructure

### Job Queue & Background Processing
- **Queue Framework:** BullMQ 4.11+
  - Reliable job processing, automatic retries, scheduling
- **Queue Storage:** Redis
  - In-memory job persistence, fast access

### Security & Authentication
- **Authentication:** JWT (JSON Web Tokens)
  - Stateless, scalable authentication
- **Password Hashing:** bcryptjs
  - Secure password storage with salting

### Email & Notifications
- **SMTP Client:** NodeMailer 6.9+
  - HTML email templates, HTML template compilation
- **Webhooks:** HTTP POST
  - Custom webhook integration for external systems

### Development & Monitoring
- **Logging:** Winston + Custom loggers
- **Queue Monitoring:** Bull Board
- **Code Quality:** ESLint + Prettier
- **Testing:** Jest (ready for implementation)
- **Environment Management:** dotenv

---

## Prerequisites

### System Requirements
- **Node.js:** Version 18 LTS or higher
- **npm/yarn:** Package manager
- **Operating System:** Linux, macOS, or Windows (WSL2)

### External Services
1. **PostgreSQL Database** (v13+)
   - 512MB minimum RAM
   - 1GB storage for initial setup
   - TCP connection on default port 5432

2. **Redis Server** (v6+)
   - 256MB minimum RAM
   - TCP connection on default port 6379
   - Persistence enabled (optional but recommended)

3. **Alchemy API** (Free tier available)
   - Create account at https://alchemy.com
   - Generate Ethereum Mainnet WSS endpoint
   - Daily rate limit: 300 requests per 10 seconds

### Development Tools (Optional)
- **Postman** — API testing and documentation
- **Redis CLI** — Redis command-line interface
- **psql** — PostgreSQL command-line client
- **Docker** — Containerization (optional)

---

## Installation & Setup

### Step 1: Clone Repository

```bash
git clone https://github.com/yourusername/gaslighter.git
cd gaslighter
```

### Step 2: Install Dependencies

```bash
npm install
```

Or with yarn:
```bash
yarn install
```

### Step 3: Environment Configuration

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# ============================================
# DATABASE CONFIGURATION
# ============================================
DATABASE_URL=postgresql://user:password@localhost:5432/gaslighter
DATABASE_LOGGING=false
DATABASE_SYNCHRONIZE=false

# ============================================
# REDIS CONFIGURATION
# ============================================
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0

# ============================================
# BLOCKCHAIN CONFIGURATION
# ============================================
ALCHEMY_WSS=wss://eth-mainnet.g.alchemy.com/v2/YOUR_API_KEY_HERE
ALCHEMY_HTTP=https://eth-mainnet.g.alchemy.com/v2/YOUR_API_KEY_HERE

# ============================================
# JWT CONFIGURATION
# ============================================
JWT_SECRET=your_super_secret_key_change_in_production
JWT_EXPIRY=24h

# ============================================
# EMAIL CONFIGURATION (Gmail SMTP)
# ============================================
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_specific_password
SMTP_FROM=noreply@gaslighter.io
SMTP_FROM_NAME=Gaslighter Alerts

# ============================================
# APPLICATION CONFIGURATION
# ============================================
APP_NAME=Gaslighter
APP_VERSION=1.0.0
PORT=3000
NODE_ENV=development
LOG_LEVEL=info

# ============================================
# ALERT CONFIGURATION
# ============================================
ALERT_COOLDOWN_MS=3600000
CACHE_TTL_SECONDS=300
```

### Step 4: Database Setup

Create PostgreSQL database:

```bash
createdb gaslighter
```

Run migrations:

```bash
npm run typeorm migration:run
```

Or synchronize schema (development only):

```bash
npm run typeorm schema:sync
```

Seed initial data:

```bash
npm run seed
```

### Step 5: Verify Redis Connection

```bash
redis-cli ping
# Should return: PONG
```

### Step 6: Start the Application

```bash
npm run dev
```

### Expected Startup Output

### Verify Installation

Test the health endpoint:

```bash
curl http://localhost:3000/health/queue
```

Expected response:
```json
{
  "success": true,
  "timestamp": "2026-05-26T09:35:43.297Z",
  "queues": {
    "incomingEth": {
      "counts": {
        "waiting": 0,
        "active": 0,
        "completed": 0,
        "failed": 0
      }
    }
  }
}
```

---

## Configuration

### Environment Variables Reference

#### Database Configuration
- `DATABASE_URL` - Full PostgreSQL connection string
- `DATABASE_LOGGING` - Enable TypeORM query logging (true/false)
- `DATABASE_SYNCHRONIZE` - Auto-sync schema (development only)

#### Redis Configuration
- `REDIS_HOST` - Redis server hostname
- `REDIS_PORT` - Redis server port (default: 6379)
- `REDIS_PASSWORD` - Redis authentication password (if required)
- `REDIS_DB` - Redis database number (default: 0)

#### Blockchain Configuration
- `ALCHEMY_WSS` - Alchemy WebSocket endpoint (wss://...)
- `ALCHEMY_HTTP` - Alchemy HTTP endpoint (https://...)

#### Security Configuration
- `JWT_SECRET` - Secret key for JWT signing (min 32 characters)
- `JWT_EXPIRY` - Token expiration duration (e.g., "24h", "7d")

#### Email Configuration
- `SMTP_HOST` - SMTP server hostname
- `SMTP_PORT` - SMTP server port (typically 587 for TLS)
- `SMTP_USER` - SMTP authentication username
- `SMTP_PASS` - SMTP authentication password
- `SMTP_FROM` - Sender email address
- `SMTP_FROM_NAME` - Sender display name

#### Application Configuration
- `APP_NAME` - Application display name
- `PORT` - Express server port (default: 3000)
- `NODE_ENV` - Environment (development/staging/production)
- `LOG_LEVEL` - Logging level (debug/info/warn/error)

### Alert Parameters

#### Cooldown Period
Prevents alert spam by enforcing minimum time between notifications for the same rule.

```typescript
// Default: 1 hour
ALERT_COOLDOWN_MS=3600000
```

To change to 30 minutes:
```env
ALERT_COOLDOWN_MS=1800000
```

#### Cache Duration
Alert rules are cached to reduce database queries.

```typescript
// Default: 5 minutes
CACHE_TTL_SECONDS=300
```

To change to 15 minutes:
```env
CACHE_TTL_SECONDS=900
```

### Production Considerations

#### Security Best Practices
1. **JWT Secret** - Generate using: `openssl rand -base64 32`
2. **Database** - Use strong passwords, restrict network access
3. **Redis** - Enable password authentication, use TLS in production
4. **SMTP** - Use app-specific passwords, never commit credentials
5. **Environment** - Use secrets management (AWS Secrets Manager, HashiCorp Vault)

#### Performance Tuning
```env
# Increase worker concurrency
WORKER_CONCURRENCY=10

# Optimize queue processing
QUEUE_MAX_RETRIES=5
QUEUE_RETRY_DELAY=2000

# Cache management
CACHE_TTL_SECONDS=900
```

#### Monitoring & Logging
```env
LOG_LEVEL=info
DATABASE_LOGGING=false  # Enable for debugging only
NODE_ENV=production
```

---

## API Documentation

### Base URL


Obtain a token by logging in first.

### Authentication

All protected endpoints require a valid JWT token in the Authorization header:


### Authentication Endpoints

#### Register User

Create a new user account.

```http
POST /auth/register
Content-Type: application/json

{
  "username": "alex_dev",
  "email": "alex@example.com",
  "password": "SecurePassword123!"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "dd9d581f-4a2e-44c0-9a9e-a9027505a520",
    "username": "alex_dev",
    "email": "alex@example.com",
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "createdDate": "2026-05-19T11:35:58.589Z"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "User with this email already exists"
}
```

---

#### Login

Authenticate with existing credentials.

```http
POST /auth/login
Content-Type: application/json

{
  "email": "alex@example.com",
  "password": "SecurePassword123!"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 86400,
    "user": {
      "id": "dd9d581f-4a2e-44c0-9a9e-a9027505a520",
      "username": "alex_dev",
      "email": "alex@example.com"
    }
  }
}
```

---

#### Get User Profile

Retrieve authenticated user's profile information.

```http
GET /auth/profile
Authorization: Bearer {accessToken}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "dd9d581f-4a2e-44c0-9a9e-a9027505a520",
    "username": "alex_dev",
    "email": "alex@example.com",
    "createdDate": "2026-05-19T11:35:58.589Z",
    "lastUpdate": "2026-05-19T11:35:58.768Z",
    "isDeleted": false
  }
}
```

---

#### Change Password

Update user password securely.

```http
POST /auth/change-password
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "currentPassword": "OldPassword123!",
  "newPassword": "NewPassword456!",
  "confirmPassword": "NewPassword456!"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

---

### Alert Rules Endpoints

#### Create Alert Rule

Create a new alert rule for monitoring.

```http
POST /alerts/rules
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "alertType": "incoming_eth",
  "targetAddress": "0xdf56bab8ebf10455d821252e5a33103b61809429",
  "status": "greater_than",
  "thresholdValue": "1000000000000000000",
  "notificationType": "email"
}
```

**Parameters:**
- `alertType` (string) - Type of alert (incoming_eth, outgoing_eth, wallet_balance, gas_price, etc.)
- `targetAddress` (string) - Ethereum address to monitor (0x...)
- `status` (string) - Comparison operator (greater_than, less_than, equals)
- `thresholdValue` (string) - Value in wei (for balance/gas alerts)
- `notificationType` (string) - Notification channel (email, webhook)

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": 15,
    "alertType": "incoming_eth",
    "targetAddress": "0xdf56bab8ebf10455d821252e5a33103b61809429",
    "status": "greater_than",
    "thresholdValue": "1000000000000000000",
    "notificationType": "email",
    "isActive": true,
    "createdDate": "2026-05-20T09:23:47.478Z"
  }
}
```

---

#### List Alert Rules

Retrieve all alert rules for authenticated user with pagination.

```http
GET /alerts/rules?page=1&limit=10&isActive=true
Authorization: Bearer {accessToken}
```

**Query Parameters:**
- `page` (number) - Page number (default: 1)
- `limit` (number) - Results per page (default: 10)
- `isActive` (boolean) - Filter by active status (optional)
- `alertType` (string) - Filter by alert type (optional)

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "rules": [
      {
        "id": 15,
        "alertType": "incoming_eth",
        "targetAddress": "0xdf56bab8ebf10455d821252e5a33103b61809429",
        "status": "greater_than",
        "thresholdValue": "1000000000000000000",
        "notificationType": "email",
        "isActive": true,
        "createdDate": "2026-05-20T09:23:47.478Z"
      }
    ],
    "total": 4,
    "page": 1,
    "limit": 10
  }
}
```

---

#### Get Alert Rule Details

Retrieve specific alert rule by ID.

```http
GET /alerts/rules/:ruleId
Authorization: Bearer {accessToken}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 15,
    "user": {
      "id": "dd9d581f-4a2e-44c0-9a9e-a9027505a520",
      "username": "alex_dev",
      "email": "alex.johnson@example.com"
    },
    "alertType": "incoming_eth",
    "targetAddress": "0xdf56bab8ebf10455d821252e5a33103b61809429",
    "status": "greater_than",
    "thresholdValue": "1000000000000000000",
    "notificationType": "email",
    "webhookUrl": null,
    "isActive": true,
    "createdDate": "2026-05-20T09:23:47.478Z"
  }
}
```

---

#### Update Alert Rule

Modify existing alert rule parameters.

```http
PUT /alerts/rules/:ruleId
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "status": "less_than",
  "thresholdValue": "500000000000000000",
  "notificationType": "webhook",
  "webhookUrl": "https://example.com/webhook",
  "isActive": true
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 15,
    "status": "less_than",
    "thresholdValue": "500000000000000000",
    "notificationType": "webhook",
    "webhookUrl": "https://example.com/webhook",
    "isActive": true
  }
}
```

---

#### Delete Alert Rule

Remove alert rule permanently.

```http
DELETE /alerts/rules/:ruleId
Authorization: Bearer {accessToken}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Alert rule deleted successfully"
}
```

---

### Alert History Endpoints

#### List Alert History

Retrieve triggered alerts with filtering and pagination.

```http
GET /alerts/history?page=1&limit=20&ruleId=15&status=sent&startDate=2026-05-01&endDate=2026-05-31
Authorization: Bearer {accessToken}
```

**Query Parameters:**
- `page` (number) - Page number (default: 1)
- `limit` (number) - Results per page (default: 20)
- `ruleId` (number) - Filter by rule ID (optional)
- `status` (string) - Filter by status: sent, pending, failed (optional)
- `startDate` (string) - Start date (ISO format, optional)
- `endDate` (string) - End date (ISO format, optional)

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "history": [
      {
        "id": 42,
        "ruleId": 15,
        "ruleName": "Alert on 0xdf56bab8... receiving ETH",
        "triggeredAt": "2026-05-22T09:02:49.840Z",
        "deliveryStatus": "sent",
        "deliveryAttempts": 1,
        "eventData": {
          "from": "0xfF21C002DC85B87D54e71748A26DC3Ef514D38b0",
          "to": "0xdf56bab8ebf10455d821252e5a33103b61809429",
          "amount": "2.5",
          "txHash": "0x04501a2b58ae84a48afa5b83c6e33cd7ff779c2534809b5367a764a80ae4c53b",
          "blockNumber": 10896844
        }
      }
    ],
    "total": 145,
    "page": 1,
    "limit": 20
  }
}
```

---

#### Get Alert History Details

Retrieve specific alert history record.

```http
GET /alerts/history/:historyId
Authorization: Bearer {accessToken}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 42,
    "alertRule": {
      "id": 15,
      "targetAddress": "0xdf56bab8ebf10455d821252e5a33103b61809429",
      "alertRuleStatus": "greater_than",
      "thresholdValue": "1000000000000000000"
    },
    "triggeredAt": "2026-05-22T09:02:49.840Z",
    "deliveryStatus": "sent",
    "deliveryAttempts": 1,
    "deliveredAt": "2026-05-22T09:02:50.123Z",
    "eventData": {
      "from": "0xfF21C002DC85B87D54e71748A26DC3Ef514D38b0",
      "to": "0xdf56bab8ebf10455d821252e5a33103b61809429",
      "amount": "2.5",
      "txHash": "0x04501a2b58ae84a48afa5b83c6e33cd7ff779c2534809b5367a764a80ae4c53b",
      "blockNumber": 10896844
    }
  }
}
```

---

### System Health Endpoints

#### Queue Health Status

Monitor job queue status across all alert types.

```http
GET /health/queue
```

**Response (200 OK):**
```json
{
  "success": true,
  "timestamp": "2026-05-26T09:35:43.297Z",
  "queues": {
    "incomingEth": {
      "counts": {
        "waiting": 0,
        "active": 0,
        "completed": 147,
        "failed": 0,
        "delayed": 0,
        "paused": 0
      },
      "recentJobs": [
        {
          "id": "incoming-19234567-1715516543000",
          "state": "completed",
          "progress": 100,
          "timestamp": 1715516543000,
          "attempts": 1
        }
      ]
    },
    "outgoingEth": {
      "counts": {
        "waiting": 0,
        "active": 0,
        "completed": 23,
        "failed": 0
      }
    },
    "gasPrice": {
      "counts": {
        "waiting": 0,
        "active": 0,
        "completed": 456,
        "failed": 0
      }
    }
  }
}
```

---

## Alert Types

### Incoming ETH

**Purpose:** Monitor when a wallet receives Ethereum transactions.

**Configuration:**
```json
{
  "alertType": "incoming_eth",
  "targetAddress": "0xdf56bab8ebf10455d821252e5a33103b61809429",
  "notificationType": "email"
}
```

**Alert Trigger:** Every incoming transaction to the specified address

**Event Data Returned:**
```json
{
  "from": "0xfF21C002DC85B87D54e71748A26DC3Ef514D38b0",
  "to": "0xdf56bab8ebf10455d821252e5a33103b61809429",
  "amount": "2.5",
  "txHash": "0x04501a2b58ae84a48afa5b83c6e33cd7ff779c2534809b5367a764a80ae4c53b",
  "blockNumber": 10896844
}
```

---

### Outgoing ETH

**Purpose:** Monitor when a wallet sends Ethereum transactions.

**Configuration:**
```json
{
  "alertType": "outgoing_eth",
  "targetAddress": "0xdf56bab8ebf10455d821252e5a33103b61809429",
  "notificationType": "email"
}
```

**Alert Trigger:** Every outgoing transaction from the specified address

**Use Cases:**
- Track fund withdrawals
- Monitor trading activities
- Detect unauthorized transfers

---

### Wallet Balance

**Purpose:** Alert when wallet balance crosses defined thresholds.

**Configuration:**
```json
{
  "alertType": "wallet_balance",
  "targetAddress": "0xdf56bab8ebf10455d821252e5a33103b61809429",
  "status": "greater_than",
  "thresholdValue": "1000000000000000000",
  "notificationType": "email"
}
```

**Conditions:**
- `greater_than` - Alert when balance exceeds threshold
- `less_than` - Alert when balance drops below threshold
- `equals` - Alert when balance equals threshold

**Alert Trigger:** Every 12 seconds (when new block arrives)

**Use Cases:**
- Monitor account health
- Alert on low balance
- Detect large deposits

---

### Gas Price

**Purpose:** Monitor network gas prices and alert on changes.

**Configuration:**
```json
{
  "alertType": "gas_price",
  "status": "less_than",
  "thresholdValue": "50000000000",
  "notificationType": "email"
}
```

**Conditions:**
- `greater_than` - Alert when gas price exceeds threshold
- `less_than` - Alert when gas price drops below threshold

**Unit:** Wei (threshold in wei, displayed as gwei)

**Alert Trigger:** Every 12 seconds (when new block arrives)

**Use Cases:**
- Optimize transaction timing
- Detect gas price spikes
- Execute trades when gas is cheap

---

### Token Transfer

**Purpose:** Monitor ERC20 token movements for specific tokens.

**Configuration:**
```json
{
  "alertType": "token_transfer",
  "targetAddress": "0xdf56bab8ebf10455d821252e5a33103b61809429",
  "tokenAddress": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
  "transferDirection": "both",
  "notificationType": "email"
}
```

**Transfer Direction:**
- `in` - Alert on inbound transfers
- `out` - Alert on outbound transfers
- `both` - Alert on all transfers

**Use Cases:**
- Track stablecoin movements (USDC, USDT)
- Monitor token balances
- Detect token transfers

---

### Contract Interaction

**Purpose:** Alert when specific smart contracts are called.

**Configuration:**
```json
{
  "alertType": "contract_interaction",
  "targetAddress": "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
  "notificationType": "email"
}
```

**Alert Trigger:** When target contract receives any transaction

**Use Cases:**
- Monitor DEX usage (Uniswap, SushiSwap)
- Track lending protocol interactions (Aave, Compound)
- Detect oracle updates

---

### Large Transaction

**Purpose:** Alert when high-value transactions occur on the network.

**Configuration:**
```json
{
  "alertType": "large_transaction",
  "status": "greater_than",
  "thresholdValue": "100000000000000000000",
  "monitorDirection": "both",
  "notificationType": "email"
}
```

**Monitor Direction:**
- `in` - Inbound transfers only
- `out` - Outbound transfers only
- `both` - All large transactions

**Use Cases:**
- Detect whale movements
- Monitor market-moving transactions
- Identify large stake migrations

---

### NFT Transfer

**Purpose:** Monitor ERC721 NFT movements.

**Configuration:**
```json
{
  "alertType": "nft_transfer",
  "targetAddress": "0x1A92de640f7E0a0Fb7ef3B33B3d246FD3F2EADC7",
  "nftContractAddress": "0xbc4ca0eda7647a8ab7c2061c2e2ad88f2a4c1985",
  "transferDirection": "both",
  "notificationType": "email"
}
```

**Use Cases:**
- Track NFT portfolio changes
- Monitor BAYC/MAYC transfers
- Alert on high-value NFT sales

---

### Redis CLI Monitoring

Check queue status directly in Redis:

```bash
# Connect to Redis
redis-cli

# View all bull queues
KEYS "bull:*"

# Check incoming ETH queue
HGETALL "bull:incoming_eth_queue"

# View pending jobs
ZRANGE "bull:incoming_eth_queue:wait" 0 -1

# Get job data
HGETALL "bull:incoming_eth_queue:19234567"

# Check failed jobs
ZRANGE "bull:incoming_eth_queue:failed" 0 -1

# Clear a queue (careful!)
DEL "bull:incoming_eth_queue:*"
```

### Log Levels

Configure logging verbosity in `.env`:

```env
LOG_LEVEL=debug   # All messages (development)
LOG_LEVEL=info    # Info, warn, error (recommended)
LOG_LEVEL=warn    # Warnings and errors only
LOG_LEVEL=error   # Errors only (production)
```

### Performance Monitoring

#### Check System Load

```bash
# Monitor CPU and memory
top -p $(pgrep -f "node.*index.js")

# Watch queue growth
watch 'redis-cli --csv ZCARD bull:incoming_eth_queue:wait'
```

#### Database Queries

Enable query logging for troubleshooting:

```env
DATABASE_LOGGING=true
```

**WARNING:** Only for development. Disable in production.

#### Block Processing Latency

Monitor time from block arrival to alert delivery:

1. Note block timestamp in logs
2. Check when alert was created in database
3. Calculate: `alert.triggeredAt - block.timestamp`

Target: < 2 seconds

---

## Troubleshooting

### Issue: Workers Not Processing Jobs

**Symptoms:**
- Jobs accumulating in queue
- Zero "completed" or "active" jobs
- No processing logs

**Diagnosis:**
```bash
# Check if workers are running
ps aux | grep "node"

# Verify Redis connection
redis-cli ping
# Should return: PONG

# Check queue status
curl http://localhost:3000/health/queue
```

**Solutions:**

1. **Verify worker imports** — Check that workers are imported in `src/index.ts`:
```typescript
import './workers';  // Must be at the top
```

2. **Check Redis connection** — Ensure Redis is running:
```bash
redis-cli PING
# Output: PONG
```

3. **Restart application:**
```bash
npm run dev
```

4. **Check for errors** — Look for "Worker ERROR" messages in logs

---

### Issue: Duplicate Email Alerts

**Symptoms:**
- Users receiving multiple emails for same transaction
- Alert history shows duplicate entries

**Root Causes:**
1. Block processed multiple times
2. Listener queuing same job twice
3. Cooldown period too short

**Solutions:**

1. **Verify unique job IDs:**
```typescript
// Ensure jobId includes timestamp
const jobId = `incoming-${blockNumber}-${Date.now()}`;
```

2. **Check for multiple listeners:**
```bash
# Should see only one block listener
grep -n "provider.on" src/services/ethereum-listener.service.ts
```

3. **Increase cooldown period:**
```env
ALERT_COOLDOWN_MS=3600000  # 1 hour (default)
```

4. **Verify database constraints:**
```sql
-- Check for duplicate alert histories
SELECT alertRuleId, eventData->>'txHash', COUNT(*)
FROM alert_history
GROUP BY alertRuleId, eventData->>'txHash'
HAVING COUNT(*) > 1;
```

---

### Issue: Database Connection Timeouts

**Symptoms:**
- Error: "connect ECONNREFUSED 127.0.0.1:5432"
- Queries timing out after 30 seconds

**Diagnosis:**
```bash
# Test PostgreSQL connection
psql -U user -d gaslighter -h localhost
```

**Solutions:**

1. **Verify PostgreSQL is running:**
```bash
# macOS
brew services list | grep postgres

# Linux
sudo systemctl status postgresql
```

2. **Check connection string:**
```env
# Format: postgresql://username:password@host:port/database
DATABASE_URL=postgresql://user:password@localhost:5432/gaslighter
```

3. **Verify database exists:**
```bash
createdb gaslighter
```

4. **Check firewall rules:**
```bash
# Test connection
telnet localhost 5432
```

---

### Issue: Redis Connection Failed

**Symptoms:**
- Error: "connect ECONNREFUSED 127.0.0.1:6379"
- Queue operations failing
- Cache not working

**Diagnosis:**
```bash
# Test Redis connection
redis-cli ping
# Should return: PONG

# Check Redis info
redis-cli INFO server
```

**Solutions:**

1. **Start Redis:**
```bash
# macOS
brew services start redis

# Linux
sudo systemctl start redis-server

# Docker
docker run -d -p 6379:6379 redis:latest
```

2. **Verify configuration:**
```env
REDIS_HOST=localhost
REDIS_PORT=6379
```

3. **Check port availability:**
```bash
# See what's using port 6379
lsof -i :6379
```

---

### Issue: Email Not Sending

**Symptoms:**
- Alerts not triggering emails
- Error: "Failed to send email"
- "Invalid login" errors

**Diagnosis:**
```bash
# Test SMTP connection
telnet smtp.gmail.com 587

# Check credentials in env file
grep SMTP .env
```

**Solutions:**

1. **Verify Gmail app password** (not regular password):
   - Go to https://myaccount.google.com/security
   - Enable 2-Factor Authentication
   - Generate "App Password"
   - Use this in `SMTP_PASS`

2. **Check email configuration:**
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_specific_password  # Not your regular password!
```

3. **Test email manually:**
```typescript
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  auth: {
    user: 'your_email@gmail.com',
    pass: 'your_app_password'
  }
});

transporter.sendMail({
  from: 'noreply@gaslighter.io',
  to: 'recipient@example.com',
  subject: 'Test Email',
  text: 'This is a test'
}, (err, info) => {
  if (err) console.error('Error:', err);
  else console.log('Success:', info);
});
```

---

### Issue: High Memory Usage

**Symptoms:**
- Process using > 500MB RAM
- Gradual memory increase over time
- Application becomes slow

**Diagnosis:**
```bash
# Monitor memory in real-time
node --inspect src/index.ts
# Then visit chrome://inspect
```

**Solutions:**

1. **Check for memory leaks:**
   - Large alert rule arrays cached indefinitely
   - Event listeners not cleaned up

2. **Clear old job data:**
```bash
redis-cli
# Remove completed jobs older than 24 hours
ZREMRANGEBYSCORE bull:incoming_eth_queue:completed 0 (Date.now() - 86400000)
```

3. **Restart application** (temporary fix):
```bash
npm run dev
```

---

## Contributing

### Development Setup

```bash
# Clone repository
git clone https://github.com/yourusername/gaslighter.git
cd gaslighter

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your values

# Start development server
npm run dev
```

### Code Style

We use ESLint and Prettier for consistent code formatting.

```bash
# Check code style
npm run lint

# Fix code style
npm run lint:fix

# Format code
npm run format
```

### Commit Messages

Follow conventional commits format:


### Worker Concurrency

Adjust worker concurrency based on system resources:

```typescript
// Default: 1 worker processing jobs sequentially
// For higher throughput, increase concurrency:
{
  concurrency: 5  // Process 5 jobs in parallel
}
```

---

## Security Considerations

### Data Protection

- **Passwords:** Hashed with bcryptjs (10 salt rounds)
- **Tokens:** JWT signed with secret key
- **Database:** PostgreSQL with SSL support
- **Secrets:** Environment variables (never committed)

### API Security

- JWT-based authentication on all protected endpoints
- Rate limiting on authentication endpoints (recommended)
- CORS configured for production
- Input validation on all endpoints

### Blockchain Security

- RPC queries read-only (no transaction signing)
- Webhook URLs validated before saving
- Transaction hash verified for duplicate detection
- Alert conditions validated before alert creation

---

## Roadmap

### Q3 2026
- [ ] Multi-chain support (Polygon, Arbitrum, Optimism)
- [ ] SMS notifications via Twilio
- [ ] Telegram bot integration
- [ ] Advanced analytics dashboard

### Q4 2026
- [ ] Custom alert condition logic (AND/OR operators)
- [ ] Batch email digests
- [ ] Mobile app (iOS/Android)
- [ ] GraphQL API

### 2027
- [ ] Machine learning for anomaly detection
- [ ] Portfolio performance tracking
- [ ] DeFi protocol integration (Uniswap, Aave, Curve)
- [ ] Enterprise features (SSO, audit logs)

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Support

### Getting Help

- **Documentation:** https://docs.gaslighter.io
- **GitHub Issues:** https://github.com/yourusername/gaslighter/issues
- **Email:** support@gaslighter.io
- **Discord:** [Join Community](https://discord.gg/gaslighter)
- **Twitter:** [@GaslighterApp](https://twitter.com/GaslighterApp)

### Reporting Issues

When reporting issues, please include:

1. Operating system and Node.js version
2. Steps to reproduce the issue
3. Expected behavior vs actual behavior
4. Relevant logs (without credentials)
5. Your `.env` configuration (sanitized)

### Feature Requests

Please open GitHub discussions for feature requests rather than issues. Include:

1. Use case and motivation
2. Expected behavior
3. Potential implementation approach
4. Alternative solutions considered

---

## Acknowledgments

- [ethers.js](https://docs.ethers.org/) - Ethereum library
- [BullMQ](https://docs.bullmq.io/) - Job queue system
- [TypeORM](https://typeorm.io/) - Database ORM
- [Express.js](https://expressjs.com/) - Web framework
- [Alchemy](https://alchemy.com/) - RPC infrastructure

---

## Version History

| Version | Release Date | Changes |
|---------|---|---|
| 1.0.0 | 2026-05-26 | Initial release with 8 alert types, queue system, caching |
| 0.2.0 | 2026-05-20 | Beta: Worker processes, email notifications |
| 0.1.0 | 2026-05-15 | Alpha: Basic listener, REST API |

---

**Made with ❤️ by the Gaslighter Team**