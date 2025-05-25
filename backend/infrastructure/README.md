# Infrastructure Module

这个模块提供了统一的基础设施管理，包括配置加载、数据库连接池、Redis连接池等。

## 特性

- 使用 `thiserror` 进行统一的错误处理
- 基于 `tokio::sync::OnceCell` 的全局单例模式
- 自动配置验证
- 健康检查功能
- 支持环境变量覆盖配置

## 使用方法

### 1. 初始化（在应用启动时调用一次）

```rust
use infrastructure::initialize;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // 初始化基础设施（会自动加载配置、验证并建立连接）
    initialize().await?;
    
    // 应用启动逻辑...
    Ok(())
}
```

### 2. 在应用中使用全局实例

```rust
use infrastructure::{config, database, redis, infrastructure};

// 获取配置
let app_config = config();
println!("Server port: {}", app_config.server.port);

// 获取数据库连接池
let db_pool = database();
let result = sqlx::query("SELECT * FROM users")
    .fetch_all(db_pool.get_pool())
    .await?;

// 获取Redis连接池
let redis_pool = redis();

// 获取整个基础设施实例
let infra = infrastructure();
infra.health_check().await?;
```

### 3. 在 HTTP 处理器中使用

```rust
use infrastructure::database;

async fn get_users() -> Result<Vec<User>, MyError> {
    let db = database();
    let users = sqlx::query_as::<_, User>("SELECT * FROM users")
        .fetch_all(db.get_pool())
        .await?;
    Ok(users)
}
```

## 配置

### 配置文件 (config.toml)

```toml
[server]
port = 5800
db_url = "postgres://postgres:password@localhost:5432/bread_product"
base_dir = "./tmp"
secret_key = "your-secret-key-here"
jwt_exp = 2592000

[server.minio]
access_key = "your-minio-access-key"
secret_key = "your-minio-secret-key"
endpoint = "localhost:9000"
secure = false

[redis]
url = "redis://localhost:6379"
max_connections = 10
```

### 环境变量

所有配置都可以通过环境变量覆盖：

- `SERVER_PORT`
- `SERVER_DB_URL`
- `SERVER_BASE_DIR`
- `SERVER_SECRET_KEY`
- `SERVER_JWT_EXP`
- `MINIO_ACCESS_KEY`
- `MINIO_SECRET_KEY`
- `MINIO_ENDPOINT`
- `MINIO_SECURE`
- `REDIS_URL`
- `REDIS_MAX_CONNECTIONS`

## 错误处理

模块使用 `thiserror` 提供了统一的错误类型：

- `InfrastructureError`: 顶级错误类型
- `ConfigError`: 配置相关错误
- `DatabaseError`: 数据库相关错误
- `RedisError`: Redis相关错误

## 安全注意事项

- 确保在生产环境中设置正确的 `SERVER_SECRET_KEY`
- 不要在代码中硬编码敏感信息
- 使用环境变量或安全的配置管理系统 