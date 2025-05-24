// 工具函数
use std::path::Path;
use crate::error::{BakeError, Result};

/// 检查文件是否存在
pub fn file_exists<P: AsRef<Path>>(path: P) -> bool {
    path.as_ref().exists()
}

/// 确保目录存在，如果不存在则创建
pub async fn ensure_dir<P: AsRef<Path>>(path: P) -> Result<()> {
    let path = path.as_ref();
    if !path.exists() {
        tokio::fs::create_dir_all(path).await?;
    }
    Ok(())
}

/// 读取文件内容
pub async fn read_file_content<P: AsRef<Path>>(path: P) -> Result<String> {
    let content = tokio::fs::read_to_string(path).await?;
    Ok(content)
}

/// 写入文件内容
pub async fn write_file_content<P: AsRef<Path>>(path: P, content: &str) -> Result<()> {
    tokio::fs::write(path, content).await?;
    Ok(())
}
