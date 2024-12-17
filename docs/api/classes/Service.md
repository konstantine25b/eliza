[@ai16z/eliza v0.1.5-alpha.5](../index.md) / Service

# Class: `abstract` Service

## Extended by

- [`IImageDescriptionService`](../interfaces/IImageDescriptionService.md)
- [`ITranscriptionService`](../interfaces/ITranscriptionService.md)
- [`IVideoService`](../interfaces/IVideoService.md)
- [`ITextGenerationService`](../interfaces/ITextGenerationService.md)
- [`IBrowserService`](../interfaces/IBrowserService.md)
- [`ISpeechService`](../interfaces/ISpeechService.md)
- [`IPdfService`](../interfaces/IPdfService.md)
- [`IAwsS3Service`](../interfaces/IAwsS3Service.md)
- [`ISlackService`](../interfaces/ISlackService.md)

## Constructors

### new Service()

> **new Service**(): [`Service`](Service.md)

#### Returns

[`Service`](Service.md)

## Accessors

### serviceType

#### Get Signature

> **get** `static` **serviceType**(): [`ServiceType`](../enumerations/ServiceType.md)

##### Returns

[`ServiceType`](../enumerations/ServiceType.md)

#### Defined in

<<<<<<< HEAD
[packages/core/src/types.ts:998](https://github.com/ai16z/eliza/blob/main/packages/core/src/types.ts#L998)
=======
[packages/core/src/types.ts:957](https://github.com/konstantine25b/eliza/blob/main/packages/core/src/types.ts#L957)
>>>>>>> founderlist

***

### serviceType

#### Get Signature

> **get** **serviceType**(): [`ServiceType`](../enumerations/ServiceType.md)

##### Returns

[`ServiceType`](../enumerations/ServiceType.md)

#### Defined in

<<<<<<< HEAD
[packages/core/src/types.ts:1009](https://github.com/ai16z/eliza/blob/main/packages/core/src/types.ts#L1009)
=======
[packages/core/src/types.ts:968](https://github.com/konstantine25b/eliza/blob/main/packages/core/src/types.ts#L968)
>>>>>>> founderlist

## Methods

### getInstance()

> `static` **getInstance**\<`T`\>(): `T`

#### Type Parameters

• **T** *extends* [`Service`](Service.md)

#### Returns

`T`

#### Defined in

<<<<<<< HEAD
[packages/core/src/types.ts:1002](https://github.com/ai16z/eliza/blob/main/packages/core/src/types.ts#L1002)
=======
[packages/core/src/types.ts:961](https://github.com/konstantine25b/eliza/blob/main/packages/core/src/types.ts#L961)
>>>>>>> founderlist

***

### initialize()

> `abstract` **initialize**(`runtime`): `Promise`\<`void`\>

Add abstract initialize method that must be implemented by derived classes

#### Parameters

• **runtime**: [`IAgentRuntime`](../interfaces/IAgentRuntime.md)

#### Returns

`Promise`\<`void`\>

#### Defined in

<<<<<<< HEAD
[packages/core/src/types.ts:1014](https://github.com/ai16z/eliza/blob/main/packages/core/src/types.ts#L1014)
=======
[packages/core/src/types.ts:973](https://github.com/konstantine25b/eliza/blob/main/packages/core/src/types.ts#L973)
>>>>>>> founderlist
