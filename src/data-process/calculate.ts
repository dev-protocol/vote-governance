import { Event, BigNumber, Contract } from 'ethers'
import { VoteData, VoteAttributes } from './../types'

export const sumTransferEventValue = (
	events: readonly Event[]
):  BigNumber=> {
	const values = events.map((event) => {
		return typeof(event.args) === 'undefined' ? BigNumber.from(0): BigNumber.from(event.args[2])
	});
	return values.reduce((val1, val2) => {
		return val1.add(val2);
	  }, BigNumber.from(0));
}


// export const calculateVote = (
// 	options: readonly string[],
// 	voteData: readonly VoteData[]
// ):  BigNumber=> {
// 	voteInstance.options.map


// 	const OptionCount = voteData.map((data)=>{
// 		data.options.length

// 	})
// 	const values = events.map((event) => {
// 		return typeof(event.args) === 'undefined' ? BigNumber.from(0): BigNumber.from(event.args[2])
// 	});
// 	return values.reduce((val1, val2) => {
// 		return val1.add(val2);
// 	  }, BigNumber.from(0));
// }

// const getVoteByOption = (voteData: VoteData, optionRaw: string): any => {
// 	const index = voteData.optionsRaw.indexOf(optionRaw)

// }
