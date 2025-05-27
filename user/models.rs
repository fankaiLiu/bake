use serde::{Deserialize, Serialize};
use salvo::macros::Extractible;
use validator::ValidationError;
use validator::Validate;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CreateUserSql1Response {
    pub id: uuid::Uuid,
    pub username: String,
    pub password: String,
    pub role: String,
    pub name: String,
    pub contact: Option<String>,
    pub balance: Option<sqlx::types::BigDecimal>,
    pub created_at: Option<chrono::DateTime<chrono::Utc>>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct GetUserByIdSql1Response {
    pub id: uuid::Uuid,
    pub username: String,
    pub password: String,
    pub role: String,
    pub name: String,
    pub contact: Option<String>,
    pub balance: Option<sqlx::types::BigDecimal>,
    pub created_at: Option<chrono::DateTime<chrono::Utc>>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CreateUserSql1Request {
    pub username: String,
    pub password: String,
    pub role: String,
    pub name: String,
    pub contact: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[derive(Validate,Extractible)]
#[salvo(extract(default_source(from = "body")))]
pub struct CreateUserSql1RequestOptional {
    #[validate(required(message = "字段username是必填项"))]
    #[validate(length(min = 3, max = 50, message = "用户名长度必须在3-50个字符之间"))]
    pub username: Option<String>,
    #[validate(required(message = "字段password是必填项"))]
    #[validate(length(min = 8, message = "密码长度至少需要8个字符"))]
    pub password: Option<String>,
    #[validate(required(message = "字段role是必填项"))]
    pub role: Option<String>,
    #[validate(required(message = "字段name是必填项"))]
    #[validate(length(min = 2, max = 50, message = "姓名长度必须在2-50个字符之间"))]
    pub name: Option<String>,
    #[validate(length(max = 50, message = "联系方式最长50个字符"))]
    pub contact: Option<String>,
}
impl TryFrom<CreateUserSql1RequestOptional> for CreateUserSql1Request {
    type Error = ValidationError;
    fn try_from(req: CreateUserSql1RequestOptional) -> Result<Self, Self::Error> {
        Ok(CreateUserSql1Request {
            username: req.username.ok_or_else(|| ValidationError::new("字段username必填"))?,
            password: req.password.ok_or_else(|| ValidationError::new("字段password必填"))?,
            role: req.role.ok_or_else(|| ValidationError::new("字段role必填"))?,
            name: req.name.ok_or_else(|| ValidationError::new("字段name必填"))?,
            contact: req.contact,
        })
    }
}
