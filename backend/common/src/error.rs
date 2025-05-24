// 公共错误类型定义
use thiserror::Error;

#[derive(Error, Debug)]
pub enum BakeError {
    #[error("IO error: {0}")]
    Io(#[from] std::io::Error),
    
    #[error("JSON serialization error: {0}")]
    Json(#[from] serde_json::Error),
    
    #[error("Configuration error: {message}")]
    Config { message: String },
    
    #[error("Package error: {message}")]
    Package { message: String },
    
    #[error("Network error: {message}")]
    Network { message: String },
}

pub type Result<T> = std::result::Result<T, BakeError>;
