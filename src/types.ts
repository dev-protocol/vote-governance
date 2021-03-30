import { BigNumber } from 'ethers'

export type VoteData = {
	readonly isValid: boolean
	readonly voter: string
	readonly options: readonly string[]
	readonly optionsRaw: readonly string[]
	readonly percentiles: readonly number[]
	readonly value: BigNumber
}

export type VoteAttributes = {
	readonly subject: string
	readonly body: string
	readonly period: number
	readonly options: readonly string[]
	readonly bodyMimeType: string
	readonly optionsMimeType: string
}
