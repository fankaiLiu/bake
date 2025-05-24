// 包管理器
use bake_common::{error::Result, types::Package};
use std::collections::HashMap;
use tracing::{info, warn};

pub struct PackageManager {
    installed_packages: HashMap<String, Package>,
}

impl PackageManager {
    pub fn new() -> Self {
        Self {
            installed_packages: HashMap::new(),
        }
    }
    
    /// 获取已安装的包列表
    pub fn get_installed_packages(&self) -> &HashMap<String, Package> {
        &self.installed_packages
    }
    
    /// 添加已安装的包
    pub fn add_package(&mut self, package: Package) {
        info!("Adding package to registry: {}", package.name);
        self.installed_packages.insert(package.name.clone(), package);
    }
    
    /// 移除已安装的包
    pub fn remove_package(&mut self, package_name: &str) -> Option<Package> {
        info!("Removing package from registry: {}", package_name);
        self.installed_packages.remove(package_name)
    }
    
    /// 检查包是否已安装
    pub fn is_installed(&self, package_name: &str) -> bool {
        self.installed_packages.contains_key(package_name)
    }
    
    /// 加载包注册表
    pub async fn load_registry(&mut self) -> Result<()> {
        // TODO: 从文件或数据库加载已安装的包信息
        warn!("Package registry loading not implemented yet");
        Ok(())
    }
    
    /// 保存包注册表
    pub async fn save_registry(&self) -> Result<()> {
        // TODO: 将已安装的包信息保存到文件或数据库
        warn!("Package registry saving not implemented yet");
        Ok(())
    }
}
