// app/features/wallet/constants/contracts.ts

// USDC testnet token contract on Unichain Sepolia
export const USDC_CONTRACT_ADDRESS =
  "0x31d0220469e10c4E71834a79b1f276d740d3768F";

// ABI (Application Binary Interface) for the USDC token contract
export const USDC_ABI = [
  {
    // Function to transfer USDC tokens
    constant: false,
    inputs: [
      { name: "_to", type: "address" },
      { name: "_value", type: "uint256" },
    ],
    name: "transfer",
    outputs: [{ name: "", type: "bool" }],
    type: "function",
  },
  {
    // Function to get the balance of USDC tokens for a specific address
    constant: true,
    inputs: [{ name: "_owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "balance", type: "uint256" }],
    type: "function",
  },
  {
    // Event emitted when tokens are transferred
    anonymous: false,
    inputs: [
      { indexed: true, name: "from", type: "address" },
      { indexed: true, name: "to", type: "address" },
      { indexed: false, name: "value", type: "uint256" },
    ],
    name: "Transfer",
    type: "event",
  },
];
