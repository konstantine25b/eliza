[@ai16z/eliza v0.1.5-alpha.5](../index.md) / CacheManager

# Class: CacheManager\<CacheAdapter\>

## Type Parameters

• **CacheAdapter** *extends* [`ICacheAdapter`](../interfaces/ICacheAdapter.md) = [`ICacheAdapter`](../interfaces/ICacheAdapter.md)

## Implements

- [`ICacheManager`](../interfaces/ICacheManager.md)

## Constructors

### new CacheManager()

> **new CacheManager**\<`CacheAdapter`\>(`adapter`): [`CacheManager`](CacheManager.md)\<`CacheAdapter`\>

#### Parameters

• **adapter**: `CacheAdapter`

#### Returns

[`CacheManager`](CacheManager.md)\<`CacheAdapter`\>

#### Defined in

<<<<<<< HEAD
[packages/core/src/cache.ts:93](https://github.com/ai16z/eliza/blob/main/packages/core/src/cache.ts#L93)
=======
[packages/core/src/cache.ts:93](https://github.com/konstantine25b/eliza/blob/main/packages/core/src/cache.ts#L93)
>>>>>>> founderlist

## Properties

### adapter

> **adapter**: `CacheAdapter`

#### Defined in

<<<<<<< HEAD
[packages/core/src/cache.ts:91](https://github.com/ai16z/eliza/blob/main/packages/core/src/cache.ts#L91)
=======
[packages/core/src/cache.ts:91](https://github.com/konstantine25b/eliza/blob/main/packages/core/src/cache.ts#L91)
>>>>>>> founderlist

## Methods

### get()

> **get**\<`T`\>(`key`): `Promise`\<`T`\>

#### Type Parameters

• **T** = `unknown`

#### Parameters

• **key**: `string`

#### Returns

`Promise`\<`T`\>

#### Implementation of

[`ICacheManager`](../interfaces/ICacheManager.md).[`get`](../interfaces/ICacheManager.md#get)

#### Defined in

<<<<<<< HEAD
[packages/core/src/cache.ts:97](https://github.com/ai16z/eliza/blob/main/packages/core/src/cache.ts#L97)
=======
[packages/core/src/cache.ts:97](https://github.com/konstantine25b/eliza/blob/main/packages/core/src/cache.ts#L97)
>>>>>>> founderlist

***

### set()

> **set**\<`T`\>(`key`, `value`, `opts`?): `Promise`\<`void`\>

#### Type Parameters

• **T**

#### Parameters

• **key**: `string`

• **value**: `T`

• **opts?**: [`CacheOptions`](../type-aliases/CacheOptions.md)

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`ICacheManager`](../interfaces/ICacheManager.md).[`set`](../interfaces/ICacheManager.md#set)

#### Defined in

<<<<<<< HEAD
[packages/core/src/cache.ts:116](https://github.com/ai16z/eliza/blob/main/packages/core/src/cache.ts#L116)
=======
[packages/core/src/cache.ts:116](https://github.com/konstantine25b/eliza/blob/main/packages/core/src/cache.ts#L116)
>>>>>>> founderlist

***

### delete()

> **delete**(`key`): `Promise`\<`void`\>

#### Parameters

• **key**: `string`

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`ICacheManager`](../interfaces/ICacheManager.md).[`delete`](../interfaces/ICacheManager.md#delete)

#### Defined in

<<<<<<< HEAD
[packages/core/src/cache.ts:123](https://github.com/ai16z/eliza/blob/main/packages/core/src/cache.ts#L123)
=======
[packages/core/src/cache.ts:123](https://github.com/konstantine25b/eliza/blob/main/packages/core/src/cache.ts#L123)
>>>>>>> founderlist
