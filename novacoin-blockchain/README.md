# NovaCoin Blockchain (Fungible Token + UI)

Simple educational blockchain-like ledger written in Rust with a modern, static frontend.

## Features
- Fungible token with balances, total supply, and creator-controlled mint
- Minimal blockchain that records each transaction in a new block
- REST API with Warp (Rust)
- Modern static UI (no framework) to transfer and mint

## Project Structure
```
novacoin-blockchain/
├── backend/
│   ├── Cargo.toml
│   └── src/
│       ├── api.rs
│       ├── blockchain.rs
│       ├── main.rs
│       ├── token.rs
│       └── transaction.rs
├── frontend/
│   ├── index.html
│   ├── script.js
│   └── style.css
├── .gitignore
└── README.md
```

## Prerequisites
- Rust toolchain (cargo)

## Run
1) Start server
```
cargo run
```
The server will listen on http://localhost:3030 and serve the UI from `frontend/`.

2) Open the app
- Open `http://localhost:3030` in your browser

## API
- GET `/api/balance/:userId`
- GET `/api/supply`
- POST `/api/transfer` { from, to, amount }
- POST `/api/mint` { minter, to, amount }
- GET `/api/blockchain`

## Notes
- Default creator is `creator` with initial supply of 1,000,000 NOVA
- This is not a production blockchain. No PoW/PoS or p2p networking; just an in-memory ledger for learning

## Publish to GitHub
```
git init
git add .
git commit -m "NovaCoin: minimal fungible token with UI"
git branch -M main
git remote add origin <your_repo_url>
git push -u origin main
```