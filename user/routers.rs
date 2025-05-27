use salvo::prelude::*;
use super::handler::*; // Import handler functions

pub fn user_router() -> Vec<salvo::Router> {
    vec![
        Router::with_path("/api/users/{id}")
            .get(get_user_by_id_handler),
        Router::with_path("/api/users")
            .post(create_user_handler),
    ]
}
