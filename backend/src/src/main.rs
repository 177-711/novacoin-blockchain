mod blockchain;
mod token;
mod transaction;
mod api;

#[tokio::main]
async fn main() {
    api::start_server().await;
}