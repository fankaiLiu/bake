# Bake Config 配置模块

这是一个轻量级的配置管理模块，支持TOML格式配置文件和环境变量，无外部依赖。

## 特性

- 🚀 零外部依赖
- 📝 支持TOML格式配置文件
- 🌍 支持环境变量覆盖
- ⚡ 环境变量优先级高于配置文件
- 🛡️ 类型安全的配置结构

## 配置优先级

1. **环境变量** (最高优先级)
2. **config.toml 文件**
3. **默认值** (最低优先级)

## 使用方法

### 1. 基本使用

```rust
use bake_config::AppConfig;

fn main() -> Result<(), Box<dyn std::error::Error>> {
    // 加载配置
    let config = AppConfig::load()?;
    
    // 使用配置
    println!("服务器端口: {}", config.server.port);
    println!("数据库URL: {}", config.server.db_url);
    
    Ok(())
}
```

### 2. 配置文件格式 (config.toml)

```toml
[server]
port = 5800
db_url = "postgres://postgres:xxx@localhost:5432/bread_product"
base_dir = "./tmp"
secret_key = "xxx"
jwt_exp = 2592000

[server.minio]
access_key = "xxx"
secret_key = "xxx"
endpoint = "localhost:9000"
secure = false

[redis]
url = "redis://localhost:6379"
max_connections = 10
```

### 3. 环境变量

支持以下环境变量：

#### 服务器配置
- `SERVER_PORT` - 服务器端口
- `SERVER_DB_URL` - 数据库连接URL
- `SERVER_BASE_DIR` - 基础目录
- `SERVER_SECRET_KEY` - JWT密钥
- `SERVER_JWT_EXP` - JWT过期时间（秒）

#### Minio配置
- `MINIO_ACCESS_KEY` - Minio访问密钥
- `MINIO_SECRET_KEY` - Minio秘密密钥
- `MINIO_ENDPOINT` - Minio端点
- `MINIO_SECURE` - 是否使用HTTPS (true/false)

#### Redis配置
- `REDIS_URL` - Redis连接URL
- `REDIS_MAX_CONNECTIONS` - Redis最大连接数

### 4. 环境变量使用示例

```bash
# 设置环境变量
export SERVER_PORT=8080
export SERVER_DB_URL="postgres://user:pass@localhost:5432/mydb"
export MINIO_ACCESS_KEY="my_access_key"
export MINIO_SECRET_KEY="my_secret_key"
export REDIS_URL="redis://localhost:6380"

# 运行应用
cargo run
```

## 配置结构

### AppConfig
- `server: ServerConfig` - 服务器配置
- `minio: MinioConfig` - Minio对象存储配置
- `redis: RedisConfig` - Redis配置

### ServerConfig
- `port: u16` - 服务器端口
- `db_url: String` - 数据库连接URL
- `base_dir: String` - 基础目录
- `secret_key: String` - JWT密钥
- `jwt_exp: u64` - JWT过期时间（秒）

### MinioConfig
- `access_key: String` - 访问密钥
- `secret_key: String` - 秘密密钥
- `endpoint: String` - 服务端点
- `secure: bool` - 是否使用HTTPS

### RedisConfig
- `url: String` - Redis连接URL
- `max_connections: u32` - 最大连接数

## 错误处理

配置加载可能返回以下错误：

- `ConfigError::IoError` - 文件读取错误
- `ConfigError::ParseError` - TOML解析错误

## 示例

查看 `examples/usage.rs` 文件获取完整的使用示例。

## 安全注意事项

- 敏感信息（如密钥、密码）建议通过环境变量设置
- 不要将包含敏感信息的配置文件提交到版本控制系统
- 生产环境中使用强密钥和安全的数据库连接 