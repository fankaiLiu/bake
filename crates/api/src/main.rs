use tracing::{info, warn};
use tracing_subscriber;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    // 初始化日志
    tracing_subscriber::fmt::init();
    
    info!("🔥 Bake API Server starting...");
    
    // TODO: 启动 web 服务器
    warn!("API server not implemented yet");
    
    Ok(())
}
