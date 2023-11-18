import { SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
export function getSchemaEncoder(): SchemaEncoder {
    return new SchemaEncoder('address userAddress,uint64 itemID,uint64 paymentChainID,uint64 itemChainID,uint64 offerType,uint256 offerPrice');
  }