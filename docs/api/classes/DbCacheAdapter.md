[@ai16z/eliza v0.1.5-alpha.5](../index.md) / DbCacheAdapter

# Class: DbCacheAdapter

## Implements

- [`ICacheAdapter`](../interfaces/ICacheAdapter.md)

## Constructors

### new DbCacheAdapter()

> **new DbCacheAdapter**(`db`, `agentId`): [`DbCacheAdapter`](DbCacheAdapter.md)

#### Parameters

• **db**: [`IDatabaseCacheAdapter`](../interfaces/IDatabaseCacheAdapter.md)

• **agentId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

#### Returns

[`DbCacheAdapter`](DbCacheAdapter.md)

#### Defined in

<<<<<<< HEAD
[packages/core/src/cache.ts:70](https://github.com/konstantine25b/eliza/blob/main/packages/core/src/cache.ts#L70)
=======
[packages/core/src/cache.ts:70](https://github.com/ai16z/eliza/blob/main/packages/core/src/cache.ts#L70)
>>>>>>> main

## Methods

### get()

> **get**(`key`): `Promise`\<`string`\>

#### Parameters

• **key**: `string`

#### Returns

`Promise`\<`string`\>

#### Implementation of

[`ICacheAdapter`](../interfaces/ICacheAdapter.md).[`get`](../interfaces/ICacheAdapter.md#get)

#### Defined in

<<<<<<< HEAD
[packages/core/src/cache.ts:75](https://github.com/konstantine25b/eliza/blob/main/packages/core/src/cache.ts#L75)
=======
[packages/core/src/cache.ts:75](https://github.com/ai16z/eliza/blob/main/packages/core/src/cache.ts#L75)
>>>>>>> main

***

### set()

> **set**(`key`, `value`): `Promise`\<`void`\>

#### Parameters

• **key**: `string`

• **value**: `string`

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`ICacheAdapter`](../interfaces/ICacheAdapter.md).[`set`](../interfaces/ICacheAdapter.md#set)

#### Defined in

<<<<<<< HEAD
[packages/core/src/cache.ts:79](https://github.com/konstantine25b/eliza/blob/main/packages/core/src/cache.ts#L79)
=======
[packages/core/src/cache.ts:79](https://github.com/ai16z/eliza/blob/main/packages/core/src/cache.ts#L79)
>>>>>>> main

***

### delete()

> **delete**(`key`): `Promise`\<`void`\>

#### Parameters

• **key**: `string`

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`ICacheAdapter`](../interfaces/ICacheAdapter.md).[`delete`](../interfaces/ICacheAdapter.md#delete)

#### Defined in

<<<<<<< HEAD
[packages/core/src/cache.ts:83](https://github.com/konstantine25b/eliza/blob/main/packages/core/src/cache.ts#L83)
=======
[packages/core/src/cache.ts:83](https://github.com/ai16z/eliza/blob/main/packages/core/src/cache.ts#L83)
>>>>>>> main
