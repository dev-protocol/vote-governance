import { BigNumber } from 'ethers'

export type VoteData = {
	readonly isValid: boolean
	readonly voter: string
	readonly percentiles: readonly number[]
	readonly value: BigNumber
}

export type VoteAttributes = {
	readonly proposer: string
	readonly subject: string
	readonly body: string
	readonly period: number
	readonly options: readonly string[]
	readonly bodyMimeType: string
	readonly optionsMimeType: string
}

export type VoteInfo = {
	readonly id: string
	readonly counts: readonly string[]
	readonly count: string
}
