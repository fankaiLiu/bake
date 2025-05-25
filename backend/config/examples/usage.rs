use bake_config::AppConfig;

fn main() -> Result<(), Box<dyn std::error::Error>> {
    // 加载配置（优先级：环境变量 > config.toml > 默认值）
    let config = AppConfig::load()?;
    
    println!("配置加载成功:");
    println!("服务器端口: {}", config.server.port);
    println!("数据库URL: {}", config.server.db_url);
    println!("基础目录: {}", config.server.base_dir);
    println!("JWT过期时间: {} 秒", config.server.jwt_exp);
    
    println!("\nMinio配置:");
    println!("访问密钥: {}", config.minio.access_key);
    println!("端点: {}", config.minio.endpoint);
    println!("安全连接: {}", config.minio.secure);
    
    println!("\nRedis配置:");
    println!("URL: {}", config.redis.url);
    println!("最大连接数: {}", config.redis.max_connections);
    
    Ok(())
}

// 环境变量使用示例：
// export SERVER_PORT=8080
// export SERVER_DB_URL="postgres://user:pass@localhost:5432/mydb"
// export MINIO_ACCESS_KEY="my_access_key"
// export MINIO_SECRET_KEY="my_secret_key"
// export REDIS_URL="redis://localhost:6380" 