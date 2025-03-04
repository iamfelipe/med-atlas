# Tech Stack & API Documentation

## 1. Tech Stack

### **Frontend**

- **Framework:** React.js (Next.js optional)
- **Language:** TypeScript
- **State Management:** Zustand (lightweight & efficient global state management)
- **Styling:** TailwindCSS + ShadCN (component library)
- **Testing:** React Testing Library, Cypress
- **Build & Deployment:** Turborepo (monorepo management), Vercel / Netlify

### **Backend**

- **Framework:** NestJS (structured, modular, and scalable)
- **Language:** TypeScript
- **Database:** PostgreSQL (with Prisma ORM)
- **Caching:** Redis (for fast data retrieval)
- **Authentication:** JWT (JSON Web Tokens) & Role-Based Access Control (RBAC)
- **Security Measures:** Input validation, encryption (AES-256), sanitization
- **Testing:** Jest & Supertest
- **Deployment:** Docker, AWS (EC2, RDS, S3, ALB)
- **Logging & Monitoring:** Winston, Datadog / Prometheus & Grafana
- **Monorepo Tooling:** Turborepo (efficient package management)

---

## 1.1 Folder Structure

```mermaid
/project-root
│
├── /apps
│ ├── /backend // NestJS application
│ └── /web // Frontend application
│
├── /packages // Shared packages and libraries
│
└── package.json
```

---

## 2. API Documentation

### **Base URL**

```console
/api/v1
```

### **Authentication**

#### **1. User Login**

**Endpoint:**

```console
POST /auth/login
```

**Request:**

```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response:**

```json
{
  "token": "jwt_token_string"
}
```

#### **2. User Logout**

**Endpoint:**

```console
POST /auth/logout
```

**Headers:**

```console
Authorization: Bearer <JWT Token>
```

**Response:**

```json
{
  "message": "Logout successful"
}
```

---

### **EHR Mappings**

#### **3. Create a New Mapping**

**Endpoint:**

```console
POST /mappings
```

**Headers:**

```console
Authorization: Bearer <JWT Token>
```

**Request:**

```json
{
  "ehr_name": "Athena",
  "question_key": "dob",
  "ehr_field": "DATE_OF_BIRTH_PATIENT"
}
```

**Response:**

```json
{
  "message": "Mapping created successfully",
  "mapping_id": 123
}
```

#### **4. Get All Mappings**

**Endpoint:**

```console
GET /mappings
```

**Headers:**

```console
Authorization: Bearer <JWT Token>
```

**Response:**

```json
[
  {
    "id": 1,
    "ehr_name": "Athena",
    "question_key": "dob",
    "ehr_field": "DATE_OF_BIRTH_PATIENT"
  },
  {
    "id": 2,
    "ehr_name": "Allscripts",
    "question_key": "dob",
    "ehr_field": "BIRTHDATE_OF_PAT"
  }
]
```

#### **5. Update a Mapping**

**Endpoint:**

```console
PUT /mappings/:id
```

**Headers:**

```console
Authorization: Bearer <JWT Token>
```

**Request:**

```json
{
  "ehr_name": "Allscripts",
  "question_key": "dob",
  "ehr_field": "BIRTHDATE_OF_PAT"
}
```

**Response:**

```json
{
  "message": "Mapping updated successfully"
}
```

#### **6. Delete a Mapping**

**Endpoint:**

```console
DELETE /mappings/:id
```

**Headers:**

```console
Authorization: Bearer <JWT Token>
```

**Response:**

```json
{
  "message": "Mapping deleted successfully"
}
```

---

### **Patient Data Submission**

#### **7. Submit Patient Data**

**Endpoint:**

```console
POST /submit
```

**Headers:**

```console
Authorization: Bearer <JWT Token>
```

**Request:**

```json
{
  "ehr_name": "Athena",
  "patient_data": {
    "dob": "1990-01-01",
    "name": "John Doe",
    "gender": "Male"
  }
}
```

**Response:**

```json
{
  "message": "Data submitted successfully",
  "ehr_response": "Success"
}
```

---

### **Performance & Scalability Enhancements**

- **Database Indexing:** Optimized PostgreSQL queries for fast lookups.
- **Caching Strategy:** Redis caching for frequently accessed mappings.
- **Load Balancing:** AWS Application Load Balancer (ALB) for API scaling.
- **Asynchronous Processing:** Message queues (RabbitMQ) for background jobs.

---

### **Security Considerations**

- **Data Encryption:** AES-256 encryption for sensitive fields.
- **API Security:** Rate limiting, input sanitization, and request validation.
- **Compliance:** HIPAA-compliant logging and access control.

---
