import crypto from "crypto";

export interface IpfsUploadResult {
  cid: string;
  name: string;
  size: number;
  mimeType: string;
  gatewayUrl: string;
  isMock: boolean;
}

/**
 * Upload a file buffer to IPFS via Pinata API (or deterministic mock if API key is not configured)
 */
export async function uploadToIPFS(
  buffer: Buffer,
  fileName: string,
  mimeType: string
): Promise<IpfsUploadResult> {
  const pinataJwt = process.env.PINATA_JWT;
  const pinataApiKey = process.env.PINATA_API_KEY;
  const pinataSecretKey = process.env.PINATA_SECRET_API_KEY;

  // Real Pinata upload if credentials configured
  if (pinataJwt || (pinataApiKey && pinataSecretKey)) {
    try {
      const formData = new FormData();
      const blob = new Blob([new Uint8Array(buffer)], { type: mimeType });
      formData.append("file", blob, fileName);

      const metadata = JSON.stringify({
        name: fileName,
        keyvalues: {
          project: "euthial-protocol",
          uploadedAt: new Date().toISOString(),
        },
      });
      formData.append("pinataMetadata", metadata);

      const headers: Record<string, string> = {};
      if (pinataJwt) {
        headers["Authorization"] = `Bearer ${pinataJwt}`;
      } else {
        headers["pinata_api_key"] = pinataApiKey!;
        headers["pinata_secret_api_key"] = pinataSecretKey!;
      }

      const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
        method: "POST",
        headers,
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        const cid = data.IpfsHash;
        return {
          cid,
          name: fileName,
          size: buffer.length,
          mimeType,
          gatewayUrl: `https://gateway.pinata.cloud/ipfs/${cid}`,
          isMock: false,
        };
      }
      console.warn("Pinata upload returned status:", res.status, await res.text());
    } catch (err) {
      console.warn("Pinata API call failed, falling back to deterministic CID:", err);
    }
  }

  // Fallback: Generate cryptographic multihash-formatted CID
  // Qm... format (Base58 CIDv0 format from sha256)
  const hash = crypto.createHash("sha256").update(buffer).digest();
  // IPFS CIDv0 has 0x12 (sha256) and 0x20 (32 bytes) prefix
  const cidBytes = Buffer.concat([Buffer.from([0x12, 0x20]), hash]);
  
  // Base58 encoder for CID
  const ALPHABET = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
  let num = BigInt("0x" + cidBytes.toString("hex"));
  let encoded = "";
  while (num > 0n) {
    const rem = num % 58n;
    num = num / 58n;
    encoded = ALPHABET[Number(rem)] + encoded;
  }
  const cid = encoded;

  return {
    cid,
    name: fileName,
    size: buffer.length,
    mimeType,
    gatewayUrl: `https://ipfs.io/ipfs/${cid}`,
    isMock: true,
  };
}
