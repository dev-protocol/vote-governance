/* eslint-disable new-cap */
/* eslint-disable functional/no-expression-statement */
/* eslint-disable functional/functional-parameters */

import { expect } from 'chai'
import { describe } from 'mocha'
import { Contract, Event } from 'ethers'
import { deployContract, MockProvider, solidity } from 'ethereum-waffle'
//import {sumTransferEventValue} from '../../src/data-process'

//use(solidity)
// // The (n + 1)th parameter passed to contract event callbacks
// export type Event = Log & {

//     // The event name
//     readonly event?: string;

//     // The event signature
//     readonly eventSignature?: string;

//     // The parsed arguments to the event
//     readonly args?: Result;

//     // If parsing the arguments failed, this is the error
//     readonly decodeError?: Error;

//     // A function that can be used to decode event data and topics
//     readonly decode?: (data: string, topics?: ReadonlyArray<string>) => any;

//     // A function that will remove the listener responsible for this event (if any)
//     readonly removeListener: () => void;

//     // Get blockchain details about this event's block and transaction
//     readonly getBlock: () => Promise<Block>;
//     readonly getTransaction: () => Promise<TransactionResponse>;
//     readonly getTransactionReceipt: () => Promise<TransactionReceipt>;
// };

// describe('sumTransferEventValue', () => {
// 	const generateEventData1 = (): readonly Event[] => {
// 		return [
// 			{
// 				args: {
// 					'0': ''
// 				}
// 			} as Event,
// 			{

// 			} as Event,
// 			{

// 			} as Event,
// 		]
// 	}
// 	it('save vote infomation.', async () => {
// 		const [voteEmitter, wallets] = await init()
// 		const options0 = 0
// 		const options1 = 1
// 		const arg1 = [options0, options1]
// 		await voteEmitter.dispatch(wallets[1].address, arg1, [40, 60])
// 		const filterVote = voteEmitter.filters.Vote(wallets[0].address)
// 		const events = await voteEmitter.queryFilter(filterVote)
// 		expect(events[0].args?.[0]).to.be.equal(wallets[0].address)
// 		expect(events[0].args?.[1]).to.be.equal(wallets[1].address)
// 		expect(events[0].args?.[2][0]).to.be.equal(options0)
// 		expect(events[0].args?.[2][1]).to.be.equal(options1)
// 		expect(events[0].args?.[3][0]).to.be.equal(40)
// 		expect(events[0].args?.[3][1]).to.be.equal(60)
// 	})
// 	it('get use index.', async () => {
// 		const [voteEmitter, wallets] = await init()
// 		await voteEmitter.dispatch(wallets[1].address, [0, 1], [40, 60])
// 		await voteEmitter.dispatch(wallets[2].address, [1, 0], [30, 70])
// 		const otherVoteEmitter = voteEmitter.connect(wallets[3])
// 		await otherVoteEmitter.dispatch(wallets[4].address, [1, 0], [20, 80])

// 		const filterVote = voteEmitter.filters.Vote(wallets[0].address)
// 		const events = await voteEmitter.queryFilter(filterVote)
// 		expect(events[0].args?.[0]).to.be.equal(wallets[0].address)
// 		expect(events[0].args?.[1]).to.be.equal(wallets[1].address)
// 		expect(events[0].args?.[2][0]).to.be.equal(0)
// 		expect(events[0].args?.[2][1]).to.be.equal(1)
// 		expect(events[0].args?.[3][0]).to.be.equal(40)
// 		expect(events[0].args?.[3][1]).to.be.equal(60)
// 		expect(events[1].args?.[0]).to.be.equal(wallets[0].address)
// 		expect(events[1].args?.[1]).to.be.equal(wallets[2].address)
// 		expect(events[1].args?.[2][0]).to.be.equal(1)
// 		expect(events[1].args?.[2][1]).to.be.equal(0)
// 		expect(events[1].args?.[3][0]).to.be.equal(30)
// 		expect(events[1].args?.[3][1]).to.be.equal(70)
// 		expect(events.length).to.be.equal(2)

// 		const filterVote2 = voteEmitter.filters.Vote(wallets[3].address)
// 		const events2 = await voteEmitter.queryFilter(filterVote2)

// 		expect(events2[0].args?.[0]).to.be.equal(wallets[3].address)
// 		expect(events2[0].args?.[1]).to.be.equal(wallets[4].address)
// 		expect(events2[0].args?.[2][0]).to.be.equal(1)
// 		expect(events2[0].args?.[2][1]).to.be.equal(0)
// 		expect(events2[0].args?.[3][0]).to.be.equal(20)
// 		expect(events2[0].args?.[3][1]).to.be.equal(80)
// 		expect(events2.length).to.be.equal(1)
// 	})
// })
