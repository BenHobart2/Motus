# Motus - Curitiba Transit App

Motus is a modern urban mobility application designed for Curitiba, Brazil. It integrates real-time traffic data, public transport schedules, and multimodal routing to help citizens make informed commuting decisions.

## Technical Stack
- **Backend**: .NET 10 Web API
- **Frontend**: Vanilla JS, HTML5, CSS3, Leaflet Maps
- **Database**: SQL Server (EF Core)

## Security & Deployment

> **Note on Database Security**:
> For local development, I’m using SQL Authentication, but for enterprise‑level Azure deployments I recommend Managed Identity. SQL Authentication is convenient for local use, but it requires storing usernames and passwords. Managed Identity is the cloud‑native alternative that removes credentials entirely, prevents secret leaks, integrates with Azure RBAC, and provides automatic rotation. It aligns with zero‑trust principles and is the most secure and maintainable option for production environments.
