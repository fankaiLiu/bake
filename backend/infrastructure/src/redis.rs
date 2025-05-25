use deadpool_redis::{Config, Pool, Runtime};
use thiserror::Error;
use tracing::info;

#[derive(Error, Debug)]
pub enum RedisError {
    #[error("Redis connection error: {0}")]
    Connection(String),
    #[error("Redis operation error: {0}")]
    Operation(String),
    #[error("Redis pool error: {0}")]
    Pool(String),
}

impl From<deadpool_redis::CreatePoolError> for RedisError {
    fn from(err: deadpool_redis::CreatePoolError) -> Self {
        RedisError::Pool(err.to_string())
    }
}

impl From<deadpool_redis::PoolError> for RedisError {
    fn from(err: deadpool_redis::PoolError) -> Self {
        RedisError::Pool(err.to_string())
    }
}

impl From<deadpool_redis::redis::RedisError> for RedisError {
    fn from(err: deadpool_redis::redis::RedisError) -> Self {
        RedisError::Operation(err.to_string())
    }
}

#[derive(Clone)]
pub struct RedisPool {
    pool: Pool,
}

impl RedisPool {
    pub async fn new(redis_url: &str) -> Result<Self, RedisError> {
        info!("Connecting to Redis...");
        
        let cfg = Config::from_url(redis_url);
        let pool = cfg.create_pool(Some(Runtime::Tokio1))?;

        // Test connection
        let mut conn = pool.get().await?;
        deadpool_redis::redis::cmd("PING")
            .query_async::<_, String>(&mut *conn)
            .await?;

        info!("Successfully connected to Redis");
        
        Ok(Self { pool })
    }

    pub fn get_pool(&self) -> &Pool {
        &self.pool
    }

    pub async fn health_check(&self) -> Result<(), RedisError> {
        let mut conn = self.pool.get().await?;
        deadpool_redis::redis::cmd("PING")
            .query_async::<_, String>(&mut *conn)
            .await?;
        Ok(())
    }
} 