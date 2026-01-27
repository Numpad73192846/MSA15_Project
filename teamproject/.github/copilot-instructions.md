# Copilot Instructions for MSA15 Project

## Project Overview
This is a Spring Boot 3.5.10 based project using Java 23. It follows a standard Layered Architecture (Controller-Service-Mapper-DTO).

## Core Architecture & Patterns
- **Framework**: Spring Boot 3.x, Spring Security 6, Thymeleaf.
- **Persistence**: **MyBatis** is used for DB access.
  - Mapper interfaces in `com.aloha.teamproject.mapper`.
  - SQL XMLs in `src/main/resources/com/aloha/teamproject/mapper/`.
  - Global configuration: `map-underscore-to-camel-case=true` is enabled.
- **Data Flow**: `Controller` -> `Service (Interface/Impl)` -> `Mapper (Interface/XML)` -> `DTO`.
- **Boilerplate**: **Lombok** is heavily used. Use `@Data`, `@NoArgsConstructor`, `@AllArgsConstructor`, and especially `@RequiredArgsConstructor` for constructor injection.
- **Security**: Password hashing is handled via `BCryptPasswordEncoder` in `UserServiceImpl`.

## Critical Files & Directories
- **Config**: `src/main/java/com/aloha/teamproject/config/` (Security, Swagger).
- **Mappers**: `src/main/java/com/aloha/teamproject/mapper/` (Interfaces) and `src/main/resources/com/aloha/teamproject/mapper/` (XMLs).
- **DTOs**: `com.aloha.teamproject.dto` - Used for both DB mapping and API models.
- **Database**: `SQL/` directory contains `DDL.sql` and `data.sql`.

## Coding Conventions
- **Naming**: Use `CamelCase` for Java classes/methods, `snake_case` for database columns (mapped via MyBatis).
- **Error Handling**: Use `try-catch` in Services or let exceptions propagate to a Global Exception Handler if implemented.
- **SQL**: Write SQL in XML files rather than using MyBatis annotations for complex queries.
- **DI**: Prefer constructor injection via `@RequiredArgsConstructor`.

## Development Workflow
- **Build/Run**: use `./gradlew bootRun` for local development.
- **Database**: MySQL setup required as per `application.properties`.
- **API Docs**: Swagger UI is available at `/swagger-ui/index.html`.

## Common Tasks Examples
### Adding a new feature
1. Define DTO in `dto/`.
2. Create/Update SQL in `SQL/DDL.sql`.
3. Add Mapper interface and XML entry.
4. Implement Logic in Service interface and Impl.
5. Create Controller endpoint.
