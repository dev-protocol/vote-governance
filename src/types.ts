type VoteData = {
	readonly isValid: boolean
	readonly voter: string
	readonly options: readonly string[]
	readonly percentiles: readonly number[]
}
