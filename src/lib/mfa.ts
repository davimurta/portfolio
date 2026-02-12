import * as crypto from 'crypto'

// TOTP Configuration
const TOTP_DIGITS = 6
const TOTP_STEP = 30 // seconds
const TOTP_WINDOW = 1 // allow 1 step before/after

export function generateMFASecret(length = 20): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
  const bytes = crypto.randomBytes(length)
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars[bytes[i] % 32]
  }
  return result
}

// Decode base32 to buffer
function base32Decode(encoded: string): Buffer {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
  let bits = ''

  for (const char of encoded.toUpperCase()) {
    const val = chars.indexOf(char)
    if (val === -1) continue
    bits += val.toString(2).padStart(5, '0')
  }

  const bytes: number[] = []
  for (let i = 0; i + 8 <= bits.length; i += 8) {
    bytes.push(parseInt(bits.substring(i, i + 8), 2))
  }

  return Buffer.from(bytes)
}

// Generate HOTP value
function generateHOTP(secret: Buffer, counter: bigint): string {
  const counterBuffer = Buffer.alloc(8)
  counterBuffer.writeBigUInt64BE(counter)

  const hmac = crypto.createHmac('sha1', secret)
  hmac.update(counterBuffer)
  const hash = hmac.digest()

  const offset = hash[hash.length - 1] & 0xf
  const binary =
    ((hash[offset] & 0x7f) << 24) |
    ((hash[offset + 1] & 0xff) << 16) |
    ((hash[offset + 2] & 0xff) << 8) |
    (hash[offset + 3] & 0xff)

  const otp = binary % Math.pow(10, TOTP_DIGITS)
  return otp.toString().padStart(TOTP_DIGITS, '0')
}

// Generate current TOTP token
export function generateMFAToken(secret: string): string {
  const secretBuffer = base32Decode(secret)
  const counter = BigInt(Math.floor(Date.now() / 1000 / TOTP_STEP))
  return generateHOTP(secretBuffer, counter)
}

// Verify TOTP token with window
export function verifyMFAToken(token: string, secret: string): boolean {
  const secretBuffer = base32Decode(secret)
  const currentCounter = BigInt(Math.floor(Date.now() / 1000 / TOTP_STEP))

  // Check current and adjacent time windows
  for (let i = -TOTP_WINDOW; i <= TOTP_WINDOW; i++) {
    const counter = currentCounter + BigInt(i)
    const expectedToken = generateHOTP(secretBuffer, counter)

    if (token === expectedToken) {
      return true
    }
  }

  return false
}

// Generate otpauth URL for QR code
export function generateOTPAuthURL(email: string, secret: string): string {
  const issuer = encodeURIComponent('Portfolio Admin')
  const account = encodeURIComponent(email)
  return `otpauth://totp/${issuer}:${account}?secret=${secret}&issuer=${issuer}&digits=${TOTP_DIGITS}&period=${TOTP_STEP}`
}
