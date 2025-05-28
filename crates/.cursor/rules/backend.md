# Backend Rust Rules

## Rust 特定规则

### 代码风格
- 遵循 Rust 官方代码风格指南
- 使用 `rustfmt` 格式化代码
- 使用 `clippy` 进行代码检查
- 优先使用 `snake_case` 命名

### 错误处理
- 使用 `Result<T, E>` 进行错误处理
- 优先使用 `anyhow` 或 `thiserror` 库
- 避免使用 `unwrap()` 和 `expect()`，除非在示例或测试代码中
- 提供有意义的错误上下文

### 内存安全
- 优先使用借用而不是所有权转移
- 不使用 `unsafe` 代码
- 使用 `Arc` 和 `Mutex` 进行并发安全

### 性能
- 使用 `&str` 而不是 `String` 作为函数参数（当不需要所有权时）
- 考虑使用 `Cow` 类型避免不必要的克隆
- 使用 `Vec::with_capacity` 预分配内存

### API 设计
- 使用 RESTful API 设计原则
- 提供清晰的响应结构
- 实现适当的状态码
- 使用中间件处理跨域、认证等

## 项目结构
```
crates/
  api/          # Web API 服务
  common/       # 共享类型和工具
  config/       # 配置管理
  infrastructure/  # 基础设施（数据库、Redis等）
  platform_services/      # 业务模块
```
