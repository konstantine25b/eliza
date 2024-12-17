[@ai16z/eliza v0.1.5-alpha.5](../index.md) / IMemoryManager

# Interface: IMemoryManager

## Properties

### runtime

> **runtime**: [`IAgentRuntime`](IAgentRuntime.md)

#### Defined in

<<<<<<< HEAD
[packages/core/src/types.ts:946](https://github.com/ai16z/eliza/blob/main/packages/core/src/types.ts#L946)
=======
[packages/core/src/types.ts:905](https://github.com/konstantine25b/eliza/blob/main/packages/core/src/types.ts#L905)
>>>>>>> founderlist

***

### tableName

> **tableName**: `string`

#### Defined in

<<<<<<< HEAD
[packages/core/src/types.ts:947](https://github.com/ai16z/eliza/blob/main/packages/core/src/types.ts#L947)
=======
[packages/core/src/types.ts:906](https://github.com/konstantine25b/eliza/blob/main/packages/core/src/types.ts#L906)
>>>>>>> founderlist

***

### constructor

> **constructor**: `Function`

#### Defined in

<<<<<<< HEAD
[packages/core/src/types.ts:948](https://github.com/ai16z/eliza/blob/main/packages/core/src/types.ts#L948)
=======
[packages/core/src/types.ts:907](https://github.com/konstantine25b/eliza/blob/main/packages/core/src/types.ts#L907)
>>>>>>> founderlist

## Methods

### addEmbeddingToMemory()

> **addEmbeddingToMemory**(`memory`): `Promise`\<[`Memory`](Memory.md)\>

#### Parameters

• **memory**: [`Memory`](Memory.md)

#### Returns

`Promise`\<[`Memory`](Memory.md)\>

#### Defined in

<<<<<<< HEAD
[packages/core/src/types.ts:950](https://github.com/ai16z/eliza/blob/main/packages/core/src/types.ts#L950)
=======
[packages/core/src/types.ts:909](https://github.com/konstantine25b/eliza/blob/main/packages/core/src/types.ts#L909)
>>>>>>> founderlist

***

### getMemories()

> **getMemories**(`opts`): `Promise`\<[`Memory`](Memory.md)[]\>

#### Parameters

• **opts**

• **opts.roomId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

• **opts.count?**: `number`

• **opts.unique?**: `boolean`

• **opts.start?**: `number`

• **opts.end?**: `number`

#### Returns

`Promise`\<[`Memory`](Memory.md)[]\>

#### Defined in

<<<<<<< HEAD
[packages/core/src/types.ts:952](https://github.com/ai16z/eliza/blob/main/packages/core/src/types.ts#L952)
=======
[packages/core/src/types.ts:911](https://github.com/konstantine25b/eliza/blob/main/packages/core/src/types.ts#L911)
>>>>>>> founderlist

***

### getCachedEmbeddings()

> **getCachedEmbeddings**(`content`): `Promise`\<`object`[]\>

#### Parameters

• **content**: `string`

#### Returns

`Promise`\<`object`[]\>

#### Defined in

<<<<<<< HEAD
[packages/core/src/types.ts:960](https://github.com/ai16z/eliza/blob/main/packages/core/src/types.ts#L960)
=======
[packages/core/src/types.ts:919](https://github.com/konstantine25b/eliza/blob/main/packages/core/src/types.ts#L919)
>>>>>>> founderlist

***

### getMemoryById()

> **getMemoryById**(`id`): `Promise`\<[`Memory`](Memory.md)\>

#### Parameters

• **id**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

#### Returns

`Promise`\<[`Memory`](Memory.md)\>

#### Defined in

<<<<<<< HEAD
[packages/core/src/types.ts:964](https://github.com/ai16z/eliza/blob/main/packages/core/src/types.ts#L964)
=======
[packages/core/src/types.ts:923](https://github.com/konstantine25b/eliza/blob/main/packages/core/src/types.ts#L923)
>>>>>>> founderlist

***

### getMemoriesByRoomIds()

> **getMemoriesByRoomIds**(`params`): `Promise`\<[`Memory`](Memory.md)[]\>

#### Parameters

• **params**

• **params.roomIds**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`[]

#### Returns

`Promise`\<[`Memory`](Memory.md)[]\>

#### Defined in

<<<<<<< HEAD
[packages/core/src/types.ts:965](https://github.com/ai16z/eliza/blob/main/packages/core/src/types.ts#L965)
=======
[packages/core/src/types.ts:924](https://github.com/konstantine25b/eliza/blob/main/packages/core/src/types.ts#L924)
>>>>>>> founderlist

***

### searchMemoriesByEmbedding()

> **searchMemoriesByEmbedding**(`embedding`, `opts`): `Promise`\<[`Memory`](Memory.md)[]\>

#### Parameters

• **embedding**: `number`[]

• **opts**

• **opts.match\_threshold?**: `number`

• **opts.count?**: `number`

• **opts.roomId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

• **opts.unique?**: `boolean`

#### Returns

`Promise`\<[`Memory`](Memory.md)[]\>

#### Defined in

<<<<<<< HEAD
[packages/core/src/types.ts:966](https://github.com/ai16z/eliza/blob/main/packages/core/src/types.ts#L966)
=======
[packages/core/src/types.ts:925](https://github.com/konstantine25b/eliza/blob/main/packages/core/src/types.ts#L925)
>>>>>>> founderlist

***

### createMemory()

> **createMemory**(`memory`, `unique`?): `Promise`\<`void`\>

#### Parameters

• **memory**: [`Memory`](Memory.md)

• **unique?**: `boolean`

#### Returns

`Promise`\<`void`\>

#### Defined in

<<<<<<< HEAD
[packages/core/src/types.ts:976](https://github.com/ai16z/eliza/blob/main/packages/core/src/types.ts#L976)
=======
[packages/core/src/types.ts:935](https://github.com/konstantine25b/eliza/blob/main/packages/core/src/types.ts#L935)
>>>>>>> founderlist

***

### removeMemory()

> **removeMemory**(`memoryId`): `Promise`\<`void`\>

#### Parameters

• **memoryId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

#### Returns

`Promise`\<`void`\>

#### Defined in

<<<<<<< HEAD
[packages/core/src/types.ts:978](https://github.com/ai16z/eliza/blob/main/packages/core/src/types.ts#L978)
=======
[packages/core/src/types.ts:937](https://github.com/konstantine25b/eliza/blob/main/packages/core/src/types.ts#L937)
>>>>>>> founderlist

***

### removeAllMemories()

> **removeAllMemories**(`roomId`): `Promise`\<`void`\>

#### Parameters

• **roomId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

#### Returns

`Promise`\<`void`\>

#### Defined in

<<<<<<< HEAD
[packages/core/src/types.ts:980](https://github.com/ai16z/eliza/blob/main/packages/core/src/types.ts#L980)
=======
[packages/core/src/types.ts:939](https://github.com/konstantine25b/eliza/blob/main/packages/core/src/types.ts#L939)
>>>>>>> founderlist

***

### countMemories()

> **countMemories**(`roomId`, `unique`?): `Promise`\<`number`\>

#### Parameters

• **roomId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

• **unique?**: `boolean`

#### Returns

`Promise`\<`number`\>

#### Defined in

<<<<<<< HEAD
[packages/core/src/types.ts:982](https://github.com/ai16z/eliza/blob/main/packages/core/src/types.ts#L982)
=======
[packages/core/src/types.ts:941](https://github.com/konstantine25b/eliza/blob/main/packages/core/src/types.ts#L941)
>>>>>>> founderlist
