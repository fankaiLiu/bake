use serde::Serialize;
use serde::Deserialize;
use uuid::Uuid;
use salvo::prelude::*;
use crate::models::GetUserByIdSql1Response;
use crate::models::CreateUserSql1RequestOptional;
use crate::models::CreateUserSql1Response;
use crate::models::CreateUserSql1Request;
use crate::utils;

#[handler]
pub async fn get_user_by_id_handler(
    id: PathParam<String>,
    depot: &mut Depot,
) -> JsonResult<GetUserByIdSql1Response> {
    let id = id.into_inner();
    let db = get_db(depot)?;
    let result = get_user_by_id_sql1(db,id).await?;
    json_ok(result)
}

#[handler]
pub async fn create_user_handler(
    req: &mut Request,
    depot: &mut Depot,
) -> JsonResult<CreateUserSql1Response> {
    let input = req.extract::<CreateUserSql1RequestOptional>().await?;
    input.validate()?;
    let request = CreateUserSql1Request::try_from(input)?;
    let db = get_db(depot)?;
    let result = create_user_sql1(db, &request).await?;
    json_ok(result)
}
