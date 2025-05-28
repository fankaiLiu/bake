# ⚠️ Work in Progress - Not Ready for Use

**This project is currently under active development and is not ready for production use. Many features are incomplete or unstable.**

---

# Bake - AI/LLM-Friendly Full-Stack Framework

[中文](README.zh.md) | **English**

Bake is a modern full-stack development framework designed to be AI and LLM-friendly, featuring a Rust backend with React frontend. The project aims to provide a seamless development experience for building AI-powered applications.

## Architecture

- **Backend**: Rust with Workspace architecture
- **Frontend**: React with modern tooling
- **Design Philosophy**: AI/LLM-friendly development patterns

## Backend Structure

The backend is built using Rust Workspace architecture for better modularity and dependency management.

### Project Structure

```
crates/
├── api/           # HTTP API server
├── business_modules/        # Main business logic development area
├── common/        # Shared types and utilities
├── config/        # Configuration management
├── infrastructure/ # Database and infrastructure
└── platform_services/       # Platform engineering (community maintained)
```

### Module Overview

#### api
- **Purpose**: HTTP API server providing REST endpoints
- **Dependencies**: common, config
- **Entry Point**: `src/main.rs`

#### business_modules
- **Purpose**: Main business logic development area for custom application features
- **Features**: 
  - Primary development workspace after git clone
  - Custom business logic implementation
  - Application-specific modules

#### common
- **Purpose**: Shared types, error handling, and utility functions
- **Features**: 
  - Unified error type definitions
  - Common data structures
  - Utility functions

#### config
- **Purpose**: Configuration management module
- **Features**: 
  - Application configuration structure definitions
  - Configuration loading and validation

#### infrastructure
- **Purpose**: Database and infrastructure components
- **Features**: 
  - Database connections and operations
  - Redis integration
  - Infrastructure utilities

#### platform_services
- **Purpose**: Platform engineering module (community maintained)
- **Features**: 
  - System management and administration
  - User management system
  - Role-based access control (RBAC)
  - Permission management
  - Core platform functionalities

## Frontend Structure

The frontend is built with React and modern tooling for a responsive user experience.

### Frontend Features

- **Framework**: React with TypeScript
- **Build Tool**: Rsbuild for fast development
- **UI Components**: Modern component library
- **Routing**: File-based routing system
- **Authentication**: Built-in auth context and protected routes

## Development Commands

```bash
# Check all projects
cargo check

# Run API server
cargo run --bin bake-api

# Run tests
cargo test

# Build release version
cargo build --release

# Frontend development (in frontend/ directory)
cd frontend
npm install
npm run dev
```

## Workspace Dependencies

All shared dependencies are defined in the root `Cargo.toml`:

- `tokio`: Async runtime
- `anyhow`: Error handling
- `thiserror`: Custom error types
- `serde`: Serialization/deserialization
- `serde_json`: JSON processing
- `tracing`: Logging framework
- `tracing-subscriber`: Log subscriber

## AI/LLM-Friendly Features

This project is designed with AI and LLM development in mind:

- **Clear Architecture**: Well-structured codebase for easy understanding
- **Comprehensive Documentation**: Detailed comments and documentation
- **Modular Design**: Loosely coupled components for easy modification
- **Type Safety**: Strong typing with Rust and TypeScript
- **Configuration Management**: Flexible configuration system
- **Error Handling**: Comprehensive error handling patterns

## Getting Started

⚠️ **Note**: This project is not ready for use yet. Please check back later for installation and usage instructions.

## Contributing

This project is in early development. Contribution guidelines will be available once the project reaches a stable state.

## License

License information will be provided once the project is ready for public use.
