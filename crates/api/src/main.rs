use tracing::{info, warn};
use tracing_subscriber;

// 加载 I18n 宏
#[macro_use]
extern crate rust_i18n;

// 初始化翻译，指向根目录的 locales 文件夹
i18n!("../../locales", fallback = "en");

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    // 初始化日志
    tracing_subscriber::fmt::init();
    
    // 设置语言为中文
    rust_i18n::set_locale("zh-CN");
    
    info!("🔥 Bake API Server starting...");
    info!("Available locales: {:?}", rust_i18n::available_locales!());
    info!("Current locale: {}", &*rust_i18n::locale());
    
    // 示例：使用多语言
    info!("Login title: {}", t!("auth.login.title"));
    
    // TODO: 启动 web 服务器
    warn!("API server not implemented yet");
    
    Ok(())
}
