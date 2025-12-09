export interface DisplayedStockTicker {
	id: number;
	ticker: string;
	profit: number;
	x: number;
	y: number;
}

let tickerIdCounter = 0;

// Common stock ticker symbols (mix of real and fictional)
const stockTickers = [
	'AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA', 'META', 'NVDA', 'AMD', 'INTC', 'NFLX',
	'DIS', 'BA', 'GE', 'GM', 'F', 'T', 'VZ', 'JPM', 'BAC', 'WFC',
	'XOM', 'CVX', 'PFE', 'JNJ', 'UNH', 'HD', 'NKE', 'MCD', 'SBUX', 'KO',
	'PEP', 'WMT', 'TGT', 'COST', 'LOW', 'ORCL', 'IBM', 'CSCO', 'V', 'MA',
	'PYPL', 'SQ', 'UBER', 'LYFT', 'ABNB', 'SNAP', 'TWTR', 'SPOT', 'ZM', 'PINS'
];

export class StockTickerGenerator {
	private usedTickers: Set<string> = new Set();

	generateStockTicker(windowWidth: number, windowHeight: number): DisplayedStockTicker | null {
		// Get a random ticker that hasn't been used recently
		let ticker: string;
		let attempts = 0;
		
		do {
			ticker = stockTickers[Math.floor(Math.random() * stockTickers.length)];
			attempts++;
			// If we've tried too many times, clear the used tickers and start fresh
			if (attempts > 50) {
				this.usedTickers.clear();
			}
		} while (this.usedTickers.has(ticker) && attempts <= 50);

		this.usedTickers.add(ticker);
		
		// Keep the set manageable
		if (this.usedTickers.size > 20) {
			const firstTicker = Array.from(this.usedTickers)[0];
			this.usedTickers.delete(firstTicker);
		}

		// Random position on screen
		const x = Math.random() * (windowWidth - 250);
		const y = Math.random() * (windowHeight - 150);

		return {
			id: tickerIdCounter++,
			ticker,
			profit: 10000,
			x,
			y
		};
	}
}
