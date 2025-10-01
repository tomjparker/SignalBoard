SignalBoard is a full-stack TypeScript platform for unifying product feedback, external tickets, and team planning data into a single source of truth.

It integrates with systems like Azure DevOps, GitHub Issues, and Jira, pulling data in via webhooks and APIs, then merging, deduplicating, and prioritizing it.
Teams can organize all inputs into a central roadmap, apply weighted scoring to decide what matters most, and sync updates back to external systems — keeping every tool and team aligned.

Phase 0 — Scaffold (repo + plumbing)
Monorepo layout: api/, web/, prisma/, infra/.
Postgres + Prisma set up; seed script.
Express API with /healthz and /metrics (prom-client).
Vite + React (or plain JS) app served via web/ (or from Express static).

Phase 1: Core issue management:
Users can create, view, vote on, and comment on issues.
Simple board UI for browsing, filtering, and sorting issues.
Full CRUD workflow tested end-to-end via frontend and backend.

Phase 2 — Local Data Hygiene & Merging
Admin tools for cleaning and organizing data without external integrations.
Ability to merge duplicate issues and tag or close them.
Prepare schema and logic for deduplication and future external sync.

Phase 3 — External Integrations
Ingest external feeds from GitLab or Azure DevOps via APIs or webhooks.
Automatically identify duplicates between local issues and external tickets.
Keep external tickets linked and searchable in the local system.

Phase 4 — Notifications & Subscriptions
Users can subscribe to issues or roadmap items.
Notifications sent via email, Slack, or Discord for pressing updates or status changes.
Metrics for notification delivery success and latency.

Folder structure:
api/ # Backend, Express + Prisma
web/ # Frontend, (Vite + React)
prisma/ # Schema and migrations
infra/ Docker, k8s, deployment configs

docker compose -f infra/docker-compose.yml up -d  // to spin up the postgres (postgreSQL) db

npm i -D prisma
npm i @prisma/client

Browser <--(fetch)--> Vite dev server <--(proxy)--> Express API <---> Database

docker compose up -d

npx prisma migrate dev --name init
npx prisma generate

docker stop $(docker ps -q)