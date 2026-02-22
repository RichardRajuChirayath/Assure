# Setup Real Blockchain for Assure 🔐⛓️

Follow these steps to move from **Virtual Mode** to the **Actual Polygon Amoy Testnet**.

## 1. Prepare your Wallet
1. Install [MetaMask](https://metamask.io/).
2. Add the **Polygon Amoy Testnet** to MetaMask.
   - Network Name: Polygon Amoy
   - RPC URL: `https://rpc-amoy.polygon.technology`
   - Chain ID: `80002`
   - Currency: `MATIC`
3. Copy your Wallet Address.

## 2. Get Free Test MATIC
1. Go to the [Polygon Faucet](https://faucet.polygon.technology/).
2. Paste your address and request **Amoy MATIC**.
3. Wait ~1 minute; you will now have "Free Money" to pay for transactions.

## 3. Deploy the Smart Contract
1. Go to [Remix IDE](https://remix.ethereum.org/).
2. Create `AuditAnchor.sol` and paste the code from `contracts/AuditAnchor.sol`.
3. Compile (Ctrl+S).
4. In "Deploy & Run Transactions":
   - Environment: **Injected Provider - MetaMask**.
   - Click **Deploy**.
5. Once deployed, copy the **Contract Address**.

## 4. Configure Assure
Update your `d:/FS/failfast/.env` file with these values:

```env
# The address of your deployed contract
NEXT_PUBLIC_AUDIT_CONTRACT="0xYOUR_CONTRACT_ADDRESS"

# Get a free API KEY from Alchemy.com or Infura.io
AMOY_RPC_URL="https://polygon-amoy.g.alchemy.com/v2/YOUR_API_KEY"

# YOUR WALLET PRIVATE KEY (Keep this secret!)
BLOCKCHAIN_PRIVATE_KEY="YOUR_WALLET_PRIVATE_KEY"
```

## 5. Restart the System
Restart your terminal processes. Now, when you analyze a command, Assure will **actually broadcast** the hash to the global Polygon network!

---
*Note: Once these variables are set, the "Virtual Mode" will automatically deactivate and the "Real Mode" will take over.*
