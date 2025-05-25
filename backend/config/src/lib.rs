// 配置管理模块
use std::env;
use std::fs;
use std::path::Path;
use thiserror::Error;
use serde::{Deserialize, Serialize};
use toml;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AppConfig {
    pub server: ServerConfig,
    pub minio: MinioConfig,
    pub redis: RedisConfig,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ServerConfig {
    pub port: u16,
    pub db_url: String,
    pub base_dir: String,
    pub secret_key: String,
    pub jwt_exp: u64,
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct MinioConfig {
    pub access_key: String,
    pub secret_key: String,
    pub endpoint: String,
    pub secure: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RedisConfig {
    pub url: String,
    pub max_connections: u32,
}

#[derive(Error, Debug)]
pub enum ConfigError {
    #[error("IO error: {0}")]
    IoError(#[from] std::io::Error),
    #[error("Parse error: {0}")]
    ParseError(String),
    #[error("Validation error: {0}")]
    ValidationError(String),
}

impl Default for AppConfig {
    fn default() -> Self {
        Self {
            server: ServerConfig {
                port: 5800,
                db_url: "postgres://postgres:xxx@localhost:5432/bread_product".to_string(),
                base_dir: "./tmp".to_string(),
                secret_key: "xxx".to_string(),
                jwt_exp: 2592000,
            },
            minio: MinioConfig {
                access_key: "xxx".to_string(),
                secret_key: "xxx".to_string(),
                endpoint: "localhost:9000".to_string(),
                secure: false,
            },
            redis: RedisConfig {
                url: "redis://localhost:6379".to_string(),
                max_connections: 10,
            },
        }
    }
}

impl AppConfig {
    /// 从TOML文件和环境变量加载配置
    pub fn load() -> Result<Self, ConfigError> {
        let mut config = Self::default();
        
        //打印一下读取的途径
        println!("读取的途径: {:?}", env::current_dir().unwrap());
        
        // 首先尝试从配置文件加载
        if let Ok(file_config) = Self::load_from_file("config.toml") {
            config = file_config;
        }
        
        // 然后从环境变量覆盖（环境变量优先）
        config.load_from_env();
        
        // 验证配置
        config.validate()?;
        
        Ok(config)
    }
    
    /// 验证配置的有效性
    pub fn validate(&self) -> Result<(), ConfigError> {
        // 验证端口范围
        if self.server.port == 0 {
            return Err(ConfigError::ValidationError("Server port cannot be 0".to_string()));
        }
        
        // 验证数据库URL
        if self.server.db_url.is_empty() || self.server.db_url == "postgres://postgres:xxx@localhost:5432/bread_product" {
            return Err(ConfigError::ValidationError("Database URL must be configured".to_string()));
        }
        
        // 验证JWT密钥
        if self.server.secret_key.is_empty() || self.server.secret_key == "xxx" {
            return Err(ConfigError::ValidationError("JWT secret key must be configured".to_string()));
        }
        
        // 验证Minio配置
        if self.minio.access_key.is_empty() || self.minio.access_key == "xxx" {
            return Err(ConfigError::ValidationError("Minio access key must be configured".to_string()));
        }
        
        if self.minio.secret_key.is_empty() || self.minio.secret_key == "xxx" {
            return Err(ConfigError::ValidationError("Minio secret key must be configured".to_string()));
        }
        
        // 验证Redis URL
        if self.redis.url.is_empty() {
            return Err(ConfigError::ValidationError("Redis URL must be configured".to_string()));
        }
        
        if self.redis.max_connections == 0 {
            return Err(ConfigError::ValidationError("Redis max connections must be greater than 0".to_string()));
        }
        
        Ok(())
    }
    
    /// 从TOML文件加载配置
    pub fn load_from_file<P: AsRef<Path>>(path: P) -> Result<Self, ConfigError> {
        let content = fs::read_to_string(path)?;
        Self::parse_toml(&content)
    }
    
    /// 从环境变量加载配置
    pub fn load_from_env(&mut self) {
        // Server配置
        if let Ok(port) = env::var("SERVER_PORT") {
            if let Ok(port) = port.parse::<u16>() {
                self.server.port = port;
            }
        }
        
        if let Ok(db_url) = env::var("SERVER_DB_URL") {
            self.server.db_url = db_url;
        }
        
        if let Ok(base_dir) = env::var("SERVER_BASE_DIR") {
            self.server.base_dir = base_dir;
        }
        
        if let Ok(secret_key) = env::var("SERVER_SECRET_KEY") {
            self.server.secret_key = secret_key;
        }
        
        if let Ok(jwt_exp) = env::var("SERVER_JWT_EXP") {
            if let Ok(jwt_exp) = jwt_exp.parse::<u64>() {
                self.server.jwt_exp = jwt_exp;
            }
        }
        
        // Minio配置
        if let Ok(access_key) = env::var("MINIO_ACCESS_KEY") {
            self.minio.access_key = access_key;
        }
        
        if let Ok(secret_key) = env::var("MINIO_SECRET_KEY") {
            self.minio.secret_key = secret_key;
        }
        
        if let Ok(endpoint) = env::var("MINIO_ENDPOINT") {
            self.minio.endpoint = endpoint;
        }
        
        if let Ok(secure) = env::var("MINIO_SECURE") {
            self.minio.secure = secure.to_lowercase() == "true";
        }
        
        // Redis配置
        if let Ok(url) = env::var("REDIS_URL") {
            self.redis.url = url;
        }
        
        if let Ok(max_connections) = env::var("REDIS_MAX_CONNECTIONS") {
            if let Ok(max_connections) = max_connections.parse::<u32>() {
                self.redis.max_connections = max_connections;
            }
        }
    }
    
    /// 解析TOML内容
    fn parse_toml(content: &str) -> Result<Self, ConfigError> {
        // 定义与 TOML 文件结构匹配的临时结构体
        #[derive(Deserialize)]
        struct TomlConfig {
            server: TomlServerConfig,
            redis: TomlRedisConfig,
        }

        #[derive(Deserialize)]
        struct TomlServerConfig {
            port: u16,
            db_url: String,
            base_dir: String,
            secret_key: String,
            jwt_exp: u64,
            minio: TomlMinioConfig,
        }

        #[derive(Deserialize)]
        struct TomlMinioConfig {
            access_key: String,
            secret_key: String,
            endpoint: String,
            secure: bool,
        }

        #[derive(Deserialize)]
        struct TomlRedisConfig {
            url: String,
            max_connections: u32,
        }

        // 使用 toml 库解析
        let toml_config: TomlConfig = toml::from_str(content)
            .map_err(|e| ConfigError::ParseError(format!("TOML parse error: {}", e)))?;

        // 转换为 AppConfig
        Ok(AppConfig {
            server: ServerConfig {
                port: toml_config.server.port,
                db_url: toml_config.server.db_url,
                base_dir: toml_config.server.base_dir,
                secret_key: toml_config.server.secret_key,
                jwt_exp: toml_config.server.jwt_exp,
            },
            minio: MinioConfig {
                access_key: toml_config.server.minio.access_key,
                secret_key: toml_config.server.minio.secret_key,
                endpoint: toml_config.server.minio.endpoint,
                secure: toml_config.server.minio.secure,
            },
            redis: RedisConfig {
                url: toml_config.redis.url,
                max_connections: toml_config.redis.max_connections,
            },
        })
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_parse_toml() {
        let toml_content = r#"
[server]
port = 5800
db_url = "postgres://postgres:password@localhost:5432/bread_product"
base_dir = "./tmp"
secret_key = "test-secret-key"
jwt_exp = 2592000

[server.minio]
access_key = "minioadmin"
secret_key = "minioadmin"
endpoint = "localhost:9000"
secure = false

[redis]
url = "redis://localhost:6379"
max_connections = 10
"#;

        let config = AppConfig::parse_toml(toml_content).unwrap();
        
        assert_eq!(config.server.port, 5800);
        assert_eq!(config.server.db_url, "postgres://postgres:password@localhost:5432/bread_product");
        assert_eq!(config.server.base_dir, "./tmp");
        assert_eq!(config.server.secret_key, "test-secret-key");
        assert_eq!(config.server.jwt_exp, 2592000);
        
        assert_eq!(config.minio.access_key, "minioadmin");
        assert_eq!(config.minio.secret_key, "minioadmin");
        assert_eq!(config.minio.endpoint, "localhost:9000");
        assert_eq!(config.minio.secure, false);
        
        assert_eq!(config.redis.url, "redis://localhost:6379");
        assert_eq!(config.redis.max_connections, 10);
    }

    #[test]
    fn test_load_from_file() {
        // 测试从实际配置文件加载
        let result = AppConfig::load_from_file("../config.toml");
        assert!(result.is_ok(), "Failed to load config.toml: {:?}", result.err());
        
        let config = result.unwrap();
        assert_eq!(config.server.port, 5800);
        assert!(config.server.db_url.contains("postgres"));
    }
}
