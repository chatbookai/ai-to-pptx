import Secrets from 'secrets.js'

export function fromHex (data: string) { return Secrets.hex2str(data, 1) }

export function toHex (data: string) { return Secrets.str2hex(data, 1) }

export function hexToBase64 (hexString: string): string {
	
	return btoa(hexString.match(/\w{2}/g)!.map(function (a) {
		
		return String.fromCharCode(parseInt(a, 16))
	}).join('')).replace(/=+$/, '')
}

export function base64ToHex (base64String: string): string {
	
	return atob(base64String).split('').map(function (c) {
		return ('0' + c.charCodeAt(0).toString(16)).slice(-2)
	}).join('')
}

export function encode (text: string) {
	const encoder = new TextEncoder()
	
	return encoder.encode(text)
}

export function decode (buffer: BufferSource) {
	const decoder = new TextDecoder()
	
	return decoder.decode(buffer)
}