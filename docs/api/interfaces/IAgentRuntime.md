[@ai16z/eliza v0.1.5-alpha.5](../index.md) / IAgentRuntime

# Interface: IAgentRuntime

## Properties

### agentId

> **agentId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

Properties

#### Defined in

<<<<<<< HEAD
[packages/core/src/types.ts:1019](https://github.com/ai16z/eliza/blob/main/packages/core/src/types.ts#L1019)
=======
[packages/core/src/types.ts:978](https://github.com/konstantine25b/eliza/blob/main/packages/core/src/types.ts#L978)
>>>>>>> founderlist

***

### serverUrl

> **serverUrl**: `string`

#### Defined in

<<<<<<< HEAD
[packages/core/src/types.ts:1020](https://github.com/ai16z/eliza/blob/main/packages/core/src/types.ts#L1020)
=======
[packages/core/src/types.ts:979](https://github.com/konstantine25b/eliza/blob/main/packages/core/src/types.ts#L979)
>>>>>>> founderlist

***

### databaseAdapter

> **databaseAdapter**: [`IDatabaseAdapter`](IDatabaseAdapter.md)

#### Defined in

<<<<<<< HEAD
[packages/core/src/types.ts:1021](https://github.com/ai16z/eliza/blob/main/packages/core/src/types.ts#L1021)
=======
[packages/core/src/types.ts:980](https://github.com/konstantine25b/eliza/blob/main/packages/core/src/types.ts#L980)
>>>>>>> founderlist

***

### token

> **token**: `string`

#### Defined in

<<<<<<< HEAD
[packages/core/src/types.ts:1022](https://github.com/ai16z/eliza/blob/main/packages/core/src/types.ts#L1022)
=======
[packages/core/src/types.ts:981](https://github.com/konstantine25b/eliza/blob/main/packages/core/src/types.ts#L981)
>>>>>>> founderlist

***

### modelProvider

> **modelProvider**: [`ModelProviderName`](../enumerations/ModelProviderName.md)

#### Defined in

<<<<<<< HEAD
[packages/core/src/types.ts:1023](https://github.com/ai16z/eliza/blob/main/packages/core/src/types.ts#L1023)
=======
[packages/core/src/types.ts:982](https://github.com/konstantine25b/eliza/blob/main/packages/core/src/types.ts#L982)
>>>>>>> founderlist

***

### imageModelProvider

> **imageModelProvider**: [`ModelProviderName`](../enumerations/ModelProviderName.md)

#### Defined in

<<<<<<< HEAD
[packages/core/src/types.ts:1024](https://github.com/ai16z/eliza/blob/main/packages/core/src/types.ts#L1024)
=======
[packages/core/src/types.ts:983](https://github.com/konstantine25b/eliza/blob/main/packages/core/src/types.ts#L983)
>>>>>>> founderlist

***

### character

> **character**: [`Character`](../type-aliases/Character.md)

#### Defined in

<<<<<<< HEAD
[packages/core/src/types.ts:1025](https://github.com/ai16z/eliza/blob/main/packages/core/src/types.ts#L1025)
=======
[packages/core/src/types.ts:984](https://github.com/konstantine25b/eliza/blob/main/packages/core/src/types.ts#L984)
>>>>>>> founderlist

***

### providers

> **providers**: [`Provider`](Provider.md)[]

#### Defined in

<<<<<<< HEAD
[packages/core/src/types.ts:1026](https://github.com/ai16z/eliza/blob/main/packages/core/src/types.ts#L1026)
=======
[packages/core/src/types.ts:985](https://github.com/konstantine25b/eliza/blob/main/packages/core/src/types.ts#L985)
>>>>>>> founderlist

***

### actions

> **actions**: [`Action`](Action.md)[]

#### Defined in

<<<<<<< HEAD
[packages/core/src/types.ts:1027](https://github.com/ai16z/eliza/blob/main/packages/core/src/types.ts#L1027)
=======
[packages/core/src/types.ts:986](https://github.com/konstantine25b/eliza/blob/main/packages/core/src/types.ts#L986)
>>>>>>> founderlist

***

### evaluators

> **evaluators**: [`Evaluator`](Evaluator.md)[]

#### Defined in

<<<<<<< HEAD
[packages/core/src/types.ts:1028](https://github.com/ai16z/eliza/blob/main/packages/core/src/types.ts#L1028)
=======
[packages/core/src/types.ts:987](https://github.com/konstantine25b/eliza/blob/main/packages/core/src/types.ts#L987)
>>>>>>> founderlist

***

### plugins

> **plugins**: [`Plugin`](../type-aliases/Plugin.md)[]

#### Defined in

<<<<<<< HEAD
[packages/core/src/types.ts:1029](https://github.com/ai16z/eliza/blob/main/packages/core/src/types.ts#L1029)

***

### fetch()?

> `optional` **fetch**: (`input`, `init`?) => `Promise`\<`Response`\>

[MDN Reference](https://developer.mozilla.org/docs/Web/API/fetch)

#### Parameters

• **input**: `RequestInfo` \| `URL`

• **init?**: `RequestInit`

#### Returns

`Promise`\<`Response`\>

#### Defined in

[packages/core/src/types.ts:1031](https://github.com/ai16z/eliza/blob/main/packages/core/src/types.ts#L1031)
=======
[packages/core/src/types.ts:988](https://github.com/konstantine25b/eliza/blob/main/packages/core/src/types.ts#L988)
>>>>>>> founderlist

***

### messageManager

> **messageManager**: [`IMemoryManager`](IMemoryManager.md)

#### Defined in

<<<<<<< HEAD
[packages/core/src/types.ts:1033](https://github.com/ai16z/eliza/blob/main/packages/core/src/types.ts#L1033)
=======
[packages/core/src/types.ts:990](https://github.com/konstantine25b/eliza/blob/main/packages/core/src/types.ts#L990)
>>>>>>> founderlist

***

### descriptionManager

> **descriptionManager**: [`IMemoryManager`](IMemoryManager.md)

#### Defined in

<<<<<<< HEAD
[packages/core/src/types.ts:1034](https://github.com/ai16z/eliza/blob/main/packages/core/src/types.ts#L1034)
=======
[packages/core/src/types.ts:991](https://github.com/konstantine25b/eliza/blob/main/packages/core/src/types.ts#L991)
>>>>>>> founderlist

***

### documentsManager

> **documentsManager**: [`IMemoryManager`](IMemoryManager.md)

#### Defined in

<<<<<<< HEAD
[packages/core/src/types.ts:1035](https://github.com/ai16z/eliza/blob/main/packages/core/src/types.ts#L1035)
=======
[packages/core/src/types.ts:992](https://github.com/konstantine25b/eliza/blob/main/packages/core/src/types.ts#L992)
>>>>>>> founderlist

***

### knowledgeManager

> **knowledgeManager**: [`IMemoryManager`](IMemoryManager.md)

#### Defined in

<<<<<<< HEAD
[packages/core/src/types.ts:1036](https://github.com/ai16z/eliza/blob/main/packages/core/src/types.ts#L1036)
=======
[packages/core/src/types.ts:993](https://github.com/konstantine25b/eliza/blob/main/packages/core/src/types.ts#L993)
>>>>>>> founderlist

***

### loreManager

> **loreManager**: [`IMemoryManager`](IMemoryManager.md)

#### Defined in

<<<<<<< HEAD
[packages/core/src/types.ts:1037](https://github.com/ai16z/eliza/blob/main/packages/core/src/types.ts#L1037)
=======
[packages/core/src/types.ts:994](https://github.com/konstantine25b/eliza/blob/main/packages/core/src/types.ts#L994)
>>>>>>> founderlist

***

### cacheManager

> **cacheManager**: [`ICacheManager`](ICacheManager.md)

#### Defined in

<<<<<<< HEAD
[packages/core/src/types.ts:1039](https://github.com/ai16z/eliza/blob/main/packages/core/src/types.ts#L1039)
=======
[packages/core/src/types.ts:996](https://github.com/konstantine25b/eliza/blob/main/packages/core/src/types.ts#L996)
>>>>>>> founderlist

***

### services

> **services**: `Map`\<[`ServiceType`](../enumerations/ServiceType.md), [`Service`](../classes/Service.md)\>

#### Defined in

<<<<<<< HEAD
[packages/core/src/types.ts:1041](https://github.com/ai16z/eliza/blob/main/packages/core/src/types.ts#L1041)

***

### clients

> **clients**: `Record`\<`string`, `any`\>

any could be EventEmitter
but I think the real solution is forthcoming as a base client interface

#### Defined in

[packages/core/src/types.ts:1044](https://github.com/ai16z/eliza/blob/main/packages/core/src/types.ts#L1044)
=======
[packages/core/src/types.ts:998](https://github.com/konstantine25b/eliza/blob/main/packages/core/src/types.ts#L998)
>>>>>>> founderlist

## Methods

### initialize()

> **initialize**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Defined in

<<<<<<< HEAD
[packages/core/src/types.ts:1046](https://github.com/ai16z/eliza/blob/main/packages/core/src/types.ts#L1046)
=======
[packages/core/src/types.ts:1000](https://github.com/konstantine25b/eliza/blob/main/packages/core/src/types.ts#L1000)
>>>>>>> founderlist

***

### registerMemoryManager()

> **registerMemoryManager**(`manager`): `void`

#### Parameters

• **manager**: [`IMemoryManager`](IMemoryManager.md)

#### Returns

`void`

#### Defined in

<<<<<<< HEAD
[packages/core/src/types.ts:1048](https://github.com/ai16z/eliza/blob/main/packages/core/src/types.ts#L1048)
=======
[packages/core/src/types.ts:1002](https://github.com/konstantine25b/eliza/blob/main/packages/core/src/types.ts#L1002)
>>>>>>> founderlist

***

### getMemoryManager()

> **getMemoryManager**(`name`): [`IMemoryManager`](IMemoryManager.md)

#### Parameters

• **name**: `string`

#### Returns

[`IMemoryManager`](IMemoryManager.md)

#### Defined in

<<<<<<< HEAD
[packages/core/src/types.ts:1050](https://github.com/ai16z/eliza/blob/main/packages/core/src/types.ts#L1050)
=======
[packages/core/src/types.ts:1004](https://github.com/konstantine25b/eliza/blob/main/packages/core/src/types.ts#L1004)
>>>>>>> founderlist

***

### getService()

> **getService**\<`T`\>(`service`): `T`

#### Type Parameters

• **T** *extends* [`Service`](../classes/Service.md)

#### Parameters

• **service**: [`ServiceType`](../enumerations/ServiceType.md)

#### Returns

`T`

#### Defined in

<<<<<<< HEAD
[packages/core/src/types.ts:1052](https://github.com/ai16z/eliza/blob/main/packages/core/src/types.ts#L1052)
=======
[packages/core/src/types.ts:1006](https://github.com/konstantine25b/eliza/blob/main/packages/core/src/types.ts#L1006)
>>>>>>> founderlist

***

### registerService()

> **registerService**(`service`): `void`

#### Parameters

• **service**: [`Service`](../classes/Service.md)

#### Returns

`void`

#### Defined in

<<<<<<< HEAD
[packages/core/src/types.ts:1054](https://github.com/ai16z/eliza/blob/main/packages/core/src/types.ts#L1054)
=======
[packages/core/src/types.ts:1008](https://github.com/konstantine25b/eliza/blob/main/packages/core/src/types.ts#L1008)
>>>>>>> founderlist

***

### getSetting()

> **getSetting**(`key`): `string`

#### Parameters

• **key**: `string`

#### Returns

`string`

#### Defined in

<<<<<<< HEAD
[packages/core/src/types.ts:1056](https://github.com/ai16z/eliza/blob/main/packages/core/src/types.ts#L1056)
=======
[packages/core/src/types.ts:1010](https://github.com/konstantine25b/eliza/blob/main/packages/core/src/types.ts#L1010)
>>>>>>> founderlist

***

### getConversationLength()

> **getConversationLength**(): `number`

Methods

#### Returns

`number`

#### Defined in

<<<<<<< HEAD
[packages/core/src/types.ts:1059](https://github.com/ai16z/eliza/blob/main/packages/core/src/types.ts#L1059)
=======
[packages/core/src/types.ts:1013](https://github.com/konstantine25b/eliza/blob/main/packages/core/src/types.ts#L1013)
>>>>>>> founderlist

***

### processActions()

> **processActions**(`message`, `responses`, `state`?, `callback`?): `Promise`\<`void`\>

#### Parameters

• **message**: [`Memory`](Memory.md)

• **responses**: [`Memory`](Memory.md)[]

• **state?**: [`State`](State.md)

• **callback?**: [`HandlerCallback`](../type-aliases/HandlerCallback.md)

#### Returns

`Promise`\<`void`\>

#### Defined in

<<<<<<< HEAD
[packages/core/src/types.ts:1061](https://github.com/ai16z/eliza/blob/main/packages/core/src/types.ts#L1061)
=======
[packages/core/src/types.ts:1015](https://github.com/konstantine25b/eliza/blob/main/packages/core/src/types.ts#L1015)
>>>>>>> founderlist

***

### evaluate()

> **evaluate**(`message`, `state`?, `didRespond`?, `callback`?): `Promise`\<`string`[]\>

#### Parameters

• **message**: [`Memory`](Memory.md)

• **state?**: [`State`](State.md)

• **didRespond?**: `boolean`

• **callback?**: [`HandlerCallback`](../type-aliases/HandlerCallback.md)

#### Returns

`Promise`\<`string`[]\>

#### Defined in

<<<<<<< HEAD
[packages/core/src/types.ts:1068](https://github.com/ai16z/eliza/blob/main/packages/core/src/types.ts#L1068)
=======
[packages/core/src/types.ts:1022](https://github.com/konstantine25b/eliza/blob/main/packages/core/src/types.ts#L1022)
>>>>>>> founderlist

***

### ensureParticipantExists()

> **ensureParticipantExists**(`userId`, `roomId`): `Promise`\<`void`\>

#### Parameters

• **userId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

• **roomId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

#### Returns

`Promise`\<`void`\>

#### Defined in

<<<<<<< HEAD
[packages/core/src/types.ts:1075](https://github.com/ai16z/eliza/blob/main/packages/core/src/types.ts#L1075)
=======
[packages/core/src/types.ts:1028](https://github.com/konstantine25b/eliza/blob/main/packages/core/src/types.ts#L1028)
>>>>>>> founderlist

***

### ensureUserExists()

> **ensureUserExists**(`userId`, `userName`, `name`, `source`): `Promise`\<`void`\>

#### Parameters

• **userId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

• **userName**: `string`

• **name**: `string`

• **source**: `string`

#### Returns

`Promise`\<`void`\>

#### Defined in

<<<<<<< HEAD
[packages/core/src/types.ts:1077](https://github.com/ai16z/eliza/blob/main/packages/core/src/types.ts#L1077)
=======
[packages/core/src/types.ts:1030](https://github.com/konstantine25b/eliza/blob/main/packages/core/src/types.ts#L1030)
>>>>>>> founderlist

***

### registerAction()

> **registerAction**(`action`): `void`

#### Parameters

• **action**: [`Action`](Action.md)

#### Returns

`void`

#### Defined in

<<<<<<< HEAD
[packages/core/src/types.ts:1084](https://github.com/ai16z/eliza/blob/main/packages/core/src/types.ts#L1084)
=======
[packages/core/src/types.ts:1037](https://github.com/konstantine25b/eliza/blob/main/packages/core/src/types.ts#L1037)
>>>>>>> founderlist

***

### ensureConnection()

> **ensureConnection**(`userId`, `roomId`, `userName`?, `userScreenName`?, `source`?): `Promise`\<`void`\>

#### Parameters

• **userId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

• **roomId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

• **userName?**: `string`

• **userScreenName?**: `string`

• **source?**: `string`

#### Returns

`Promise`\<`void`\>

#### Defined in

<<<<<<< HEAD
[packages/core/src/types.ts:1086](https://github.com/ai16z/eliza/blob/main/packages/core/src/types.ts#L1086)
=======
[packages/core/src/types.ts:1039](https://github.com/konstantine25b/eliza/blob/main/packages/core/src/types.ts#L1039)
>>>>>>> founderlist

***

### ensureParticipantInRoom()

> **ensureParticipantInRoom**(`userId`, `roomId`): `Promise`\<`void`\>

#### Parameters

• **userId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

• **roomId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

#### Returns

`Promise`\<`void`\>

#### Defined in

<<<<<<< HEAD
[packages/core/src/types.ts:1094](https://github.com/ai16z/eliza/blob/main/packages/core/src/types.ts#L1094)
=======
[packages/core/src/types.ts:1047](https://github.com/konstantine25b/eliza/blob/main/packages/core/src/types.ts#L1047)
>>>>>>> founderlist

***

### ensureRoomExists()

> **ensureRoomExists**(`roomId`): `Promise`\<`void`\>

#### Parameters

• **roomId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

#### Returns

`Promise`\<`void`\>

#### Defined in

<<<<<<< HEAD
[packages/core/src/types.ts:1096](https://github.com/ai16z/eliza/blob/main/packages/core/src/types.ts#L1096)
=======
[packages/core/src/types.ts:1049](https://github.com/konstantine25b/eliza/blob/main/packages/core/src/types.ts#L1049)
>>>>>>> founderlist

***

### composeState()

> **composeState**(`message`, `additionalKeys`?): `Promise`\<[`State`](State.md)\>

#### Parameters

• **message**: [`Memory`](Memory.md)

• **additionalKeys?**

#### Returns

`Promise`\<[`State`](State.md)\>

#### Defined in

<<<<<<< HEAD
[packages/core/src/types.ts:1098](https://github.com/ai16z/eliza/blob/main/packages/core/src/types.ts#L1098)
=======
[packages/core/src/types.ts:1051](https://github.com/konstantine25b/eliza/blob/main/packages/core/src/types.ts#L1051)
>>>>>>> founderlist

***

### updateRecentMessageState()

> **updateRecentMessageState**(`state`): `Promise`\<[`State`](State.md)\>

#### Parameters

• **state**: [`State`](State.md)

#### Returns

`Promise`\<[`State`](State.md)\>

#### Defined in

<<<<<<< HEAD
[packages/core/src/types.ts:1103](https://github.com/ai16z/eliza/blob/main/packages/core/src/types.ts#L1103)
=======
[packages/core/src/types.ts:1056](https://github.com/konstantine25b/eliza/blob/main/packages/core/src/types.ts#L1056)
>>>>>>> founderlist
