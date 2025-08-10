use serde::{Deserialize, Serialize};
use chrono::{DateTime, Utc};
use sha2::{Digest, Sha256};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Transaction {
    pub id: String,
    pub from: String,
    pub to: String,
    pub amount: u64,
    pub timestamp: DateTime<Utc>,
    pub tx_type: TransactionType,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum TransactionType {
    Transfer,
    Mint,
    Genesis,
}

impl Transaction {
    pub fn new(from: String, to: String, amount: u64, tx_type: TransactionType) -> Self {
        let timestamp = Utc::now();
        let id = Self::generate_id(&from, &to, amount, &timestamp);

        Transaction {
            id,
            from,
            to,
            amount,
            timestamp,
            tx_type,
        }
    }

    fn generate_id(from: &str, to: &str, amount: u64, timestamp: &DateTime<Utc>) -> String {
        let mut hasher = Sha256::new();
        hasher.update(format!("{}{}{}{}", from, to, amount, timestamp.timestamp()))
        ;
        hex::encode(hasher.finalize())
    }
}