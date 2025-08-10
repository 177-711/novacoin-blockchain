use crate::token::Token;
use crate::transaction::{Transaction, TransactionType};
use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};
use chrono::{DateTime, Utc};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Block {
    pub index: u64,
    pub timestamp: DateTime<Utc>,
    pub transactions: Vec<Transaction>,
    pub previous_hash: String,
    pub hash: String,
}

impl Block {
    pub fn new(index: u64, transactions: Vec<Transaction>, previous_hash: String) -> Self {
        let timestamp = Utc::now();
        let hash = Self::calculate_hash(index, &timestamp, &transactions, &previous_hash);

        Block {
            index,
            timestamp,
            transactions,
            previous_hash,
            hash,
        }
    }

    fn calculate_hash(
        index: u64,
        timestamp: &DateTime<Utc>,
        transactions: &[Transaction],
        previous_hash: &str,
    ) -> String {
        let mut hasher = Sha256::new();
        hasher.update(format!(
            "{}{}{:?}{}",
            index,
            timestamp.timestamp(),
            transactions,
            previous_hash
        ));
        hex::encode(hasher.finalize())
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Blockchain {
    pub chain: Vec<Block>,
    pub token: Token,
}

impl Blockchain {
    pub fn new(token_name: String, token_symbol: String, initial_supply: u64, creator: String) -> Self {
        let token = Token::new(token_name, token_symbol, initial_supply, creator.clone());

        let genesis_transaction = Transaction::new(
            "genesis".to_string(),
            creator,
            initial_supply,
            TransactionType::Genesis,
        );

        let genesis_block = Block::new(0, vec![genesis_transaction], "0".to_string());

        Blockchain {
            chain: vec![genesis_block],
            token,
        }
    }

    pub fn add_transaction(&mut self, transaction: Transaction) -> Result<(), String> {
        match transaction.tx_type {
            TransactionType::Transfer => {
                self.token
                    .transfer(&transaction.from, &transaction.to, transaction.amount)?;
            }
            TransactionType::Mint => {
                self.token
                    .mint(&transaction.to, transaction.amount, &transaction.from)?;
            }
            TransactionType::Genesis => {}
        }

        let previous_hash = self.chain.last().unwrap().hash.clone();
        let new_block = Block::new(self.chain.len() as u64, vec![transaction], previous_hash);

        self.chain.push(new_block);
        Ok(())
    }

    pub fn get_balance(&self, user_id: &str) -> u64 {
        self.token.get_balance(user_id)
    }

    pub fn get_total_supply(&self) -> u64 {
        self.token.total_supply
    }
}