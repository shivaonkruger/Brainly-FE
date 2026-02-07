# Second Brain App — Development Context

This document contains the working context for building the full application.

The backend will be developed manually (self-implemented), while the frontend IDE (Antigravity / v0 pipeline) will be used primarily for UI generation, refactoring, and iteration.

---

# PART 1 — FRONTEND IDE CONTEXT (Antigravity + v0 Flow)

## Objective

Use Antigravity as a UI engineering environment, not as the system architect.

Workflow:

1. Generate UI context from v0.
2. Transfer UI structure into Antigravity.
3. Refactor and structure components inside the workspace.
4. Continue UI development after backend endpoints are stable.

Antigravity is responsible for:

* component structuring
* styling
* state wiring
* UI refactoring
* layout system

NOT responsible for:

* backend logic
* API architecture decisions
* data model design

---

## App Identity

Type: Personal knowledge / second-brain system

Primary function:
Users store internet content and attach their thinking to it.

This is NOT a bookmarking tool.
This is a cognition system.

---

## Frontend Core Screens

### 1. Authentication

* Signup
* Signin

### 2. Main Dashboard

* content feed
* add content entry

### 3. Add Content Flow

Inputs:

* title
* link
* description (notes)
* sourceType

### 4. Content Feed

Each item:

* title
* link source
* user notes preview
* timestamp

---

## Frontend Philosophy

* fast capture
* minimal friction
* thinking-first design
* no clutter

---

# PART 2 — BACKEND CONTEXT (Primary Development Area)

Backend is being built manually and incrementally.

Stack:

* TypeScript
* Express
* MongoDB
* JWT authentication

Current implemented modules:

## Authentication

### Signup

POST /api/signup

Creates user:

* username
* password

### Signin

POST /api/signin

Returns:

* JWT token

---

## Content Module

### Add Content

POST /api/content

Protected route.

Fields:

* title
* link
* description
* sourceType

Ownership:

* linked to userId from JWT

---

### Fetch User Content

GET /api/content

Returns:

* all content belonging to authenticated user
* sorted by createdAt (newest first)

---

# BACKEND DEVELOPMENT PRINCIPLES

1. Build feature-by-feature, not system-wide abstractions.
2. Keep routes thin, move logic gradually into controllers/services.
3. Avoid premature optimization.
4. Keep schema evolution flexible.
5. Auth always precedes feature expansion.

---

# NEXT BACKEND MILESTONES

These will be implemented sequentially:

1. Edit content
2. Delete content
3. Tagging system
4. Search capability
5. Collections / folders
6. Semantic search (vector embeddings)
7. AI-assisted recall

---

# DATA MODEL DIRECTION

## User

* username
* password

## Content

* userId
* title
* link
* description
* sourceType
* createdAt

Future additions:

* tags
* embeddings
* collections

---

# ARCHITECTURAL TRAJECTORY

Phase 1:

* CRUD foundation
* auth stabilization

Phase 2:

* knowledge structuring

Phase 3:

* intelligence layer
* AI recall
* semantic navigation

---

# ROLE SPLIT

Frontend IDE:

* layout
* UI evolution
* interaction layer

Backend (manual build):

* domain logic
* data modeling
* API contracts
* auth
* knowledge architecture

---

# GUIDING IDEA

The system stores:
"what the user thought about what they consumed."

Not content.
Not bookmarks.
Not files.

Cognition.

That is the core product.
