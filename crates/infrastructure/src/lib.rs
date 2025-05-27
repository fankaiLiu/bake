pub mod database;
pub mod redis;

pub use database::*;
pub use redis::*;

use bake_config::{AppConfig, ConfigError};
use thiserror::Error;
use tokio::sync::OnceCell;

// 全局配置实例
static CONFIG: OnceCell<AppConfig> = OnceCell::const_new();

// 全局基础设施实例
static INFRASTRUCTURE: OnceCell<Infrastructure> = OnceCell::const_new();

#[derive(Error, Debug)]
pub enum InfrastructureError {
    #[error("Configuration error: {0}")]
    Config(#[from] ConfigError),
    #[error("Database error: {0}")]
    Database(#[from] DatabaseError),
    #[error("Redis error: {0}")]
    Redis(#[from] RedisError),
    #[error("Initialization error: {0}")]
    Initialization(String),
}

#[derive(Clone)]
pub struct Infrastructure {
    pub database: DatabasePool,
    pub redis: RedisPool,
}

impl Infrastructure {
    /// 使用配置创建基础设施实例
    pub async fn new_with_config(config: &AppConfig) -> Result<Self, InfrastructureError> {
        let database = DatabasePool::new(&config.server.db_url).await?;
        let redis = RedisPool::new(&config.redis.url).await?;

        Ok(Self { database, redis })
    }

    /// 传统方式创建（向后兼容）
    pub async fn new(database_url: &str, redis_url: &str) -> Result<Self, InfrastructureError> {
        let database = DatabasePool::new(database_url).await?;
        let redis = RedisPool::new(redis_url).await?;

        Ok(Self { database, redis })
    }

    pub async fn health_check(&self) -> Result<(), InfrastructureError> {
        self.database.health_check().await?;
        self.redis.health_check().await?;
        Ok(())
    }
}

/// 初始化全局配置和基础设施
/// 这个函数应该在应用启动时调用一次
pub async fn initialize() -> Result<(), InfrastructureError> {
    // 加载配置
    let config = AppConfig::load()?;
    
    // 设置全局配置
    CONFIG.set(config.clone())
        .map_err(|_| InfrastructureError::Initialization("Config already initialized".to_string()))?;
    
    // 创建基础设施实例
    let infrastructure = Infrastructure::new_with_config(&config).await?;
    
    // 健康检查
    infrastructure.health_check().await?;
    
    // 设置全局基础设施实例
    INFRASTRUCTURE.set(infrastructure)
        .map_err(|_| InfrastructureError::Initialization("Infrastructure already initialized".to_string()))?;
    
    tracing::info!("Infrastructure initialized successfully");
    Ok(())
}

/// 获取全局配置实例
pub fn config() -> &'static AppConfig {
    CONFIG.get().expect("Config not initialized. Call initialize() first.")
}

/// 获取全局基础设施实例
pub fn infrastructure() -> &'static Infrastructure {
    INFRASTRUCTURE.get().expect("Infrastructure not initialized. Call initialize() first.")
}

/// 获取数据库连接池
pub fn database() -> &'static DatabasePool {
    &infrastructure().database
}

/// 获取Redis连接池
pub fn redis() -> &'static RedisPool {
    &infrastructure().redis
}

/// 尝试获取配置（如果未初始化则返回 None）
pub fn try_config() -> Option<&'static AppConfig> {
    CONFIG.get()
}

/// 尝试获取基础设施（如果未初始化则返回 None）
pub fn try_infrastructure() -> Option<&'static Infrastructure> {
    INFRASTRUCTURE.get()
}

#[cfg(test)]
mod tests {
    use super::*;
    use bake_config::AppConfig;

    #[tokio::test]
    async fn test_config_validation() {
        let mut config = AppConfig::default();
        
        // 默认配置应该验证失败（因为包含占位符值）
        assert!(config.validate().is_err());
        
        // 设置有效值
        config.server.db_url = "postgres://test:test@localhost:5432/test".to_string();
        config.server.secret_key = "test-secret-key".to_string();
        config.minio.access_key = "test-access-key".to_string();
        config.minio.secret_key = "test-secret-key".to_string();
        
        // 现在应该验证成功
        assert!(config.validate().is_ok());
    }

    #[test]
    fn test_try_functions_before_init() {
        // 在初始化之前，try_* 函数应该返回 None
        assert!(try_config().is_none());
        assert!(try_infrastructure().is_none());
    }
} 