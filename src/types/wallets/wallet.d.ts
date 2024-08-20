type WalletDataInterface = {
	id: string
	uuid?: string
	jwk?: PrivateKey | EncryptedContent
	provider?: ProviderId
	data?: { [name in ProviderId]?: { key?: string, publicKey?: string } }
	state?: { hot?: true }
	settings?: {
		sync?: boolean
		securityLevel?: 'always' | 'inactivity' | undefined
	}
}

type Wallet = Widen<InstanceType<AnyProvider>>

interface Provider extends Account {
	metadata: InstanceMetadata<this>
	messageVerifier: any
	messageRunner: MessageRunner<{}, this>
	signTransaction?: (...args: any) => Promise<any>
	sign?: (data: ArrayBufferView, options: any) => Promise<ArrayBufferView>
	decrypt?: (data: ArrayBufferView, options: any) => Promise<ArrayBufferView>
	download?: () => Promise<any> // todo extract from providers
	destructor?: () => any
}

interface Account {
	metadata: DisplayMetadata
	key?: string
	balance?: string
	reserved_rewards_total?: string
	queries: { query: any, name: string, color: string }[]
	queryBalance: any
	PendingTxsAmount: number
	destructor?: () => any
}

type ExternalAPI = { [key: string]: (...args: any) => any }

type MessageRunner<API extends ExternalAPI, Parent> = {
	get methodMap(): { [key in keyof API]: MethodMetadataExtended<Parent> }
} & {
	[key in keyof API]: (...args: Parameters<API[key]>) => ReturnType<API[key]>
}




type AccountMetadata = DisplayMetadata & {
	isAddress: (address?: string, partial?: boolean) => boolean
}

type ProviderMetadata = AccountMetadata & {
	id: ProviderId
	disabled?: boolean
	isProviderFor?: (wallet: Partial<WalletDataInterface>) => boolean
	addPassphrase?: (passphrase: string) => Promise<Partial<WalletDataInterface>>
	addKeyfile?: (keyfile?: string) => Promise<Partial<WalletDataInterface>>
	addAddress?: (address: string) => Promise<Partial<WalletDataInterface>>
	addImportData: (data?: Partial<WalletDataInterface>, options?: ImportOptions) => Promise<Partial<WalletDataInterface>>
	actions?: Action[]
	componentSettings?: any
}

type InstanceMetadata<T> = ProviderMetadata & {
	methods: { [keys in keyof T]?: MethodMetadata }
}

type MethodMetadata = {
	skip?: boolean
	unavailable?: boolean
	userIntent?: boolean
	public?: boolean
}

type MethodMetadataPermission = {
	name?: string
}

type MethodMetadataRecursive<Parent> = MethodMetadata | keyof Parent
	| { or: Readonly<MethodMetadataRecursive<Parent>[]> }
	| { and: Readonly<MethodMetadataRecursive<Parent>[]> }

type MethodMetadataExtended<Parent> = MethodMetadataRecursive<Parent>
	| { metadata: MethodMetadataRecursive<Parent>, permission: MethodMetadataPermission }

type ImportOptions = Partial<{
	address: string
}>