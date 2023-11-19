export const DEVELOPER_MODE = true;
export const EAS_CONTRACT_ADDRESS: string | undefined = DEVELOPER_MODE
  ? '0xC2679fBD37d54388Ce493F1DB75320D236e1815e'
  : process.env.EAS_CONTRACT_ADDRESS_PROD;
export const SCHEMA_UID: string = DEVELOPER_MODE
  ? process.env.EAS_SCHEMAUID_TESTNET ||
    '0xea35328b80660a235c0d20977d5544ce953fd1000bb3220b5ce416322480c10e'
  : process.env.EAS_SCHEMAUID_PROD ||
    '0xea35328b80660a235c0d20977d5544ce953fd1000bb3220b5ce416322480c10e';
export const SEPHOLIA_RPC_URL: string =
  process.env.SEPHOLIA_RPC_URL || 'https://rpc.notadegen.com/eth/sepolia';
export const SCHEMA_STRUCT: string =
  'address userAddress,uint64 itemID,uint64 paymentChainID,uint64 itemChainID,uint64 offerType,uint256 offerPrice';
export const SCHEMA_REGISTRY: string = DEVELOPER_MODE
  ? process.env.EAS_SCHEMA_REGISTRY_SEPHOLIA!
  : '0x0a7E2Ff54e76B8E6659aedc9103FB21c038050D0';
export const EASSCAN_URI: string =
  process.env.EASSCAN_URI || 'https://sepolia.easscan.org';
