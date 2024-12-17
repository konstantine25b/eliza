[@ai16z/eliza v0.1.5-alpha.5](../index.md) / IVideoService

# Interface: IVideoService

## Extends

- [`Service`](../classes/Service.md)

## Accessors

### serviceType

#### Get Signature

> **get** **serviceType**(): [`ServiceType`](../enumerations/ServiceType.md)

##### Returns

[`ServiceType`](../enumerations/ServiceType.md)

#### Inherited from

[`Service`](../classes/Service.md).[`serviceType`](../classes/Service.md#serviceType-1)

#### Defined in

<<<<<<< HEAD
[packages/core/src/types.ts:968](https://github.com/konstantine25b/eliza/blob/main/packages/core/src/types.ts#L968)
=======
[packages/core/src/types.ts:1009](https://github.com/ai16z/eliza/blob/main/packages/core/src/types.ts#L1009)
>>>>>>> main

## Methods

### initialize()

> `abstract` **initialize**(`runtime`): `Promise`\<`void`\>

Add abstract initialize method that must be implemented by derived classes

#### Parameters

• **runtime**: [`IAgentRuntime`](IAgentRuntime.md)

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`Service`](../classes/Service.md).[`initialize`](../classes/Service.md#initialize)

#### Defined in

<<<<<<< HEAD
[packages/core/src/types.ts:973](https://github.com/konstantine25b/eliza/blob/main/packages/core/src/types.ts#L973)
=======
[packages/core/src/types.ts:1014](https://github.com/ai16z/eliza/blob/main/packages/core/src/types.ts#L1014)
>>>>>>> main

***

### isVideoUrl()

> **isVideoUrl**(`url`): `boolean`

#### Parameters

• **url**: `string`

#### Returns

`boolean`

#### Defined in

<<<<<<< HEAD
[packages/core/src/types.ts:1075](https://github.com/konstantine25b/eliza/blob/main/packages/core/src/types.ts#L1075)
=======
[packages/core/src/types.ts:1122](https://github.com/ai16z/eliza/blob/main/packages/core/src/types.ts#L1122)
>>>>>>> main

***

### fetchVideoInfo()

> **fetchVideoInfo**(`url`): `Promise`\<[`Media`](../type-aliases/Media.md)\>

#### Parameters

• **url**: `string`

#### Returns

`Promise`\<[`Media`](../type-aliases/Media.md)\>

#### Defined in

<<<<<<< HEAD
[packages/core/src/types.ts:1076](https://github.com/konstantine25b/eliza/blob/main/packages/core/src/types.ts#L1076)
=======
[packages/core/src/types.ts:1123](https://github.com/ai16z/eliza/blob/main/packages/core/src/types.ts#L1123)
>>>>>>> main

***

### downloadVideo()

> **downloadVideo**(`videoInfo`): `Promise`\<`string`\>

#### Parameters

• **videoInfo**: [`Media`](../type-aliases/Media.md)

#### Returns

`Promise`\<`string`\>

#### Defined in

<<<<<<< HEAD
[packages/core/src/types.ts:1077](https://github.com/konstantine25b/eliza/blob/main/packages/core/src/types.ts#L1077)
=======
[packages/core/src/types.ts:1124](https://github.com/ai16z/eliza/blob/main/packages/core/src/types.ts#L1124)
>>>>>>> main

***

### processVideo()

> **processVideo**(`url`, `runtime`): `Promise`\<[`Media`](../type-aliases/Media.md)\>

#### Parameters

• **url**: `string`

• **runtime**: [`IAgentRuntime`](IAgentRuntime.md)

#### Returns

`Promise`\<[`Media`](../type-aliases/Media.md)\>

#### Defined in

<<<<<<< HEAD
[packages/core/src/types.ts:1078](https://github.com/konstantine25b/eliza/blob/main/packages/core/src/types.ts#L1078)
=======
[packages/core/src/types.ts:1125](https://github.com/ai16z/eliza/blob/main/packages/core/src/types.ts#L1125)
>>>>>>> main
