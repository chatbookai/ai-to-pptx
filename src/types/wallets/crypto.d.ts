type PrivateKey = import('arweave/web/lib/wallet').JWKInterface

type EncryptedContent = {
	ciphertext: number[]
	derivationSettings: DerivationSettings
}

type DerivationSettings = {
	iv: number[]
	salt: number[]
	importAlgorithm: Parameters<typeof window.crypto.subtle.importKey>[2]
	derivationAlgorithm: Pbkdf2Params
	derivedKeyAlgorithm: AesKeyGenParams
}