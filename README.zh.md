# ⚠️ 开发中 - 暂不可用

**此项目正在积极开发中，尚未准备好用于生产环境。许多功能不完整或不稳定。**

---

# Bake - AI/LLM 友好的全栈开发框架

**中文** | [English](README.md)

Bake 是一个现代化的全栈开发框架，专为 AI 和 LLM 友好而设计，采用 Rust 后端配合 React 前端。该项目旨在为构建 AI 驱动的应用程序提供无缝的开发体验。

## 架构概览

- **后端**: Rust 配合 Workspace 架构
- **前端**: React Bun Rsbuild 工具链
- **设计理念**: AI/LLM 友好的开发模式

## 后端结构

后端采用 Rust Workspace 架构构建，以实现更好的模块化和依赖管理。

### 项目结构

```
crates/
├── api/           # HTTP API 服务器
├── business_modules/        # 主要业务逻辑开发区域
├── common/        # 共享类型和工具
├── config/        # 配置管理
├── infrastructure/ # 数据库和基础设施
└── platform_services/       # 平台工程 (社区维护)
```

### 模块说明

#### api
- **作用**: API 服务器，提供 HTTP 接口
- **依赖**: common, config
- **入口**: `src/main.rs`

#### business_modules
- **作用**: 主要业务逻辑开发区域，用于自定义应用功能
- **功能**: 
  - git clone 后的主要开发工作区
  - 自定义业务逻辑实现
  - 应用特定模块

#### common
- **作用**: 公共类型、错误处理和工具函数
- **功能**: 
  - 统一的错误类型定义
  - 公共数据结构
  - 常用工具函数

#### config
- **作用**: 配置管理模块
- **功能**: 
  - 应用配置结构定义
  - 配置加载和验证

#### infrastructure
- **作用**: 数据库和基础设施组件
- **功能**: 
  - 数据库连接和操作
  - Redis 集成
  - 基础设施工具

#### platform_services
- **作用**: 平台工程模块 (社区维护)
- **功能**: 
  - 系统管理和运维
  - 用户管理系统
  - 基于角色的访问控制 (RBAC)
  - 权限管理
  - 核心平台功能

## 前端结构

前端采用 React 和现代化工具构建，提供响应式用户体验。

### 前端特性

- **框架**: React 配合 TypeScript
- **包管理器**: Bun 实现快速依赖管理
- **构建工具**: Rsbuild 实现快速开发
- **UI 组件**: 现代化组件库
- **路由**: 基于文件的路由系统
- **身份验证**: 内置认证上下文和受保护路由

### 开发命令

```bash
# 检查所有项目
cargo check

# 运行 API 服务器
cargo run --bin bake-api

# 运行测试
cargo test

# 构建发布版本
cargo build --release

# 前端开发 (在 frontend/ 目录下)
cd frontend
npm install
npm run dev
```

### Workspace 依赖

所有公共依赖在根 `Cargo.toml` 中定义：
- `tokio`: 异步运行时
- `anyhow`: 错误处理
- `thiserror`: 自定义错误类型
- `serde`: 序列化/反序列化
- `serde_json`: JSON 处理
- `tracing`: 日志记录
- `tracing-subscriber`: 日志订阅器

## AI/LLM 友好特性

本项目专为 AI 和 LLM 开发而设计：

- **清晰架构**: 结构良好的代码库，便于理解
- **全面文档**: 详细的注释和文档
- **模块化设计**: 松耦合组件，便于修改
- **类型安全**: Rust 和 TypeScript 的强类型系统
- **配置管理**: 灵活的配置系统
- **错误处理**: 全面的错误处理模式

## 开始使用

⚠️ **注意**: 此项目尚未准备好使用。请稍后查看安装和使用说明。

## 贡献

此项目正在早期开发中。一旦项目达到稳定状态，将提供贡献指南。

## 许可证

项目准备好公开使用后将提供许可证信息。
