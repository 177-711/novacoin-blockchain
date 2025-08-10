use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Token {
    pub name: String,
    pub symbol: String,
    pub total_supply: u64,
    pub balances: HashMap<String, u64>,
    pub creator: String,
}

impl Token {
    pub fn new(name: String, symbol: String, initial_supply: u64, creator: String) -> Self {
        let mut balances = HashMap::new();
        balances.insert(creator.clone(), initial_supply);
        
        Token {
            name,
            symbol,
            total_supply: initial_supply,
            balances,
            creator,
        }
    }

    pub fn get_balance(&self, user_id: &str) -> u64 {
        *self.balances.get(user_id).unwrap_or(&0)
    }

    pub fn transfer(&mut self, from: &str, to: &str, amount: u64) -> Result<(), String> {
        let from_balance = self.get_balance(from);
        
        if from_balance < amount {
            return Err("Insufficient balance".to_string());
        }

        // Deduct from sender
        self.balances.insert(from.to_string(), from_balance - amount);
        
        // Add to receiver
        let to_balance = self.get_balance(to);
        self.balances.insert(to.to_string(), to_balance + amount);

        Ok(())
    }

    pub fn mint(&mut self, to: &str, amount: u64, minter: &str) -> Result<(), String> {
        if minter != self.creator {
            return Err("Only creator can mint tokens".to_string());
        }

        let current_balance = self.get_balance(to);
        self.balances.insert(to.to_string(), current_balance + amount);
        self.total_supply += amount;

        Ok(())
    }
}