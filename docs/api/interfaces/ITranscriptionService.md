[@ai16z/eliza v0.1.5-alpha.5](../index.md) / ITranscriptionService

# Interface: ITranscriptionService

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
[packages/core/src/types.ts:1009](https://github.com/ai16z/eliza/blob/main/packages/core/src/types.ts#L1009)
=======
[packages/core/src/types.ts:968](https://github.com/konstantine25b/eliza/blob/main/packages/core/src/types.ts#L968)
>>>>>>> founderlist

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
[packages/core/src/types.ts:1014](https://github.com/ai16z/eliza/blob/main/packages/core/src/types.ts#L1014)
=======
[packages/core/src/types.ts:973](https://github.com/konstantine25b/eliza/blob/main/packages/core/src/types.ts#L973)
>>>>>>> founderlist

***

### transcribeAttachment()

> **transcribeAttachment**(`audioBuffer`): `Promise`\<`string`\>

#### Parameters

• **audioBuffer**: `ArrayBuffer`

#### Returns

`Promise`\<`string`\>

#### Defined in

<<<<<<< HEAD
[packages/core/src/types.ts:1113](https://github.com/ai16z/eliza/blob/main/packages/core/src/types.ts#L1113)
=======
[packages/core/src/types.ts:1066](https://github.com/konstantine25b/eliza/blob/main/packages/core/src/types.ts#L1066)
>>>>>>> founderlist

***

### transcribeAttachmentLocally()

> **transcribeAttachmentLocally**(`audioBuffer`): `Promise`\<`string`\>

#### Parameters

• **audioBuffer**: `ArrayBuffer`

#### Returns

`Promise`\<`string`\>

#### Defined in

<<<<<<< HEAD
[packages/core/src/types.ts:1114](https://github.com/ai16z/eliza/blob/main/packages/core/src/types.ts#L1114)
=======
[packages/core/src/types.ts:1067](https://github.com/konstantine25b/eliza/blob/main/packages/core/src/types.ts#L1067)
>>>>>>> founderlist

***

### transcribe()

> **transcribe**(`audioBuffer`): `Promise`\<`string`\>

#### Parameters

• **audioBuffer**: `ArrayBuffer`

#### Returns

`Promise`\<`string`\>

#### Defined in

<<<<<<< HEAD
[packages/core/src/types.ts:1117](https://github.com/ai16z/eliza/blob/main/packages/core/src/types.ts#L1117)
=======
[packages/core/src/types.ts:1070](https://github.com/konstantine25b/eliza/blob/main/packages/core/src/types.ts#L1070)
>>>>>>> founderlist

***

### transcribeLocally()

> **transcribeLocally**(`audioBuffer`): `Promise`\<`string`\>

#### Parameters

• **audioBuffer**: `ArrayBuffer`

#### Returns

`Promise`\<`string`\>

#### Defined in

<<<<<<< HEAD
[packages/core/src/types.ts:1118](https://github.com/ai16z/eliza/blob/main/packages/core/src/types.ts#L1118)
=======
[packages/core/src/types.ts:1071](https://github.com/konstantine25b/eliza/blob/main/packages/core/src/types.ts#L1071)
>>>>>>> founderlist
