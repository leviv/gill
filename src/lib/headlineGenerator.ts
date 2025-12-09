export interface DisplayedHeadline {
	id: number;
	text: string;
	x: number;
	y: number;
}

export class HeadlineGenerator {
	private headlines: string[];
	private usedHeadlineIndices = new Set<number>();
	private headlineIdCounter = 0;

	constructor(headlines: string[]) {
		this.headlines = headlines;
	}

	generateHeadline(windowWidth: number, windowHeight: number): DisplayedHeadline | null {
		if (this.headlines.length === 0) return null;

		let headlineIndex: number;
		let attempts = 0;
		do {
			headlineIndex = Math.floor(Math.random() * this.headlines.length);
			attempts++;
			if (attempts > 100) {
				this.usedHeadlineIndices.clear();
			}
		} while (this.usedHeadlineIndices.has(headlineIndex) && attempts <= 100);

		this.usedHeadlineIndices.add(headlineIndex);
		const headlineText = this.headlines[headlineIndex];

		const id = this.headlineIdCounter++;
		const x = Math.random() * (windowWidth - 270);
		const y = Math.random() * (windowHeight - 150);

		return { id, text: headlineText, x, y };
	}
}
