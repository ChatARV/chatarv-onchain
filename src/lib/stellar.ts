import { StrKey } from "@stellar/stellar-sdk";
import { sha256Hex } from "./hash";

export type StellarNetwork = "testnet" | "public";

/**
 * Deterministically derives a validly-checksummed but non-existent Stellar
 * contract id from a seed string. Used only for mock/placeholder data — no
 * contract with this id is deployed.
 */
export function fakeContractId(seed: string): string {
  const digestHex = sha256Hex(`contract:${seed}`);
  const bytes = Buffer.from(digestHex, "hex").subarray(0, 32);
  return StrKey.encodeContract(bytes);
}

/** Deterministically derives a fake account (G...) address from a seed. */
export function fakeAccountId(seed: string): string {
  const digestHex = sha256Hex(`account:${seed}`);
  const bytes = Buffer.from(digestHex, "hex").subarray(0, 32);
  return StrKey.encodeEd25519PublicKey(bytes);
}

/** Deterministically derives a fake 64-char hex transaction hash from a seed. */
export function fakeTxHash(seed: string): string {
  return sha256Hex(`tx:${seed}`);
}

export function truncateMiddle(value: string, head = 6, tail = 6): string {
  if (value.length <= head + tail + 3) return value;
  return `${value.slice(0, head)}…${value.slice(-tail)}`;
}

export function explorerContractUrl(
  contractId: string,
  network: StellarNetwork = "public",
): string {
  return `https://stellar.expert/explorer/${network}/contract/${contractId}`;
}

export function explorerTxUrl(
  txHash: string,
  network: StellarNetwork = "public",
): string {
  return `https://stellar.expert/explorer/${network}/tx/${txHash}`;
}

export function explorerAccountUrl(
  accountId: string,
  network: StellarNetwork = "public",
): string {
  return `https://stellar.expert/explorer/${network}/account/${accountId}`;
}

/** Clearly-marked placeholder oracle contract ids — no real contract is deployed at these addresses. */
export const ORACLE_CONTRACT_IDS = {
  testnet: fakeContractId("chatarv-oracle-testnet-placeholder"),
  public: fakeContractId("chatarv-oracle-mainnet-placeholder"),
} as const;
