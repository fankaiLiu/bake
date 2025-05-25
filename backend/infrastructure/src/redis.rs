use anyhow::Result;
use deadpool_redis::{Config, Pool, Runtime};
use tracing::info;

#[derive(Clone)]
pub struct RedisPool {
    pool: Pool,
}

impl RedisPool {
    pub async fn new(redis_url: &str) -> Result<Self> {
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

    pub async fn health_check(&self) -> Result<()> {
        let mut conn = self.pool.get().await?;
        deadpool_redis::redis::cmd("PING")
            .query_async::<_, String>(&mut *conn)
            .await?;
        Ok(())
    }
} 