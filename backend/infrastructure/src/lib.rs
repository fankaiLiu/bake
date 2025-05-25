pub mod database;
pub mod redis;

pub use database::*;
pub use redis::*;

use anyhow::Result;

#[derive(Clone)]
pub struct Infrastructure {
    pub database: DatabasePool,
    pub redis: RedisPool,
}

impl Infrastructure {
    pub async fn new(database_url: &str, redis_url: &str) -> Result<Self> {
        let database = DatabasePool::new(database_url).await?;
        let redis = RedisPool::new(redis_url).await?;

        Ok(Self { database, redis })
    }

    pub async fn health_check(&self) -> Result<()> {
        self.database.health_check().await?;
        self.redis.health_check().await?;
        Ok(())
    }
} 