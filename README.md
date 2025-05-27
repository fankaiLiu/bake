# 开发中...

# Bake AI原生

## Bake Backend

这是 Bake 全栈开发框架的后端部分，采用 Rust Workspace 架构。

### 项目结构

```
backend/
├── Cargo.toml          # Workspace 配置文件
├── api/                # API 服务器
│   ├── Cargo.toml
│   └── src/
│       └── main.rs     # API 服务器入口点
├── common/             # 公共模块
│   ├── Cargo.toml
│   └── src/
│       ├── lib.rs      # 模块导出
│       ├── error.rs    # 错误类型定义
│       ├── types.rs    # 公共类型定义
│       └── utils.rs    # 工具函数
├── config/             # 配置管理
│   ├── Cargo.toml
│   └── src/
│       └── lib.rs      # 配置管理逻辑
└── modules/                # 包管理
    ├── Cargo.toml
    └── src/
        ├── lib.rs      # 包管理模块导出
        ├── installer.rs # 包安装器
        ├── manager.rs   # 包管理器
        └── resolver.rs  # 依赖解析器
```

### 模块说明

#### api
- **作用**: API 服务器，提供 HTTP 接口
- **依赖**: common, config
- **入口**: `src/main.rs`

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

#### modules
- **作用**: 包管理系统
- **功能**: 
  - 包安装和卸载
  - 依赖关系解析
  - 包注册表管理

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
