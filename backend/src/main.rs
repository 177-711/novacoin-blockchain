mod blockchain;
mod token;
mod transaction;
mod api;

use crate::blockchain::Blockchain;
use std::sync::Arc;
use tokio::sync::Mutex;

#[tokio::main]
async fn main() {
    // ✅ Initialize blockchain with "naman" as creator
    let blockchain = Blockchain::new(
        "NovaCoin".to_string(),
        "NOVA".to_string(),
        1_000_000,
        "naman".to_string(),
    );

    let shared_chain = Arc::new(Mutex::new(blockchain));

    println!("🚀 NovaCoin blockchain server starting on http://localhost:3030");
    println!("📊 Dashboard: http://localhost:3030");
    println!("🔧 API Base: http://localhost:3030/api");

    // ✅ Launch API and static file server
    api::launch(shared_chain).await;
}