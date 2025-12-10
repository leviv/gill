<script lang="ts">
	import Button from '../components/Button.svelte';
	import Resources from '../components/Resources.svelte';
	import Intro from '../components/Intro.svelte';
	import Outro from '../components/Outro.svelte';
	import Money from '../components/Money.svelte';
	import Headline from '../components/Headline.svelte';
	import DonationSlip from '../components/DonationSlip.svelte';
	import StockTicker from '../components/StockTicker.svelte';
	import { onMount } from 'svelte';
	import headlinesData from '../lib/dcenquirer_headlines.json';
	import donationsData from '../lib/donations.csv?raw';
	import { parseDonationsCSV } from '../lib/csvParser';
	import { DonationGenerator, type DisplayedDonation } from '../lib/donationGenerator';
	import { HeadlineGenerator, type DisplayedHeadline } from '../lib/headlineGenerator';
	import { StockTickerGenerator, type DisplayedStockTicker } from '../lib/stockTickerGenerator';
	import { getResourceEmojis } from '../lib/resourceEmojis';

	let showIntro = $state(true);
	let showOutro = $state(false);
	let money = $state(10000);
	let currentMultiplier = $state(1);
	let eagleSound: HTMLAudioElement;
	let hasStartedNewsCompany = $state(false);
	let hasStateRep = $state(false);

	// Resource counts
	let internCount = $state(0);
	let campaignManagerCount = $state(0);
	let corporateFundraiserCount = $state(0);
	let insiderTradeCount = $state(0);

	// Headlines and donations display
	let headlines = $state<DisplayedHeadline[]>([]);
	let donations = $state<DisplayedDonation[]>([]);
	let stockTickers = $state<DisplayedStockTicker[]>([]);

	// Generators
	let donationGenerator: DonationGenerator;
	let headlineGenerator: HeadlineGenerator;
	let stockTickerGenerator: StockTickerGenerator;

	// Track highest power of 10 for eagle sound
	let highestPowerOfTen = $state(0);

	// Reactive effect to play eagle sound when reaching new highest power of 10
	$effect(() => {
		// Only track after game has started
		if (!hasStartedNewsCompany) return;

		// Find the current power of 10
		let currentPower = 0;
		if (money >= 10) {
			currentPower = Math.floor(Math.log10(money));
		}

		if (currentPower > highestPowerOfTen && eagleSound) {
			highestPowerOfTen = currentPower;
			eagleSound.currentTime = 0;
			eagleSound.play().catch((err) => console.log('Audio play failed:', err));
		}
	});

	onMount(() => {
		eagleSound = new Audio('eagle.mp3');

		// Parse donations CSV
		const { individualDonations, corporateDonations } = parseDonationsCSV(donationsData);
		donationGenerator = new DonationGenerator(individualDonations, corporateDonations);

		// Initialize headline generator
		headlineGenerator = new HeadlineGenerator(headlinesData);

		// Initialize stock ticker generator
		stockTickerGenerator = new StockTickerGenerator();
	});

	// Reactive intervals that update when counts change
	$effect(() => {
		if (internCount > 0) {
			const interval = setInterval(() => {
				const baseAmount = 10;
				money += hasStateRep ? baseAmount * 100 : baseAmount;
				const headline = headlineGenerator.generateHeadline(window.innerWidth, window.innerHeight);
				if (headline) {
					headlines = [...headlines, headline];
					if (headlines.length > 100) headlines = headlines.slice(-100);
				}
			}, 10000 / internCount);

			return () => clearInterval(interval);
		}
	});

	$effect(() => {
		if (campaignManagerCount > 0) {
			const interval = setInterval(() => {
				const result = donationGenerator.generateIndividualDonation(
					window.innerWidth,
					window.innerHeight
				);
				if (result) {
					const multipliedAmount = hasStateRep ? result.amount * 100 : result.amount;
					money += multipliedAmount;
					donations = [...donations, result.donation];
					if (donations.length > 100) donations = donations.slice(-100);
				}
			}, 10000 / campaignManagerCount);

			return () => clearInterval(interval);
		}
	});

	$effect(() => {
		if (corporateFundraiserCount > 0) {
			const interval = setInterval(() => {
				const result = donationGenerator.generateCorporateDonation(
					window.innerWidth,
					window.innerHeight
				);
				if (result) {
					const multipliedAmount = hasStateRep ? result.amount * 100 : result.amount;
					money += multipliedAmount;
					donations = [...donations, result.donation];
					if (donations.length > 100) donations = donations.slice(-100);
				}
			}, 10000 / corporateFundraiserCount);

			return () => clearInterval(interval);
		}
	});

	$effect(() => {
		if (insiderTradeCount > 0) {
			const interval = setInterval(() => {
				const baseAmount = 10000;
				money += hasStateRep ? baseAmount * 100 : baseAmount;
				const ticker = stockTickerGenerator.generateStockTicker(
					window.innerWidth,
					window.innerHeight
				);
				if (ticker) {
					stockTickers = [...stockTickers, ticker];
					if (stockTickers.length > 100) stockTickers = stockTickers.slice(-100);
				}
			}, 10000 / insiderTradeCount);

			return () => clearInterval(interval);
		}
	});

	function handleClick() {
		money += currentMultiplier;
	}

	function handleIntroComplete() {
		showIntro = false;
		// Play eagle sound on intro complete
		eagleSound.currentTime = 0;
		eagleSound.play().catch((err) => console.log('Audio play failed:', err));
	}

	function handleOutroComplete() {
		// Could show a "play again" option or just stay on the ending screen
		// For now, do nothing - user sees the final message
	}

	function handleRetire() {
		showOutro = true;
	}

	function handleStartNewsCompany() {
		hasStartedNewsCompany = true;
	}

	function handleBuyFacebookAds() {
		currentMultiplier += 1;
	}

	function handleBecomeStateRep() {
		hasStateRep = true;
		currentMultiplier *= 500;
	}

	function handleBuyInsiderTrade() {
		insiderTradeCount++;
		// Immediate feedback
		const baseAmount = 100_000;
		money += hasStateRep ? baseAmount * 500 : baseAmount;
		const ticker = stockTickerGenerator.generateStockTicker(window.innerWidth, window.innerHeight);
		if (ticker) {
			stockTickers = [...stockTickers, ticker];
			if (stockTickers.length > 100) stockTickers = stockTickers.slice(-100);
		}
	}

	let resourceEmojis = $derived(
		getResourceEmojis(internCount, campaignManagerCount, corporateFundraiserCount)
	);
</script>

<svelte:head>
	<title
		>{hasStartedNewsCompany ? `$${Math.round(money).toLocaleString()} - ` : ''}Gill Simulator</title
	>
	<meta
		name="description"
		content="Simulate running a sensationalist news company in Washington, D.C."
	/>
</svelte:head>

{#if showIntro}
	<Intro onComplete={handleIntroComplete} />
{:else if showOutro}
	<Outro onComplete={handleOutroComplete} />
{:else}
	<!-- Headlines -->
	{#each headlines as headline (headline.id)}
		<Headline text={headline.text} x={headline.x} y={headline.y} />
	{/each}

	<!-- Donations -->
	{#each donations as donation (donation.id)}
		<DonationSlip
			contributorName={donation.contributorName}
			amount={donation.amount}
			isCorporate={donation.isCorporate}
			fecUrl={donation.fecUrl}
			x={donation.x}
			y={donation.y}
		/>
	{/each}

	<!-- Stock Tickers -->
	{#each stockTickers as ticker (ticker.id)}
		<StockTicker ticker={ticker.ticker} profit={ticker.profit} x={ticker.x} y={ticker.y} />
	{/each}

	<div class="container">
		{#if hasStartedNewsCompany}
			<img src="dc-enquirer.jpeg" alt="DC Enquirer" class="news-logo" />
		{/if}

		<Money {money} />

		<Button onclick={handleClick} clickValue={currentMultiplier} />

		<Resources
			{money}
			{hasStartedNewsCompany}
			onMoneyChange={(amount) => (money += amount)}
			onStartNewsCompany={handleStartNewsCompany}
			onHireIntern={() => {
				internCount++;
				// Immediate feedback
				const baseAmount = 10;
				money += hasStateRep ? baseAmount * 100 : baseAmount;
				const headline = headlineGenerator.generateHeadline(window.innerWidth, window.innerHeight);
				if (headline) {
					headlines = [...headlines, headline];
					if (headlines.length > 100) headlines = headlines.slice(-100);
				}
			}}
			onHireCampaignManager={() => {
				campaignManagerCount++;
				// Immediate feedback
				const result = donationGenerator.generateIndividualDonation(
					window.innerWidth,
					window.innerHeight
				);
				if (result) {
					const multipliedAmount = hasStateRep ? result.amount * 100 : result.amount;
					money += multipliedAmount;
					donations = [...donations, result.donation];
					if (donations.length > 100) donations = donations.slice(-100);
				}
			}}
			onHireCorporateFundraiser={() => {
				corporateFundraiserCount++;
				// Immediate feedback
				const result = donationGenerator.generateCorporateDonation(
					window.innerWidth,
					window.innerHeight
				);
				if (result) {
					const multipliedAmount = hasStateRep ? result.amount * 100 : result.amount;
					money += multipliedAmount;
					donations = [...donations, result.donation];
					if (donations.length > 100) donations = donations.slice(-100);
				}
			}}
			onBuyFacebookAds={handleBuyFacebookAds}
			onBecomeStateRep={handleBecomeStateRep}
			onBuyInsiderTrade={handleBuyInsiderTrade}
			onRetire={handleRetire}
		/>
	</div>
	<!-- Resource emoji counter at bottom -->
	{#if hasStartedNewsCompany && resourceEmojis.length > 0}
		<div class="resource-emoji-bar">
			{#each resourceEmojis as emoji}
				<span class="resource-emoji">{emoji}</span>
			{/each}
		</div>
	{/if}
{/if}

<style>
	@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');

	:global(body) {
		margin: 0;
		overflow: hidden;
		background-image:
			radial-gradient(circle, #dc143c 1.5px, transparent 1.5px),
			radial-gradient(circle, #ffffff 1.5px, transparent 1.5px),
			radial-gradient(circle, #0000cd 1.5px, transparent 1.5px);
		background-size:
			60px 60px,
			60px 60px,
			60px 60px;
		background-position:
			0 0,
			20px 20px,
			40px 40px;
		background-color: #ffe4e4;
		font-family: Calibri, sans-serif;
		font-weight: 400;
		font-size: 16px;
	}

	.container {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 20px;
		margin-top: 20px;
		position: relative;
		z-index: 10;
		pointer-events: none;
	}

	.news-logo {
		max-width: 300px;
		width: 100%;
		height: auto;
	}

	.resource-emoji-bar {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		display: flex;
		flex-wrap: wrap;
		gap: 4px;
		padding: 8px;
		background: rgba(255, 255, 255, 0.9);
		border-top: 2px solid #ddd;
		z-index: 15;
		max-height: 200px;
		overflow-y: auto;
	}

	.resource-emoji {
		font-size: 24px;
		user-select: none;
	}
</style>
