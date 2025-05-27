// 公共类型定义
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Package {
    pub name: String,
    pub version: String,
    pub description: Option<String>,
    pub dependencies: Vec<Dependency>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Dependency {
    pub name: String,
    pub version: String,
    pub optional: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ProjectInfo {
    pub name: String,
    pub version: String,
    pub framework: Framework,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum Framework {
    React,
    Vue,
    Angular,
    Svelte,
    Next,
    Nuxt,
    Custom(String),
}
