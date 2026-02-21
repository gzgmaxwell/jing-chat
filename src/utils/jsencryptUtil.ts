// utils/encrypt.ts
import JSEncrypt from 'jsencrypt'

// 示例公钥，请替换为后端提供的实际公钥
const PUBLIC_KEY = `MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCCxwKFSELNk7+aoZlp0E3EYmh/UeJKVb2ixjg19vXx5ZFMA8sJOJl/aUPGhMAJKuxsAdoRSwzXIdSNX+IVdt5J/fFmuwL0n3Igxt6ZUwRj3pEUgMRMZIiO1ZPdP2PpyGfVOMlrOip4zHP6hWJSfFRlu7cR44rxRbRCIq6wxZlFqQIDAQAB`

/**
 * 使用 RSA 公钥加密数据
 * @param data 待加密的明文数据
 * @returns 加密后的密文 (Base64 编码字符串) 或 false (加密失败时)
 */
export function rsaEncrypt(data: string): string | false {
  const encryptor = new JSEncrypt()
  encryptor.setPublicKey(PUBLIC_KEY)
  return encryptor.encrypt(data)
}
