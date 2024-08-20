type ProviderId = import('@/functions/Wallets').ProviderId
type AnyProvider = import('@/functions/Wallets').AnyProvider
type FileWithPath = import('file-selector').FileWithPath & { normalizedPath?: string }
type AnyFile = import('@/functions/Transactions').AnyFile
type AnyTransaction = Widen<import('arweave/web/lib/transaction').default | import('arweave-graphql').Transaction>
type AllRouteNames = import('@/router/index').AllRouteNames
type Router = import('vue-router').RouterAlt
type Route = import('vue-router').RouteLocationRawAlt