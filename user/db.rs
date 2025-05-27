// ─── Common imports ────────────────────────────────────────────────────────────
use sqlx::{PgPool, postgres::PgPoolOptions, PgExecutor};
use anyhow::Result as AnyResult;

// ─── Dynamically imported model structs ───────────────────────────────────────
use super::models::{ CreateUserSql1Request, CreateUserSql1RequestOptional, CreateUserSql1Response, GetUserByIdSql1Response };

// ─── Generated database functions ─────────────────────────────────────────────
pub async fn get_user_by_id_sql1(
    executor: impl PgExecutor<'_>
  , id: uuid::Uuid
) -> AnyResult<GetUserByIdSql1Response> {
    let result = sqlx::query_as!(
        GetUserByIdSql1Response, // map rows into this type
        r#"SELECT users.id, users.username, users.password, users.role, users.name, users.contact, users.balance, users.created_at FROM users WHERE id = $1 LIMIT 1;"#
        ,
                id
    )
        .fetch_one(executor)
    .await?;
    Ok(result)
}

pub async fn create_user_sql1(
    executor: impl PgExecutor<'_>
  , input: &CreateUserSql1Request
) -> AnyResult<CreateUserSql1Response> {
    let result = sqlx::query_as!(
        CreateUserSql1Response, // map rows into this type
        r#"INSERT INTO users (
    username, password, role, name, contact
) VALUES (
    $1, $2, $3, $4, $5
)
RETURNING users.id, users.username, users.password, users.role, users.name, users.contact, users.balance, users.created_at;
"#
        ,
                input.username, input.password, input.role, input.name, input.contact
    )
        .fetch_one(executor)
    .await?;
    Ok(result)
}
