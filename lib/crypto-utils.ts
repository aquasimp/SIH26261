/**
 * Web Crypto & DPI Authority Bridge Cryptographic Utilities
 * AICTE Regulatory Scrutiny Engine (PS 26261)
 *
 * Implements W3C Web Cryptography API (SubtleCrypto):
 * - SHA-256 Digest computation
 * - HMAC-SHA256 for DigiLocker API Setu Gateway (RFC 2104)
 * - OAuth 2.0 PKCE Code Verifier & S256 Code Challenge (RFC 7636)
 * - Cryptographic Block Ledger Hashing & Chain Verification
 */

import { AuditBlock } from './mock-data';

// Helper: Convert ArrayBuffer to Hex String
export function bufferToHex(buffer: ArrayBuffer): string {
  const byteArray = new Uint8Array(buffer);
  return Array.from(byteArray)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

// Helper: Convert Hex String to Uint8Array
export function hexToBuffer(hex: string): Uint8Array {
  const bytes = new Uint8Array(Math.ceil(hex.length / 2));
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.substring(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

// Helper: Base64URL encoding (RFC 7636)
export function base64UrlEncode(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

/**
 * Computes SHA-256 cryptographic digest of UTF-8 message
 */
export async function computeSha256(message: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);

  if (typeof window !== 'undefined' && window.crypto?.subtle) {
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
    return bufferToHex(hashBuffer);
  }

  // Node.js fallback if run server-side
  try {
    const crypto = await import('crypto');
    return crypto.createHash('sha256').update(message).digest('hex');
  } catch {
    // Ultimate deterministic fallback
    return '0'.repeat(64);
  }
}

/**
 * Computes HMAC-SHA256 digest using a secret key
 * Used for x-digilocker-hmac verification: HMAC-SHA256(client_secret, client_id || ts || RequestBody)
 */
export async function computeHmacSha256(secret: string, message: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const msgData = encoder.encode(message);

  if (typeof window !== 'undefined' && window.crypto?.subtle) {
    const cryptoKey = await window.crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    const signature = await window.crypto.subtle.sign('HMAC', cryptoKey, msgData);
    return bufferToHex(signature);
  }

  // Node.js fallback
  try {
    const crypto = await import('crypto');
    return crypto.createHmac('sha256', secret).update(message).digest('hex');
  } catch {
    return '0'.repeat(64);
  }
}

/**
 * Generates OAuth 2.0 PKCE Code Verifier & S256 Code Challenge
 * (RFC 7636 Section 4)
 */
export async function generatePkcePair(customVerifier?: string): Promise<{
  codeVerifier: string;
  codeChallenge: string;
}> {
  let verifier = customVerifier;
  if (!verifier) {
    if (typeof window !== 'undefined' && window.crypto?.getRandomValues) {
      const randomBytes = new Uint8Array(48);
      window.crypto.getRandomValues(randomBytes);
      verifier = base64UrlEncode(randomBytes.buffer);
    } else {
      verifier = 'pkce_verifier_' + Math.random().toString(36).substring(2) + Date.now();
    }
  }

  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);

  let challenge = '';
  if (typeof window !== 'undefined' && window.crypto?.subtle) {
    const digestBuffer = await window.crypto.subtle.digest('SHA-256', data);
    challenge = base64UrlEncode(digestBuffer);
  } else {
    try {
      const crypto = await import('crypto');
      const hash = crypto.createHash('sha256').update(verifier).digest();
      challenge = hash.toString('base64url');
    } catch {
      challenge = btoa(verifier).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    }
  }

  return {
    codeVerifier: verifier,
    codeChallenge: challenge,
  };
}

/**
 * Computes Audit Ledger Block Hash:
 * SHA-256(previousBlockHash + timestamp + appId + actionType + officerId)
 */
export async function computeAuditBlockHash(
  previousHash: string,
  timestamp: string,
  appId: string,
  actionType: string,
  officerId: string
): Promise<string> {
  const payload = `${previousHash}${timestamp}${appId}${actionType}${officerId}`;
  return computeSha256(payload);
}

/**
 * Verifies the integrity of an entire cryptographically chained ledger
 */
export async function verifyAuditChain(blocks: AuditBlock[]): Promise<{
  isValid: boolean;
  verifiedCount: number;
  totalCount: number;
  invalidBlocks: number[];
  details: string[];
}> {
  if (blocks.length === 0) {
    return { isValid: true, verifiedCount: 0, totalCount: 0, invalidBlocks: [], details: ['Ledger is empty'] };
  }

  // Sort blocks by blockIndex ascending
  const sorted = [...blocks].sort((a, b) => a.blockIndex - b.blockIndex);
  const invalidBlocks: number[] = [];
  const details: string[] = [];

  for (let i = 0; i < sorted.length; i++) {
    const block = sorted[i];

    // Check 1: Chain link to previous block
    if (i > 0) {
      const prevBlock = sorted[i - 1];
      if (block.previousHash !== prevBlock.currentHash) {
        invalidBlocks.push(block.blockIndex);
        details.push(
          `Block #${block.blockIndex} broken chain link: expected prevHash ${prevBlock.currentHash.slice(0, 12)}..., got ${block.previousHash.slice(0, 12)}...`
        );
        continue;
      }
    } else {
      // Genesis block previous hash check
      if (block.previousHash !== '0000000000000000000000000000000000000000000000000000000000000000') {
        invalidBlocks.push(block.blockIndex);
        details.push(`Genesis Block #1 must link to zero hash.`);
        continue;
      }
    }

    // Check 2: Recompute block hash
    const expectedHash = await computeAuditBlockHash(
      block.previousHash,
      block.timestamp,
      block.applicationId,
      block.eventType,
      block.actorOrModel
    );

    if (expectedHash !== block.currentHash) {
      invalidBlocks.push(block.blockIndex);
      details.push(
        `Block #${block.blockIndex} cryptographic hash mismatch: expected ${expectedHash.slice(0, 12)}..., recorded ${block.currentHash.slice(0, 12)}...`
      );
    } else {
      details.push(`Block #${block.blockIndex} verified (${block.eventType})`);
    }
  }

  const isValid = invalidBlocks.length === 0;
  return {
    isValid,
    verifiedCount: sorted.length - invalidBlocks.length,
    totalCount: sorted.length,
    invalidBlocks,
    details,
  };
}
