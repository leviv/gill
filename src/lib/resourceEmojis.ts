export const studentEmojis = [
	'👨‍🎓',
	'👩‍🎓',
	'🧑‍🎓',
	'👨🏻‍🎓',
	'👩🏻‍🎓',
	'👨🏼‍🎓',
	'👩🏼‍🎓',
	'👨🏽‍🎓',
	'👩🏽‍🎓',
	'👨🏾‍🎓',
	'👩🏾‍🎓',
	'👨🏿‍🎓',
	'👩🏿‍🎓'
];

export const managerEmojis = [
	'👨‍💼',
	'👩‍💼',
	'🧑‍💼',
	'👨🏻‍💼',
	'👩🏻‍💼',
	'👨🏼‍💼',
	'👩🏼‍💼',
	'👨🏽‍💼',
	'👩🏽‍💼',
	'👨🏾‍💼',
	'👩🏾‍💼',
	'👨🏿‍💼',
	'👩🏿‍💼'
];

export const fundraiserEmojis = [
	'🕵️‍♂️',
	'🕵️‍♀️',
	'🕵️',
	'🕵🏻‍♂️',
	'🕵🏻‍♀️',
	'🕵🏼‍♂️',
	'🕵🏼‍♀️',
	'🕵🏽‍♂️',
	'🕵🏽‍♀️',
	'🕵🏾‍♂️',
	'🕵🏾‍♀️',
	'🕵🏿‍♂️',
	'🕵🏿‍♀️'
];

export function getResourceEmojis(
	internCount: number,
	campaignManagerCount: number,
	corporateFundraiserCount: number
): string[] {
	const emojis: string[] = [];

	for (let i = 0; i < internCount; i++) {
		emojis.push(studentEmojis[Math.floor(Math.random() * studentEmojis.length)]);
	}

	for (let i = 0; i < campaignManagerCount; i++) {
		emojis.push(managerEmojis[Math.floor(Math.random() * managerEmojis.length)]);
	}

	for (let i = 0; i < corporateFundraiserCount; i++) {
		emojis.push(fundraiserEmojis[Math.floor(Math.random() * fundraiserEmojis.length)]);
	}

	return emojis;
}
