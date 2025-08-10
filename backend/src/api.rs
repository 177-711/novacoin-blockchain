use crate::blockchain::Blockchain;
use crate::transaction::{Transaction, TransactionType};
use serde::{Deserialize, Serialize};
use std::sync::Arc;
use tokio::sync::Mutex;
use warp::Filter;

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

    pub fn error(msg: String) -> Self {
        ApiResponse {
            success: false,
            data: None,
            error: Some(msg),
        }
    }
}

#[derive(Debug, Deserialize)]
struct TransferRequest {
    from: String,
    to: String,
    amount: u64,
}

#[derive(Debug, Deserialize)]
struct MintRequest {
    to: String,
    amount: u64,
    minter: String,
}

pub async fn launch(blockchain: Arc<Mutex<Blockchain>>) {
    let blockchain_filter = warp::any().map(move || blockchain.clone());

    let cors = warp::cors()
        .allow_any_origin()
        .allow_headers(vec!["Content-Type"])
        .allow_methods(vec!["GET", "POST"]);

    let static_files = warp::fs::dir("../frontend");

    let balance_route = warp::path!("api" / "balance" / String)
        .and(warp::get())
        .and(blockchain_filter.clone())
        .and_then(handle_balance);

    let total_supply_route = warp::path!("api" / "supply")
        .and(warp::get())
        .and(blockchain_filter.clone())
        .and_then(handle_supply);

    let transfer_route = warp::path!("api" / "transfer")
        .and(warp::post())
        .and(warp::body::json())
        .and(blockchain_filter.clone())
        .and_then(handle_transfer);

    let mint_route = warp::path!("api" / "mint")
        .and(warp::post())
        .and(warp::body::json())
        .and(blockchain_filter.clone())
        .and_then(handle_mint);

    let blockchain_route = warp::path!("api" / "blockchain")
        .and(warp::get())
        .and(blockchain_filter.clone())
        .and_then(handle_chain);

    let routes = static_files
        .or(balance_route)
        .or(total_supply_route)
        .or(transfer_route)
        .or(mint_route)
        .or(blockchain_route)
        .with(cors);

    warp::serve(routes).run(([127, 0, 0, 1], 3030)).await;
}

async fn handle_balance(user_id: String, blockchain: Arc<Mutex<Blockchain>>) -> Result<impl warp::Reply, warp::Rejection> {
    let chain = blockchain.lock().await;
    let balance = chain.get_balance(&user_id);
    Ok(warp::reply::json(&ApiResponse::success(balance)))
}

async fn handle_supply(blockchain: Arc<Mutex<Blockchain>>) -> Result<impl warp::Reply, warp::Rejection> {
    let chain = blockchain.lock().await;
    let supply = chain.get_total_supply();
    Ok(warp::reply::json(&ApiResponse::success(supply)))
}

async fn handle_transfer(req: TransferRequest, blockchain: Arc<Mutex<Blockchain>>) -> Result<impl warp::Reply, warp::Rejection> {
    let tx = Transaction::new(req.from, req.to, req.amount, TransactionType::Transfer);
    let mut chain = blockchain.lock().await;

    match chain.add_transaction(tx) {
        Ok(_) => Ok(warp::reply::json(&ApiResponse::success("Transfer successful"))),
        Err(e) => Ok(warp::reply::json(&ApiResponse::<String>::error(e))),
    }
}

async fn handle_mint(req: MintRequest, blockchain: Arc<Mutex<Blockchain>>) -> Result<impl warp::Reply, warp::Rejection> {
    let tx = Transaction::new(req.minter.clone(), req.to, req.amount, TransactionType::Mint);
    let mut chain = blockchain.lock().await;

    match chain.add_transaction(tx) {
        Ok(_) => Ok(warp::reply::json(&ApiResponse::success("Mint successful"))),
        Err(e) => Ok(warp::reply::json(&ApiResponse::<String>::error(e))),
    }
}

async fn handle_chain(blockchain: Arc<Mutex<Blockchain>>) -> Result<impl warp::Reply, warp::Rejection> {
    let chain = blockchain.lock().await;
    Ok(warp::reply::json(&ApiResponse::success(&*chain)))
}
