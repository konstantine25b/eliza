[@ai16z/eliza v0.1.5-alpha.5](../index.md) / State

# Interface: State

Represents the current state/context of a conversation

## Indexable

 \[`key`: `string`\]: `unknown`

## Properties

### userId?

> `optional` **userId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

ID of user who sent current message

#### Defined in

<<<<<<< HEAD
[packages/core/src/types.ts:246](https://github.com/ai16z/eliza/blob/main/packages/core/src/types.ts#L246)
=======
[packages/core/src/types.ts:240](https://github.com/konstantine25b/eliza/blob/main/packages/core/src/types.ts#L240)
>>>>>>> founderlist

***

### agentId?

> `optional` **agentId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

ID of agent in conversation

#### Defined in

<<<<<<< HEAD
[packages/core/src/types.ts:249](https://github.com/ai16z/eliza/blob/main/packages/core/src/types.ts#L249)
=======
[packages/core/src/types.ts:243](https://github.com/konstantine25b/eliza/blob/main/packages/core/src/types.ts#L243)
>>>>>>> founderlist

***

### bio

> **bio**: `string`

Agent's biography

#### Defined in

<<<<<<< HEAD
[packages/core/src/types.ts:252](https://github.com/ai16z/eliza/blob/main/packages/core/src/types.ts#L252)
=======
[packages/core/src/types.ts:246](https://github.com/konstantine25b/eliza/blob/main/packages/core/src/types.ts#L246)
>>>>>>> founderlist

***

### lore

> **lore**: `string`

Agent's background lore

#### Defined in

<<<<<<< HEAD
[packages/core/src/types.ts:255](https://github.com/ai16z/eliza/blob/main/packages/core/src/types.ts#L255)
=======
[packages/core/src/types.ts:249](https://github.com/konstantine25b/eliza/blob/main/packages/core/src/types.ts#L249)
>>>>>>> founderlist

***

### messageDirections

> **messageDirections**: `string`

Message handling directions

#### Defined in

<<<<<<< HEAD
[packages/core/src/types.ts:258](https://github.com/ai16z/eliza/blob/main/packages/core/src/types.ts#L258)
=======
[packages/core/src/types.ts:252](https://github.com/konstantine25b/eliza/blob/main/packages/core/src/types.ts#L252)
>>>>>>> founderlist

***

### postDirections

> **postDirections**: `string`

Post handling directions

#### Defined in

<<<<<<< HEAD
[packages/core/src/types.ts:261](https://github.com/ai16z/eliza/blob/main/packages/core/src/types.ts#L261)
=======
[packages/core/src/types.ts:255](https://github.com/konstantine25b/eliza/blob/main/packages/core/src/types.ts#L255)
>>>>>>> founderlist

***

### roomId

> **roomId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

Current room/conversation ID

#### Defined in

<<<<<<< HEAD
[packages/core/src/types.ts:264](https://github.com/ai16z/eliza/blob/main/packages/core/src/types.ts#L264)
=======
[packages/core/src/types.ts:258](https://github.com/konstantine25b/eliza/blob/main/packages/core/src/types.ts#L258)
>>>>>>> founderlist

***

### agentName?

> `optional` **agentName**: `string`

Optional agent name

#### Defined in

<<<<<<< HEAD
[packages/core/src/types.ts:267](https://github.com/ai16z/eliza/blob/main/packages/core/src/types.ts#L267)
=======
[packages/core/src/types.ts:261](https://github.com/konstantine25b/eliza/blob/main/packages/core/src/types.ts#L261)
>>>>>>> founderlist

***

### senderName?

> `optional` **senderName**: `string`

Optional message sender name

#### Defined in

<<<<<<< HEAD
[packages/core/src/types.ts:270](https://github.com/ai16z/eliza/blob/main/packages/core/src/types.ts#L270)
=======
[packages/core/src/types.ts:264](https://github.com/konstantine25b/eliza/blob/main/packages/core/src/types.ts#L264)
>>>>>>> founderlist

***

### actors

> **actors**: `string`

String representation of conversation actors

#### Defined in

<<<<<<< HEAD
[packages/core/src/types.ts:273](https://github.com/ai16z/eliza/blob/main/packages/core/src/types.ts#L273)
=======
[packages/core/src/types.ts:267](https://github.com/konstantine25b/eliza/blob/main/packages/core/src/types.ts#L267)
>>>>>>> founderlist

***

### actorsData?

> `optional` **actorsData**: [`Actor`](Actor.md)[]

Optional array of actor objects

#### Defined in

<<<<<<< HEAD
[packages/core/src/types.ts:276](https://github.com/ai16z/eliza/blob/main/packages/core/src/types.ts#L276)
=======
[packages/core/src/types.ts:270](https://github.com/konstantine25b/eliza/blob/main/packages/core/src/types.ts#L270)
>>>>>>> founderlist

***

### goals?

> `optional` **goals**: `string`

Optional string representation of goals

#### Defined in

<<<<<<< HEAD
[packages/core/src/types.ts:279](https://github.com/ai16z/eliza/blob/main/packages/core/src/types.ts#L279)
=======
[packages/core/src/types.ts:273](https://github.com/konstantine25b/eliza/blob/main/packages/core/src/types.ts#L273)
>>>>>>> founderlist

***

### goalsData?

> `optional` **goalsData**: [`Goal`](Goal.md)[]

Optional array of goal objects

#### Defined in

<<<<<<< HEAD
[packages/core/src/types.ts:282](https://github.com/ai16z/eliza/blob/main/packages/core/src/types.ts#L282)
=======
[packages/core/src/types.ts:276](https://github.com/konstantine25b/eliza/blob/main/packages/core/src/types.ts#L276)
>>>>>>> founderlist

***

### recentMessages

> **recentMessages**: `string`

Recent message history as string

#### Defined in

<<<<<<< HEAD
[packages/core/src/types.ts:285](https://github.com/ai16z/eliza/blob/main/packages/core/src/types.ts#L285)
=======
[packages/core/src/types.ts:279](https://github.com/konstantine25b/eliza/blob/main/packages/core/src/types.ts#L279)
>>>>>>> founderlist

***

### recentMessagesData

> **recentMessagesData**: [`Memory`](Memory.md)[]

Recent message objects

#### Defined in

<<<<<<< HEAD
[packages/core/src/types.ts:288](https://github.com/ai16z/eliza/blob/main/packages/core/src/types.ts#L288)
=======
[packages/core/src/types.ts:282](https://github.com/konstantine25b/eliza/blob/main/packages/core/src/types.ts#L282)
>>>>>>> founderlist

***

### actionNames?

> `optional` **actionNames**: `string`

Optional valid action names

#### Defined in

<<<<<<< HEAD
[packages/core/src/types.ts:291](https://github.com/ai16z/eliza/blob/main/packages/core/src/types.ts#L291)
=======
[packages/core/src/types.ts:285](https://github.com/konstantine25b/eliza/blob/main/packages/core/src/types.ts#L285)
>>>>>>> founderlist

***

### actions?

> `optional` **actions**: `string`

Optional action descriptions

#### Defined in

<<<<<<< HEAD
[packages/core/src/types.ts:294](https://github.com/ai16z/eliza/blob/main/packages/core/src/types.ts#L294)
=======
[packages/core/src/types.ts:288](https://github.com/konstantine25b/eliza/blob/main/packages/core/src/types.ts#L288)
>>>>>>> founderlist

***

### actionsData?

> `optional` **actionsData**: [`Action`](Action.md)[]

Optional action objects

#### Defined in

<<<<<<< HEAD
[packages/core/src/types.ts:297](https://github.com/ai16z/eliza/blob/main/packages/core/src/types.ts#L297)
=======
[packages/core/src/types.ts:291](https://github.com/konstantine25b/eliza/blob/main/packages/core/src/types.ts#L291)
>>>>>>> founderlist

***

### actionExamples?

> `optional` **actionExamples**: `string`

Optional action examples

#### Defined in

<<<<<<< HEAD
[packages/core/src/types.ts:300](https://github.com/ai16z/eliza/blob/main/packages/core/src/types.ts#L300)
=======
[packages/core/src/types.ts:294](https://github.com/konstantine25b/eliza/blob/main/packages/core/src/types.ts#L294)
>>>>>>> founderlist

***

### providers?

> `optional` **providers**: `string`

Optional provider descriptions

#### Defined in

<<<<<<< HEAD
[packages/core/src/types.ts:303](https://github.com/ai16z/eliza/blob/main/packages/core/src/types.ts#L303)
=======
[packages/core/src/types.ts:297](https://github.com/konstantine25b/eliza/blob/main/packages/core/src/types.ts#L297)
>>>>>>> founderlist

***

### responseData?

> `optional` **responseData**: [`Content`](Content.md)

Optional response content

#### Defined in

<<<<<<< HEAD
[packages/core/src/types.ts:306](https://github.com/ai16z/eliza/blob/main/packages/core/src/types.ts#L306)
=======
[packages/core/src/types.ts:300](https://github.com/konstantine25b/eliza/blob/main/packages/core/src/types.ts#L300)
>>>>>>> founderlist

***

### recentInteractionsData?

> `optional` **recentInteractionsData**: [`Memory`](Memory.md)[]

Optional recent interaction objects

#### Defined in

<<<<<<< HEAD
[packages/core/src/types.ts:309](https://github.com/ai16z/eliza/blob/main/packages/core/src/types.ts#L309)
=======
[packages/core/src/types.ts:303](https://github.com/konstantine25b/eliza/blob/main/packages/core/src/types.ts#L303)
>>>>>>> founderlist

***

### recentInteractions?

> `optional` **recentInteractions**: `string`

Optional recent interactions string

#### Defined in

<<<<<<< HEAD
[packages/core/src/types.ts:312](https://github.com/ai16z/eliza/blob/main/packages/core/src/types.ts#L312)
=======
[packages/core/src/types.ts:306](https://github.com/konstantine25b/eliza/blob/main/packages/core/src/types.ts#L306)
>>>>>>> founderlist

***

### formattedConversation?

> `optional` **formattedConversation**: `string`

Optional formatted conversation

#### Defined in

<<<<<<< HEAD
[packages/core/src/types.ts:315](https://github.com/ai16z/eliza/blob/main/packages/core/src/types.ts#L315)
=======
[packages/core/src/types.ts:309](https://github.com/konstantine25b/eliza/blob/main/packages/core/src/types.ts#L309)
>>>>>>> founderlist

***

### knowledge?

> `optional` **knowledge**: `string`

Optional formatted knowledge

#### Defined in

<<<<<<< HEAD
[packages/core/src/types.ts:318](https://github.com/ai16z/eliza/blob/main/packages/core/src/types.ts#L318)
=======
[packages/core/src/types.ts:312](https://github.com/konstantine25b/eliza/blob/main/packages/core/src/types.ts#L312)
>>>>>>> founderlist

***

### knowledgeData?

> `optional` **knowledgeData**: [`KnowledgeItem`](../type-aliases/KnowledgeItem.md)[]

Optional knowledge data

#### Defined in

<<<<<<< HEAD
[packages/core/src/types.ts:320](https://github.com/ai16z/eliza/blob/main/packages/core/src/types.ts#L320)
=======
[packages/core/src/types.ts:314](https://github.com/konstantine25b/eliza/blob/main/packages/core/src/types.ts#L314)
>>>>>>> founderlist
