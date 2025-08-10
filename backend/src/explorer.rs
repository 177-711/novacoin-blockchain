// src/explorer.rs
use crate::blockchain::Block;

pub fn get_transaction_history(blocks: &Vec<Block>) -> Vec<String> {
    blocks.iter()
        .flat_map(|block| block.transactions.clone())
        .collect()
}