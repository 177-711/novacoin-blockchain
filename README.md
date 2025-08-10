<<<<<<< HEAD
# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
=======
# 🌟 NovaCoin Dashboard

A sleek, production-ready dashboard for NovaCoin—a decentralized token project showcasing full-stack blockchain integration, modular architecture, and branded UI/UX. Built with Rust backend, TypeScript/React frontend, and smart contract connectivity.

## 🚀 Features

- 🔗 Wallet connection via MetaMask
- 📜 Smart contract integration (ERC-20 / custom logic)
- ⚛️ Modular React components with TypeScript
- 🎨 Tailwind-powered UI with custom branding
- ✅ Atomic, reproducible builds
- 🌐 Vercel deployment-ready

## 🛠️ Tech Stack

| Layer        | Tech Used                          |
|--------------|------------------------------------|
| Frontend     | React, TypeScript, Tailwind CSS    |
| Backend      | Rust (modular API architecture)    |
| Blockchain   | Solidity, Ethers.js                |
| Deployment   | Vercel, GitHub Actions             |
| Tooling      | ESLint, Prettier, PostCSS          |

## 📦 Setup Instructions

### 1. Clone the repo

```bash
git clone https://github.com/177-711/novacoin-dashboard.git
cd novacoin-dashboard
>>>>>>> 59fe276 (docs: replace default Vite README with NovaCoin dashboard)
