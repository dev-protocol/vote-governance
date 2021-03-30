const getAllStakingValue = (
	user: string,
	toBlock: number
): readonly VoteData[] => {
	const formattedData = events.map((event) => {
		return typeof event.args === 'undefined'
			? ({
					isValid: false,
					voter: '',
					options: [],
					percentiles: [],
			  } as VoteData)
			: format(event.args)
	})
	return formattedData
}
