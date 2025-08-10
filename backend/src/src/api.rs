use crate::blockchain::Blockchain;
use crate::transaction::{Transaction, TransactionType};
use serde::{Deserialize, Serialize};
use std::sync::Arc;
use tokio::sync::Mutex;
use warp::Filter;

#[derive(Debug, Deserialize)]
pub struct TransferRequest {
    from: String,
    to: String,
    amount: u64,
}

#[derive(Debug, Deserialize)]
pub struct MintRequest {
    to: String,
    amount: u64,
    minter: String,
}

#[derive(Debug, Serialize)]
pub struct ApiResponse<T> {
    success: bool,
    data: Option<T>,
    error: Option<String>,
}

impl<T> ApiResponse<T> {
    pub fn success(data: T) -> Self {
        ApiResponse {
            success: true,
            data: Some(data),
            error: None,
        }
    }

    pub fn error(error: String) -> Self {
        ApiResponse {
            success: false,
            data: None,
            error: Some(error),
        }
    }
}

pub async fn start_server() {
    let blockchain = Arc::new(Mutex::new(Blockchain::new(
        "NovaCoin".to_string(),
        "NOVA".to_string(),
        1000000,
        "creator".to_string(),
    )));

    let blockchain_filter = warp::any().map(move || blockchain.clone());

    // CORS
    let cors = warp::cors()
        .allow_any_origin()
        .allow_headers(vec!["content-type"])
        .allow_methods(vec!["GET", "POST"]);

    // Static files
    let static_files = warp::fs::dir("../frontend");

    // API Routes
    let balance_route = warp::path!("api" / "balance" / String)
        .and(warp::get())
        .and(blockchain_filter.clone())
        .and_then(get_balance);

    let total_supply_route = warp::path!("api" / "supply")
        .and(warp::get())
        .and(blockchain_filter.clone())
        .and_then(get_total_supply);

    let transfer_route = warp::path!("api" / "transfer")
        .and(warp::post())
        .and(warp::body::json())
        .and(blockchain_filter.clone())
        .and_then(transfer_tokens);

    let mint_route = warp::path!("api" / "mint")
        .and(warp::post())
        .and(warp::body::json())
        .and(blockchain_filter.clone())
        .and_then(mint_tokens);

    let blockchain_route = warp::path!("api" / "blockchain")
        .and(warp::get())
        .and(blockchain_filter.clone())
        .and_then(get_blockchain);

    let routes = static_files
        .or(balance_route)
        .or(total_supply_route)
        .or(transfer_route)
        .or(mint_route)
        .or(blockchain_route)
        .with(cors);

    println!("🚀 NovaCoin blockchain server starting on http://localhost:3030");
    println!("📊 Dashboard: http://localhost:3030");
    println!("🔧 API Base: http://localhost:3030/api");
    warp::serve(routes).run(([127, 0, 0, 1], 3030)).await;
}

async fn get_balance(
    user_id: String,
    blockchain: Arc<Mutex<Blockchain>>,
) -> Result<impl warp::Reply, warp::Rejection> {
    let blockchain = blockchain.lock().await;
    let balance = blockchain.get_balance(&user_id);
    Ok(warp::reply::json(&ApiResponse::success(balance)))
}

async fn get_total_supply(
    blockchain: Arc<Mutex<Blockchain>>,
) -> Result<impl warp::Reply, warp::Rejection> {
    let blockchain = blockchain.lock().await;
    let supply = blockchain.get_total_supply();
    Ok(warp::reply::json(&ApiResponse::success(supply)))
}

async fn transfer_tokens(
    request: TransferRequest,
    blockchain: Arc<Mutex<Blockchain>>,
) -> Result<impl warp::Reply, warp::Rejection> {
    let mut blockchain = blockchain.lock().await;
    let transaction = Transaction::new(
        request.from,
        request.to,
        request.amount,
        TransactionType::Transfer,
    );

    match blockchain.add_transaction(transaction) {
        Ok(_) => Ok(warp::reply::json(&ApiResponse::success("Transfer successful"))),
        Err(e) => Ok(warp::reply::json(&ApiResponse::<String>::error(e))),
    }
}

async fn mint_tokens(
    request: MintRequest,
    blockchain: Arc<Mutex<Blockchain>>,
) -> Result<impl warp::Reply, warp::Rejection> {
    let mut blockchain = blockchain.lock().await;
    let transaction = Transaction::new(
        request.minter,
        request.to,
        request.amount,
        TransactionType::Mint,
    );

    match blockchain.add_transaction(transaction) {
        Ok(_) => Ok(warp::reply::json(&ApiResponse::success("Mint successful"))),
        Err(e) => Ok(warp::reply::json(&ApiResponse::<String>::error(e))),
    }
}

async fn get_blockchain(
    blockchain: Arc<Mutex<Blockchain>>,
) -> Result<impl warp::Reply, warp::Rejection> {
    let blockchain = blockchain.lock().await;
    Ok(warp::reply::json(&ApiResponse::success(&*blockchain)))
}