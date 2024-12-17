[@ai16z/eliza v0.1.5-alpha.5](../index.md) / AgentRuntime

# Class: AgentRuntime

Represents the runtime environment for an agent, handling message processing,
action registration, and interaction with external services like OpenAI and Supabase.

## Implements

- [`IAgentRuntime`](../interfaces/IAgentRuntime.md)

## Constructors

### new AgentRuntime()

> **new AgentRuntime**(`opts`): [`AgentRuntime`](AgentRuntime.md)

Creates an instance of AgentRuntime.

#### Parameters

• **opts**

The options for configuring the AgentRuntime.

• **opts.conversationLength?**: `number`

The number of messages to hold in the recent message cache.

• **opts.agentId?**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

Optional ID of the agent.

• **opts.character?**: [`Character`](../type-aliases/Character.md)

• **opts.token**: `string`

The JWT token, can be a JWT token if outside worker, or an OpenAI token if inside worker.

• **opts.serverUrl?**: `string`

The URL of the worker.

• **opts.actions?**: [`Action`](../interfaces/Action.md)[]

Optional custom actions.

• **opts.evaluators?**: [`Evaluator`](../interfaces/Evaluator.md)[]

Optional custom evaluators.

• **opts.plugins?**: [`Plugin`](../type-aliases/Plugin.md)[]

• **opts.providers?**: [`Provider`](../interfaces/Provider.md)[]

Optional context providers.

• **opts.modelProvider**: [`ModelProviderName`](../enumerations/ModelProviderName.md)

• **opts.services?**: [`Service`](Service.md)[]

Optional custom services.

• **opts.managers?**: [`IMemoryManager`](../interfaces/IMemoryManager.md)[]

• **opts.databaseAdapter**: [`IDatabaseAdapter`](../interfaces/IDatabaseAdapter.md)

The database adapter used for interacting with the database.

• **opts.fetch?**: `unknown`

Custom fetch function to use for making requests.

• **opts.speechModelPath?**: `string`

• **opts.cacheManager**: [`ICacheManager`](../interfaces/ICacheManager.md)

• **opts.logging?**: `boolean`

#### Returns

[`AgentRuntime`](AgentRuntime.md)

#### Defined in

<<<<<<< HEAD
[packages/core/src/runtime.ts:208](https://github.com/konstantine25b/eliza/blob/main/packages/core/src/runtime.ts#L208)
=======
[packages/core/src/runtime.ts:209](https://github.com/ai16z/eliza/blob/main/packages/core/src/runtime.ts#L209)
>>>>>>> main

## Properties

### agentId

> **agentId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

The ID of the agent

#### Implementation of

[`IAgentRuntime`](../interfaces/IAgentRuntime.md).[`agentId`](../interfaces/IAgentRuntime.md#agentId)

#### Defined in

<<<<<<< HEAD
[packages/core/src/runtime.ts:63](https://github.com/konstantine25b/eliza/blob/main/packages/core/src/runtime.ts#L63)
=======
[packages/core/src/runtime.ts:63](https://github.com/ai16z/eliza/blob/main/packages/core/src/runtime.ts#L63)
>>>>>>> main

***

### serverUrl

> **serverUrl**: `string` = `"http://localhost:7998"`

The base URL of the server where the agent's requests are processed.

#### Implementation of

[`IAgentRuntime`](../interfaces/IAgentRuntime.md).[`serverUrl`](../interfaces/IAgentRuntime.md#serverUrl)

#### Defined in

<<<<<<< HEAD
[packages/core/src/runtime.ts:67](https://github.com/konstantine25b/eliza/blob/main/packages/core/src/runtime.ts#L67)
=======
[packages/core/src/runtime.ts:67](https://github.com/ai16z/eliza/blob/main/packages/core/src/runtime.ts#L67)
>>>>>>> main

***

### databaseAdapter

> **databaseAdapter**: [`IDatabaseAdapter`](../interfaces/IDatabaseAdapter.md)

The database adapter used for interacting with the database.

#### Implementation of

[`IAgentRuntime`](../interfaces/IAgentRuntime.md).[`databaseAdapter`](../interfaces/IAgentRuntime.md#databaseAdapter)

#### Defined in

<<<<<<< HEAD
[packages/core/src/runtime.ts:72](https://github.com/konstantine25b/eliza/blob/main/packages/core/src/runtime.ts#L72)
=======
[packages/core/src/runtime.ts:72](https://github.com/ai16z/eliza/blob/main/packages/core/src/runtime.ts#L72)
>>>>>>> main

***

### token

> **token**: `string`

Authentication token used for securing requests.

#### Implementation of

[`IAgentRuntime`](../interfaces/IAgentRuntime.md).[`token`](../interfaces/IAgentRuntime.md#token)

#### Defined in

<<<<<<< HEAD
[packages/core/src/runtime.ts:77](https://github.com/konstantine25b/eliza/blob/main/packages/core/src/runtime.ts#L77)
=======
[packages/core/src/runtime.ts:77](https://github.com/ai16z/eliza/blob/main/packages/core/src/runtime.ts#L77)
>>>>>>> main

***

### actions

> **actions**: [`Action`](../interfaces/Action.md)[] = `[]`

Custom actions that the agent can perform.

#### Implementation of

[`IAgentRuntime`](../interfaces/IAgentRuntime.md).[`actions`](../interfaces/IAgentRuntime.md#actions)

#### Defined in

<<<<<<< HEAD
[packages/core/src/runtime.ts:82](https://github.com/konstantine25b/eliza/blob/main/packages/core/src/runtime.ts#L82)
=======
[packages/core/src/runtime.ts:82](https://github.com/ai16z/eliza/blob/main/packages/core/src/runtime.ts#L82)
>>>>>>> main

***

### evaluators

> **evaluators**: [`Evaluator`](../interfaces/Evaluator.md)[] = `[]`

Evaluators used to assess and guide the agent's responses.

#### Implementation of

[`IAgentRuntime`](../interfaces/IAgentRuntime.md).[`evaluators`](../interfaces/IAgentRuntime.md#evaluators)

#### Defined in

<<<<<<< HEAD
[packages/core/src/runtime.ts:87](https://github.com/konstantine25b/eliza/blob/main/packages/core/src/runtime.ts#L87)
=======
[packages/core/src/runtime.ts:87](https://github.com/ai16z/eliza/blob/main/packages/core/src/runtime.ts#L87)
>>>>>>> main

***

### providers

> **providers**: [`Provider`](../interfaces/Provider.md)[] = `[]`

Context providers used to provide context for message generation.

#### Implementation of

[`IAgentRuntime`](../interfaces/IAgentRuntime.md).[`providers`](../interfaces/IAgentRuntime.md#providers)

#### Defined in

<<<<<<< HEAD
[packages/core/src/runtime.ts:92](https://github.com/konstantine25b/eliza/blob/main/packages/core/src/runtime.ts#L92)
=======
[packages/core/src/runtime.ts:92](https://github.com/ai16z/eliza/blob/main/packages/core/src/runtime.ts#L92)
>>>>>>> main

***

### plugins

> **plugins**: [`Plugin`](../type-aliases/Plugin.md)[] = `[]`

#### Implementation of

[`IAgentRuntime`](../interfaces/IAgentRuntime.md).[`plugins`](../interfaces/IAgentRuntime.md#plugins)

#### Defined in

<<<<<<< HEAD
[packages/core/src/runtime.ts:94](https://github.com/konstantine25b/eliza/blob/main/packages/core/src/runtime.ts#L94)
=======
[packages/core/src/runtime.ts:94](https://github.com/ai16z/eliza/blob/main/packages/core/src/runtime.ts#L94)
>>>>>>> main

***

### modelProvider

> **modelProvider**: [`ModelProviderName`](../enumerations/ModelProviderName.md)

The model to use for generateText.

#### Implementation of

[`IAgentRuntime`](../interfaces/IAgentRuntime.md).[`modelProvider`](../interfaces/IAgentRuntime.md#modelProvider)

#### Defined in

<<<<<<< HEAD
[packages/core/src/runtime.ts:99](https://github.com/konstantine25b/eliza/blob/main/packages/core/src/runtime.ts#L99)
=======
[packages/core/src/runtime.ts:99](https://github.com/ai16z/eliza/blob/main/packages/core/src/runtime.ts#L99)
>>>>>>> main

***

### imageModelProvider

> **imageModelProvider**: [`ModelProviderName`](../enumerations/ModelProviderName.md)

The model to use for generateImage.

#### Implementation of

[`IAgentRuntime`](../interfaces/IAgentRuntime.md).[`imageModelProvider`](../interfaces/IAgentRuntime.md#imageModelProvider)

#### Defined in

<<<<<<< HEAD
[packages/core/src/runtime.ts:104](https://github.com/konstantine25b/eliza/blob/main/packages/core/src/runtime.ts#L104)
=======
[packages/core/src/runtime.ts:104](https://github.com/ai16z/eliza/blob/main/packages/core/src/runtime.ts#L104)
>>>>>>> main

***

### fetch()

> **fetch**: (`input`, `init`?) => `Promise`\<`Response`\>

Fetch function to use
Some environments may not have access to the global fetch function and need a custom fetch override.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/fetch)

#### Parameters

• **input**: `RequestInfo` \| `URL`

• **init?**: `RequestInit`

#### Returns

`Promise`\<`Response`\>

#### Implementation of

[`IAgentRuntime`](../interfaces/IAgentRuntime.md).[`fetch`](../interfaces/IAgentRuntime.md#fetch)

#### Defined in

<<<<<<< HEAD
[packages/core/src/runtime.ts:110](https://github.com/konstantine25b/eliza/blob/main/packages/core/src/runtime.ts#L110)
=======
[packages/core/src/runtime.ts:110](https://github.com/ai16z/eliza/blob/main/packages/core/src/runtime.ts#L110)
>>>>>>> main

***

### character

> **character**: [`Character`](../type-aliases/Character.md)

The character to use for the agent

#### Implementation of

[`IAgentRuntime`](../interfaces/IAgentRuntime.md).[`character`](../interfaces/IAgentRuntime.md#character)

#### Defined in

<<<<<<< HEAD
[packages/core/src/runtime.ts:115](https://github.com/konstantine25b/eliza/blob/main/packages/core/src/runtime.ts#L115)
=======
[packages/core/src/runtime.ts:115](https://github.com/ai16z/eliza/blob/main/packages/core/src/runtime.ts#L115)
>>>>>>> main

***

### messageManager

> **messageManager**: [`IMemoryManager`](../interfaces/IMemoryManager.md)

Store messages that are sent and received by the agent.

#### Implementation of

[`IAgentRuntime`](../interfaces/IAgentRuntime.md).[`messageManager`](../interfaces/IAgentRuntime.md#messageManager)

#### Defined in

<<<<<<< HEAD
[packages/core/src/runtime.ts:120](https://github.com/konstantine25b/eliza/blob/main/packages/core/src/runtime.ts#L120)
=======
[packages/core/src/runtime.ts:120](https://github.com/ai16z/eliza/blob/main/packages/core/src/runtime.ts#L120)
>>>>>>> main

***

### descriptionManager

> **descriptionManager**: [`IMemoryManager`](../interfaces/IMemoryManager.md)

Store and recall descriptions of users based on conversations.

#### Implementation of

[`IAgentRuntime`](../interfaces/IAgentRuntime.md).[`descriptionManager`](../interfaces/IAgentRuntime.md#descriptionManager)

#### Defined in

<<<<<<< HEAD
[packages/core/src/runtime.ts:125](https://github.com/konstantine25b/eliza/blob/main/packages/core/src/runtime.ts#L125)
=======
[packages/core/src/runtime.ts:125](https://github.com/ai16z/eliza/blob/main/packages/core/src/runtime.ts#L125)
>>>>>>> main

***

### loreManager

> **loreManager**: [`IMemoryManager`](../interfaces/IMemoryManager.md)

Manage the creation and recall of static information (documents, historical game lore, etc)

#### Implementation of

[`IAgentRuntime`](../interfaces/IAgentRuntime.md).[`loreManager`](../interfaces/IAgentRuntime.md#loreManager)

#### Defined in

<<<<<<< HEAD
[packages/core/src/runtime.ts:130](https://github.com/konstantine25b/eliza/blob/main/packages/core/src/runtime.ts#L130)
=======
[packages/core/src/runtime.ts:130](https://github.com/ai16z/eliza/blob/main/packages/core/src/runtime.ts#L130)
>>>>>>> main

***

### documentsManager

> **documentsManager**: [`IMemoryManager`](../interfaces/IMemoryManager.md)

Hold large documents that can be referenced

#### Implementation of

[`IAgentRuntime`](../interfaces/IAgentRuntime.md).[`documentsManager`](../interfaces/IAgentRuntime.md#documentsManager)

#### Defined in

<<<<<<< HEAD
[packages/core/src/runtime.ts:135](https://github.com/konstantine25b/eliza/blob/main/packages/core/src/runtime.ts#L135)
=======
[packages/core/src/runtime.ts:135](https://github.com/ai16z/eliza/blob/main/packages/core/src/runtime.ts#L135)
>>>>>>> main

***

### knowledgeManager

> **knowledgeManager**: [`IMemoryManager`](../interfaces/IMemoryManager.md)

Searchable document fragments

#### Implementation of

[`IAgentRuntime`](../interfaces/IAgentRuntime.md).[`knowledgeManager`](../interfaces/IAgentRuntime.md#knowledgeManager)

#### Defined in

<<<<<<< HEAD
[packages/core/src/runtime.ts:140](https://github.com/konstantine25b/eliza/blob/main/packages/core/src/runtime.ts#L140)
=======
[packages/core/src/runtime.ts:140](https://github.com/ai16z/eliza/blob/main/packages/core/src/runtime.ts#L140)
>>>>>>> main

***

### services

> **services**: `Map`\<[`ServiceType`](../enumerations/ServiceType.md), [`Service`](Service.md)\>

#### Implementation of

[`IAgentRuntime`](../interfaces/IAgentRuntime.md).[`services`](../interfaces/IAgentRuntime.md#services)

#### Defined in

<<<<<<< HEAD
[packages/core/src/runtime.ts:142](https://github.com/konstantine25b/eliza/blob/main/packages/core/src/runtime.ts#L142)
=======
[packages/core/src/runtime.ts:142](https://github.com/ai16z/eliza/blob/main/packages/core/src/runtime.ts#L142)
>>>>>>> main

***

### memoryManagers

> **memoryManagers**: `Map`\<`string`, [`IMemoryManager`](../interfaces/IMemoryManager.md)\>

#### Defined in

<<<<<<< HEAD
[packages/core/src/runtime.ts:143](https://github.com/konstantine25b/eliza/blob/main/packages/core/src/runtime.ts#L143)
=======
[packages/core/src/runtime.ts:143](https://github.com/ai16z/eliza/blob/main/packages/core/src/runtime.ts#L143)
>>>>>>> main

***

### cacheManager

> **cacheManager**: [`ICacheManager`](../interfaces/ICacheManager.md)

#### Implementation of

[`IAgentRuntime`](../interfaces/IAgentRuntime.md).[`cacheManager`](../interfaces/IAgentRuntime.md#cacheManager)

#### Defined in

<<<<<<< HEAD
[packages/core/src/runtime.ts:144](https://github.com/konstantine25b/eliza/blob/main/packages/core/src/runtime.ts#L144)
=======
[packages/core/src/runtime.ts:144](https://github.com/ai16z/eliza/blob/main/packages/core/src/runtime.ts#L144)

***

### clients

> **clients**: `Record`\<`string`, `any`\>

any could be EventEmitter
but I think the real solution is forthcoming as a base client interface

#### Implementation of

[`IAgentRuntime`](../interfaces/IAgentRuntime.md).[`clients`](../interfaces/IAgentRuntime.md#clients)

#### Defined in

[packages/core/src/runtime.ts:145](https://github.com/ai16z/eliza/blob/main/packages/core/src/runtime.ts#L145)
>>>>>>> main

## Methods

### registerMemoryManager()

> **registerMemoryManager**(`manager`): `void`

#### Parameters

• **manager**: [`IMemoryManager`](../interfaces/IMemoryManager.md)

#### Returns

`void`

#### Implementation of

[`IAgentRuntime`](../interfaces/IAgentRuntime.md).[`registerMemoryManager`](../interfaces/IAgentRuntime.md#registerMemoryManager)

#### Defined in

<<<<<<< HEAD
[packages/core/src/runtime.ts:146](https://github.com/konstantine25b/eliza/blob/main/packages/core/src/runtime.ts#L146)
=======
[packages/core/src/runtime.ts:147](https://github.com/ai16z/eliza/blob/main/packages/core/src/runtime.ts#L147)
>>>>>>> main

***

### getMemoryManager()

> **getMemoryManager**(`tableName`): [`IMemoryManager`](../interfaces/IMemoryManager.md)

#### Parameters

• **tableName**: `string`

#### Returns

[`IMemoryManager`](../interfaces/IMemoryManager.md)

#### Implementation of

[`IAgentRuntime`](../interfaces/IAgentRuntime.md).[`getMemoryManager`](../interfaces/IAgentRuntime.md#getMemoryManager)

#### Defined in

<<<<<<< HEAD
[packages/core/src/runtime.ts:161](https://github.com/konstantine25b/eliza/blob/main/packages/core/src/runtime.ts#L161)
=======
[packages/core/src/runtime.ts:162](https://github.com/ai16z/eliza/blob/main/packages/core/src/runtime.ts#L162)
>>>>>>> main

***

### getService()

> **getService**\<`T`\>(`service`): `T`

#### Type Parameters

• **T** *extends* [`Service`](Service.md)

#### Parameters

• **service**: [`ServiceType`](../enumerations/ServiceType.md)

#### Returns

`T`

#### Implementation of

[`IAgentRuntime`](../interfaces/IAgentRuntime.md).[`getService`](../interfaces/IAgentRuntime.md#getService)

#### Defined in

<<<<<<< HEAD
[packages/core/src/runtime.ts:165](https://github.com/konstantine25b/eliza/blob/main/packages/core/src/runtime.ts#L165)
=======
[packages/core/src/runtime.ts:166](https://github.com/ai16z/eliza/blob/main/packages/core/src/runtime.ts#L166)
>>>>>>> main

***

### registerService()

> **registerService**(`service`): `Promise`\<`void`\>

#### Parameters

• **service**: [`Service`](Service.md)

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IAgentRuntime`](../interfaces/IAgentRuntime.md).[`registerService`](../interfaces/IAgentRuntime.md#registerService)

#### Defined in

<<<<<<< HEAD
[packages/core/src/runtime.ts:174](https://github.com/konstantine25b/eliza/blob/main/packages/core/src/runtime.ts#L174)
=======
[packages/core/src/runtime.ts:175](https://github.com/ai16z/eliza/blob/main/packages/core/src/runtime.ts#L175)
>>>>>>> main

***

### initialize()

> **initialize**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IAgentRuntime`](../interfaces/IAgentRuntime.md).[`initialize`](../interfaces/IAgentRuntime.md#initialize)

#### Defined in

<<<<<<< HEAD
[packages/core/src/runtime.ts:375](https://github.com/konstantine25b/eliza/blob/main/packages/core/src/runtime.ts#L375)
=======
[packages/core/src/runtime.ts:376](https://github.com/ai16z/eliza/blob/main/packages/core/src/runtime.ts#L376)

***

### stop()

> **stop**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Defined in

[packages/core/src/runtime.ts:409](https://github.com/ai16z/eliza/blob/main/packages/core/src/runtime.ts#L409)
>>>>>>> main

***

### getSetting()

> **getSetting**(`key`): `any`

#### Parameters

• **key**: `string`

#### Returns

`any`

#### Implementation of

[`IAgentRuntime`](../interfaces/IAgentRuntime.md).[`getSetting`](../interfaces/IAgentRuntime.md#getSetting)

#### Defined in

<<<<<<< HEAD
[packages/core/src/runtime.ts:439](https://github.com/konstantine25b/eliza/blob/main/packages/core/src/runtime.ts#L439)
=======
[packages/core/src/runtime.ts:459](https://github.com/ai16z/eliza/blob/main/packages/core/src/runtime.ts#L459)
>>>>>>> main

***

### getConversationLength()

> **getConversationLength**(): `number`

Get the number of messages that are kept in the conversation buffer.

#### Returns

`number`

The number of recent messages to be kept in memory.

#### Implementation of

[`IAgentRuntime`](../interfaces/IAgentRuntime.md).[`getConversationLength`](../interfaces/IAgentRuntime.md#getConversationLength)

#### Defined in

<<<<<<< HEAD
[packages/core/src/runtime.ts:461](https://github.com/konstantine25b/eliza/blob/main/packages/core/src/runtime.ts#L461)
=======
[packages/core/src/runtime.ts:481](https://github.com/ai16z/eliza/blob/main/packages/core/src/runtime.ts#L481)
>>>>>>> main

***

### registerAction()

> **registerAction**(`action`): `void`

Register an action for the agent to perform.

#### Parameters

• **action**: [`Action`](../interfaces/Action.md)

The action to register.

#### Returns

`void`

#### Implementation of

[`IAgentRuntime`](../interfaces/IAgentRuntime.md).[`registerAction`](../interfaces/IAgentRuntime.md#registerAction)

#### Defined in

<<<<<<< HEAD
[packages/core/src/runtime.ts:469](https://github.com/konstantine25b/eliza/blob/main/packages/core/src/runtime.ts#L469)
=======
[packages/core/src/runtime.ts:489](https://github.com/ai16z/eliza/blob/main/packages/core/src/runtime.ts#L489)
>>>>>>> main

***

### registerEvaluator()

> **registerEvaluator**(`evaluator`): `void`

Register an evaluator to assess and guide the agent's responses.

#### Parameters

• **evaluator**: [`Evaluator`](../interfaces/Evaluator.md)

The evaluator to register.

#### Returns

`void`

#### Defined in

<<<<<<< HEAD
[packages/core/src/runtime.ts:478](https://github.com/konstantine25b/eliza/blob/main/packages/core/src/runtime.ts#L478)
=======
[packages/core/src/runtime.ts:498](https://github.com/ai16z/eliza/blob/main/packages/core/src/runtime.ts#L498)
>>>>>>> main

***

### registerContextProvider()

> **registerContextProvider**(`provider`): `void`

Register a context provider to provide context for message generation.

#### Parameters

• **provider**: [`Provider`](../interfaces/Provider.md)

The context provider to register.

#### Returns

`void`

#### Defined in

<<<<<<< HEAD
[packages/core/src/runtime.ts:486](https://github.com/konstantine25b/eliza/blob/main/packages/core/src/runtime.ts#L486)
=======
[packages/core/src/runtime.ts:506](https://github.com/ai16z/eliza/blob/main/packages/core/src/runtime.ts#L506)
>>>>>>> main

***

### processActions()

> **processActions**(`message`, `responses`, `state`?, `callback`?): `Promise`\<`void`\>

Process the actions of a message.

#### Parameters

• **message**: [`Memory`](../interfaces/Memory.md)

The message to process.

• **responses**: [`Memory`](../interfaces/Memory.md)[]

• **state?**: [`State`](../interfaces/State.md)

• **callback?**: [`HandlerCallback`](../type-aliases/HandlerCallback.md)

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IAgentRuntime`](../interfaces/IAgentRuntime.md).[`processActions`](../interfaces/IAgentRuntime.md#processActions)

#### Defined in

<<<<<<< HEAD
[packages/core/src/runtime.ts:495](https://github.com/konstantine25b/eliza/blob/main/packages/core/src/runtime.ts#L495)
=======
[packages/core/src/runtime.ts:515](https://github.com/ai16z/eliza/blob/main/packages/core/src/runtime.ts#L515)
>>>>>>> main

***

### evaluate()

> **evaluate**(`message`, `state`?, `didRespond`?, `callback`?): `Promise`\<`string`[]\>

Evaluate the message and state using the registered evaluators.

#### Parameters

• **message**: [`Memory`](../interfaces/Memory.md)

The message to evaluate.

• **state?**: [`State`](../interfaces/State.md)

The state of the agent.

• **didRespond?**: `boolean`

Whether the agent responded to the message.~

• **callback?**: [`HandlerCallback`](../type-aliases/HandlerCallback.md)

The handler callback

#### Returns

`Promise`\<`string`[]\>

The results of the evaluation.

#### Implementation of

[`IAgentRuntime`](../interfaces/IAgentRuntime.md).[`evaluate`](../interfaces/IAgentRuntime.md#evaluate)

#### Defined in

<<<<<<< HEAD
[packages/core/src/runtime.ts:572](https://github.com/konstantine25b/eliza/blob/main/packages/core/src/runtime.ts#L572)
=======
[packages/core/src/runtime.ts:599](https://github.com/ai16z/eliza/blob/main/packages/core/src/runtime.ts#L599)
>>>>>>> main

***

### ensureParticipantExists()

> **ensureParticipantExists**(`userId`, `roomId`): `Promise`\<`void`\>

Ensure the existence of a participant in the room. If the participant does not exist, they are added to the room.

#### Parameters

• **userId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

The user ID to ensure the existence of.

• **roomId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

#### Returns

`Promise`\<`void`\>

#### Throws

An error if the participant cannot be added.

#### Implementation of

[`IAgentRuntime`](../interfaces/IAgentRuntime.md).[`ensureParticipantExists`](../interfaces/IAgentRuntime.md#ensureParticipantExists)

#### Defined in

<<<<<<< HEAD
[packages/core/src/runtime.ts:642](https://github.com/konstantine25b/eliza/blob/main/packages/core/src/runtime.ts#L642)
=======
[packages/core/src/runtime.ts:666](https://github.com/ai16z/eliza/blob/main/packages/core/src/runtime.ts#L666)
>>>>>>> main

***

### ensureUserExists()

> **ensureUserExists**(`userId`, `userName`, `name`, `email`?, `source`?): `Promise`\<`void`\>

Ensure the existence of a user in the database. If the user does not exist, they are added to the database.

#### Parameters

• **userId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

The user ID to ensure the existence of.

• **userName**: `string`

The user name to ensure the existence of.

• **name**: `string`

• **email?**: `string`

• **source?**: `string`

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IAgentRuntime`](../interfaces/IAgentRuntime.md).[`ensureUserExists`](../interfaces/IAgentRuntime.md#ensureUserExists)

#### Defined in

<<<<<<< HEAD
[packages/core/src/runtime.ts:658](https://github.com/konstantine25b/eliza/blob/main/packages/core/src/runtime.ts#L658)
=======
[packages/core/src/runtime.ts:682](https://github.com/ai16z/eliza/blob/main/packages/core/src/runtime.ts#L682)
>>>>>>> main

***

### ensureParticipantInRoom()

> **ensureParticipantInRoom**(`userId`, `roomId`): `Promise`\<`void`\>

#### Parameters

• **userId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

• **roomId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IAgentRuntime`](../interfaces/IAgentRuntime.md).[`ensureParticipantInRoom`](../interfaces/IAgentRuntime.md#ensureParticipantInRoom)

#### Defined in

<<<<<<< HEAD
[packages/core/src/runtime.ts:678](https://github.com/konstantine25b/eliza/blob/main/packages/core/src/runtime.ts#L678)
=======
[packages/core/src/runtime.ts:702](https://github.com/ai16z/eliza/blob/main/packages/core/src/runtime.ts#L702)
>>>>>>> main

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

#### Implementation of

[`IAgentRuntime`](../interfaces/IAgentRuntime.md).[`ensureConnection`](../interfaces/IAgentRuntime.md#ensureConnection)

#### Defined in

<<<<<<< HEAD
[packages/core/src/runtime.ts:695](https://github.com/konstantine25b/eliza/blob/main/packages/core/src/runtime.ts#L695)
=======
[packages/core/src/runtime.ts:719](https://github.com/ai16z/eliza/blob/main/packages/core/src/runtime.ts#L719)
>>>>>>> main

***

### ensureRoomExists()

> **ensureRoomExists**(`roomId`): `Promise`\<`void`\>

Ensure the existence of a room between the agent and a user. If no room exists, a new room is created and the user
and agent are added as participants. The room ID is returned.

#### Parameters

• **roomId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

#### Returns

`Promise`\<`void`\>

The room ID of the room between the agent and the user.

#### Throws

An error if the room cannot be created.

#### Implementation of

[`IAgentRuntime`](../interfaces/IAgentRuntime.md).[`ensureRoomExists`](../interfaces/IAgentRuntime.md#ensureRoomExists)

#### Defined in

<<<<<<< HEAD
[packages/core/src/runtime.ts:731](https://github.com/konstantine25b/eliza/blob/main/packages/core/src/runtime.ts#L731)
=======
[packages/core/src/runtime.ts:755](https://github.com/ai16z/eliza/blob/main/packages/core/src/runtime.ts#L755)
>>>>>>> main

***

### composeState()

> **composeState**(`message`, `additionalKeys`): `Promise`\<[`State`](../interfaces/State.md)\>

Compose the state of the agent into an object that can be passed or used for response generation.

#### Parameters

• **message**: [`Memory`](../interfaces/Memory.md)

The message to compose the state from.

• **additionalKeys** = `{}`

#### Returns

`Promise`\<[`State`](../interfaces/State.md)\>

The state of the agent.

#### Implementation of

[`IAgentRuntime`](../interfaces/IAgentRuntime.md).[`composeState`](../interfaces/IAgentRuntime.md#composeState)

#### Defined in

<<<<<<< HEAD
[packages/core/src/runtime.ts:744](https://github.com/konstantine25b/eliza/blob/main/packages/core/src/runtime.ts#L744)
=======
[packages/core/src/runtime.ts:768](https://github.com/ai16z/eliza/blob/main/packages/core/src/runtime.ts#L768)
>>>>>>> main

***

### updateRecentMessageState()

> **updateRecentMessageState**(`state`): `Promise`\<[`State`](../interfaces/State.md)\>

#### Parameters

• **state**: [`State`](../interfaces/State.md)

#### Returns

`Promise`\<[`State`](../interfaces/State.md)\>

#### Implementation of

[`IAgentRuntime`](../interfaces/IAgentRuntime.md).[`updateRecentMessageState`](../interfaces/IAgentRuntime.md#updateRecentMessageState)

#### Defined in

<<<<<<< HEAD
[packages/core/src/runtime.ts:1190](https://github.com/konstantine25b/eliza/blob/main/packages/core/src/runtime.ts#L1190)
=======
[packages/core/src/runtime.ts:1214](https://github.com/ai16z/eliza/blob/main/packages/core/src/runtime.ts#L1214)
>>>>>>> main
