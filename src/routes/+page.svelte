<script lang="ts">
	import Button from '../components/Button.svelte';
	import Resources from '../components/Resources.svelte';
	import Intro from '../components/Intro.svelte';
	import Money from '../components/Money.svelte';
	import Headline from '../components/Headline.svelte';
	import DonationSlip from '../components/DonationSlip.svelte';
	import { onMount } from 'svelte';
	import headlinesData from '../lib/dcenquirer_headlines.json';
	import donationsData from '../lib/donations.csv?raw';
	import { parseDonationsCSV } from '../lib/csvParser';
	import { DonationGenerator, type DisplayedDonation } from '../lib/donationGenerator';
	import { HeadlineGenerator, type DisplayedHeadline } from '../lib/headlineGenerator';
	import { getResourceEmojis } from '../lib/resourceEmojis';

	let showIntro = $state(true);
	let money = $state(10000);
	let currentMultiplier = $state(1);
	let eagleSound: HTMLAudioElement;
	let hasStartedNewsCompany = $state(false);

	// Resource counts
	let internCount = $state(0);
	let campaignManagerCount = $state(0);
	let corporateFundraiserCount = $state(0);

	// Headlines and donations display
	let headlines = $state<DisplayedHeadline[]>([]);
	let donations = $state<DisplayedDonation[]>([]);

	// Generators
	let donationGenerator: DonationGenerator;
	let headlineGenerator: HeadlineGenerator;

	// Track highest multiple of 10 for eagle sound
	let highestTen = $state(0);

	// Reactive effect to play eagle sound when reaching new highest multiple of 10
	$effect(() => {
		const currentTen = Math.floor(money / 10);
		if (currentTen > highestTen && eagleSound) {
			highestTen = currentTen;
			eagleSound.currentTime = 0;
			eagleSound.play().catch((err) => console.log('Audio play failed:', err));
		}
	});

	onMount(() => {
		eagleSound = new Audio('/eagle.mp3');

		// Parse donations CSV
		const { individualDonations, corporateDonations } = parseDonationsCSV(donationsData);
		donationGenerator = new DonationGenerator(individualDonations, corporateDonations);

		// Initialize headline generator
		headlineGenerator = new HeadlineGenerator(headlinesData);
	});

	// Reactive intervals that update when counts change
	$effect(() => {
		if (internCount > 0) {
			const interval = setInterval(() => {
				money += 10;
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
					money += result.amount;
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
					money += result.amount;
					donations = [...donations, result.donation];
					if (donations.length > 100) donations = donations.slice(-100);
				}
			}, 10000 / corporateFundraiserCount);

			return () => clearInterval(interval);
		}
	});

	function handleClick() {
		money += currentMultiplier;
	}

	function handleIntroComplete() {
		showIntro = false;
	}

	function handleStartNewsCompany() {
		hasStartedNewsCompany = true;
	}

	let resourceEmojis = $derived(
		getResourceEmojis(internCount, campaignManagerCount, corporateFundraiserCount)
	);
</script>

{#if showIntro}
	<Intro onComplete={handleIntroComplete} />
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

	<div class="container">
		{#if hasStartedNewsCompany}
			<img src="/dc-enquirer.jpeg" alt="DC Enquirer" class="news-logo" />
		{/if}

		<Money {money} />

		<Button onclick={handleClick} />

		<Resources
			{money}
			{hasStartedNewsCompany}
			onMoneyChange={(amount) => (money += amount)}
			onStartNewsCompany={handleStartNewsCompany}
			onHireIntern={() => internCount++}
			onHireCampaignManager={() => campaignManagerCount++}
			onHireCorporateFundraiser={() => corporateFundraiserCount++}
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
	:global(body) {
		margin: 0;
		overflow: hidden;
	}

	.container {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 20px;
		margin-top: 20px;
		position: relative;
		z-index: 10;
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
