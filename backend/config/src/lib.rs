// 配置管理模块
use std::collections::HashMap;
use std::env;
use std::fs;
use std::path::Path;

#[derive(Debug, Clone)]
pub struct AppConfig {
    pub server: ServerConfig,
    pub minio: MinioConfig,
    pub redis: RedisConfig,
}

#[derive(Debug, Clone)]
pub struct ServerConfig {
    pub port: u16,
    pub db_url: String,
    pub base_dir: String,
    pub secret_key: String,
    pub jwt_exp: u64,
}

#[derive(Debug, Clone)]
pub struct MinioConfig {
    pub access_key: String,
    pub secret_key: String,
    pub endpoint: String,
    pub secure: bool,
}

#[derive(Debug, Clone)]
pub struct RedisConfig {
    pub url: String,
    pub max_connections: u32,
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
        
        // 首先尝试从配置文件加载
        if let Ok(file_config) = Self::load_from_file("config.toml") {
            config = file_config;
        }
        
        // 然后从环境变量覆盖（环境变量优先）
        config.load_from_env();
        
        Ok(config)
    }
    
    /// 从TOML文件加载配置
    pub fn load_from_file<P: AsRef<Path>>(path: P) -> Result<Self, ConfigError> {
        let content = fs::read_to_string(path)
            .map_err(|e| ConfigError::IoError(e.to_string()))?;
        
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
        let mut config = Self::default();
        let parsed = SimpleTomlParser::parse(content)?;
        
        // 解析server配置
        if let Some(server_table) = parsed.get("server") {
            if let TomlValue::Table(server) = server_table {
                if let Some(TomlValue::Integer(port)) = server.get("port") {
                    config.server.port = *port as u16;
                }
                if let Some(TomlValue::String(db_url)) = server.get("db_url") {
                    config.server.db_url = db_url.clone();
                }
                if let Some(TomlValue::String(base_dir)) = server.get("base_dir") {
                    config.server.base_dir = base_dir.clone();
                }
                if let Some(TomlValue::String(secret_key)) = server.get("secret_key") {
                    config.server.secret_key = secret_key.clone();
                }
                if let Some(TomlValue::Integer(jwt_exp)) = server.get("jwt_exp") {
                    config.server.jwt_exp = *jwt_exp as u64;
                }
                
                // 解析minio配置
                if let Some(TomlValue::Table(minio)) = server.get("minio") {
                    if let Some(TomlValue::String(access_key)) = minio.get("access_key") {
                        config.minio.access_key = access_key.clone();
                    }
                    if let Some(TomlValue::String(secret_key)) = minio.get("secret_key") {
                        config.minio.secret_key = secret_key.clone();
                    }
                    if let Some(TomlValue::String(endpoint)) = minio.get("endpoint") {
                        config.minio.endpoint = endpoint.clone();
                    }
                    if let Some(TomlValue::Boolean(secure)) = minio.get("secure") {
                        config.minio.secure = *secure;
                    }
                }
            }
        }
        
        // 解析redis配置
        if let Some(redis_table) = parsed.get("redis") {
            if let TomlValue::Table(redis) = redis_table {
                if let Some(TomlValue::String(url)) = redis.get("url") {
                    config.redis.url = url.clone();
                }
                if let Some(TomlValue::Integer(max_connections)) = redis.get("max_connections") {
                    config.redis.max_connections = *max_connections as u32;
                }
            }
        }
        
        Ok(config)
    }
}

#[derive(Debug)]
pub enum ConfigError {
    IoError(String),
    ParseError(String),
}

impl std::fmt::Display for ConfigError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            ConfigError::IoError(msg) => write!(f, "IO Error: {}", msg),
            ConfigError::ParseError(msg) => write!(f, "Parse Error: {}", msg),
        }
    }
}

impl std::error::Error for ConfigError {}

// 简单的TOML解析器
#[derive(Debug, Clone)]
enum TomlValue {
    String(String),
    Integer(i64),
    Boolean(bool),
    Table(HashMap<String, TomlValue>),
}

struct SimpleTomlParser;

impl SimpleTomlParser {
    fn parse(content: &str) -> Result<HashMap<String, TomlValue>, ConfigError> {
        let mut result = HashMap::new();
        let mut current_table = String::new();
        let mut current_section: Option<&mut HashMap<String, TomlValue>> = None;
        
        for line in content.lines() {
            let line = line.trim();
            
            // 跳过空行和注释
            if line.is_empty() || line.starts_with('#') {
                continue;
            }
            
            // 处理表头 [section]
            if line.starts_with('[') && line.ends_with(']') {
                current_table = line[1..line.len()-1].to_string();
                result.insert(current_table.clone(), TomlValue::Table(HashMap::new()));
                continue;
            }
            
            // 处理键值对
            if let Some(eq_pos) = line.find('=') {
                let key = line[..eq_pos].trim().to_string();
                let value_str = line[eq_pos + 1..].trim();
                
                let value = Self::parse_value(value_str)?;
                
                if current_table.is_empty() {
                    result.insert(key, value);
                } else {
                    if let Some(TomlValue::Table(table)) = result.get_mut(&current_table) {
                        table.insert(key, value);
                    }
                }
            }
        }
        
        Ok(result)
    }
    
    fn parse_value(value_str: &str) -> Result<TomlValue, ConfigError> {
        let value_str = value_str.trim();
        
        // 字符串值（带引号）
        if (value_str.starts_with('"') && value_str.ends_with('"')) ||
           (value_str.starts_with('\'') && value_str.ends_with('\'')) {
            return Ok(TomlValue::String(value_str[1..value_str.len()-1].to_string()));
        }
        
        // 布尔值
        if value_str == "true" {
            return Ok(TomlValue::Boolean(true));
        }
        if value_str == "false" {
            return Ok(TomlValue::Boolean(false));
        }
        
        // 整数
        if let Ok(int_val) = value_str.parse::<i64>() {
            return Ok(TomlValue::Integer(int_val));
        }
        
        // 默认作为字符串处理（无引号的字符串）
        Ok(TomlValue::String(value_str.to_string()))
    }
}
