type ArTxParams = {
	target?: string
	quantity?: string
	ar?: string
	winston?: string
	reward?: string
	arReward?: string
	winstonReward?: string
	tags?: Tag[]
	data?: import('arweave/web').CreateTransactionInterface['data'] | string
}

type ArDataItemParams = {
	data: Uint8Array | string
	tags?: Tag[]
	target?: string
	path?: string
	key?: string
}

type Tag = { name: string, value: string, key?: string }