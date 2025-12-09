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

	let showIntro = $state(true);
	let money = $state(10000);
	let currentMultiplier = $state(1);
	let eagleSound: HTMLAudioElement;
	let autoClickers = $state(0); // Interns
	let lobbyists = $state(0);
	let hasStartedNewsCompany = $state(false);

	// New resources
	let internCount = $state(0);
	let campaignManagerCount = $state(0);
	let corporateFundraiserCount = $state(0);

	// Headlines and donations
	interface DisplayedHeadline {
		id: number;
		text: string;
		x: number;
		y: number;
	}

	interface DisplayedDonation {
		id: number;
		contributorName: string;
		amount: number;
		isCorporate: boolean;
		fecUrl?: string;
		x: number;
		y: number;
	}

	let headlines = $state<DisplayedHeadline[]>([]);
	let donations = $state<DisplayedDonation[]>([]);
	let headlineIdCounter = 0;
	let donationIdCounter = 0;

	// Parse donations CSV
	let parsedDonations: any[] = [];
	let individualDonations: any[] = [];
	let corporateDonations: any[] = [];
	let usedIndividualIndices = new Set<number>();
	let usedCorporateIndices = new Set<number>();

	// Track used headlines
	let usedHeadlineIndices = new Set<number>();

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

	// Background emojis
	interface BackgroundEmoji {
		emoji: string;
		x: number;
		y: number;
	}

	let backgroundEmojis = $state<BackgroundEmoji[]>([]);

	const internEmojis = ['👨‍🎓', '👩‍🎓', '🧑‍🎓'];
	const lobbyistEmojis = [
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

	function getRandomEmoji(emojiList: string[]): string {
		return emojiList[Math.floor(Math.random() * emojiList.length)];
	}

	function addBackgroundEmoji(emojiList: string[]) {
		const gridSize = 50;
		const emoji = getRandomEmoji(emojiList);

		// Find next available grid position
		const existingPositions = new Set(backgroundEmojis.map((e) => `${e.x},${e.y}`));

		// Try to find an empty spot in a spiral pattern from center
		const centerX = Math.floor(window.innerWidth / 2 / gridSize) * gridSize;
		const centerY = Math.floor(window.innerHeight / 2 / gridSize) * gridSize;

		let x = centerX;
		let y = centerY;
		let found = false;

		// Simple approach: try random positions until we find an empty one
		for (let attempts = 0; attempts < 100; attempts++) {
			x = Math.floor(Math.random() * (window.innerWidth / gridSize)) * gridSize;
			y = Math.floor(Math.random() * (window.innerHeight / gridSize)) * gridSize;

			if (!existingPositions.has(`${x},${y}`)) {
				found = true;
				break;
			}
		}

		// If we couldn't find a spot, just add it anyway
		backgroundEmojis = [...backgroundEmojis, { emoji, x, y }];
	}

	onMount(() => {
		eagleSound = new Audio('/eagle.mp3');

		// Parse donations CSV with proper handling of quoted fields
		const lines = donationsData.split('\n');
		const headers = parseCSVLine(lines[0]);

		for (let i = 1; i < lines.length; i++) {
			if (!lines[i].trim()) continue;

			const values = parseCSVLine(lines[i]);
			if (values.length > 0) {
				const donation: any = {};
				headers.forEach((header, index) => {
					donation[header] = values[index] || '';
				});
				parsedDonations.push(donation);

				// Categorize donations
				const entityType = donation.entity_type_desc?.toUpperCase();
				if (entityType === 'INDIVIDUAL') {
					individualDonations.push(donation);
				} else if (
					entityType === 'POLITICAL ACTION COMMITTEE' ||
					donation.contributor_name?.includes('LLC') ||
					donation.contributor_name?.includes('CORP') ||
					donation.contributor_name?.includes('INC')
				) {
					corporateDonations.push(donation);
				}
			}
		}
	});

	// Helper function to parse CSV line with quoted fields
	function parseCSVLine(line: string): string[] {
		const result: string[] = [];
		let current = '';
		let inQuotes = false;

		for (let i = 0; i < line.length; i++) {
			const char = line[i];

			if (char === '"') {
				inQuotes = !inQuotes;
			} else if (char === ',' && !inQuotes) {
				result.push(current.trim());
				current = '';
			} else {
				current += char;
			}
		}
		result.push(current.trim());

		return result;
	}

	// Reactive intervals that update when counts change
	$effect(() => {
		if (internCount > 0) {
			const interval = setInterval(() => {
				incrementMoney(10);
				generateHeadline();
			}, 10000 / internCount);

			return () => clearInterval(interval);
		}
	});

	$effect(() => {
		if (campaignManagerCount > 0) {
			const interval = setInterval(() => {
				generateIndividualDonation();
			}, 10000 / campaignManagerCount);

			return () => clearInterval(interval);
		}
	});

	$effect(() => {
		if (corporateFundraiserCount > 0) {
			const interval = setInterval(() => {
				generateCorporateDonation();
			}, 10000 / corporateFundraiserCount);

			return () => clearInterval(interval);
		}
	});

	function generateHeadline() {
		if (headlinesData.length === 0) return;

		// Get a random unused headline
		let headlineIndex: number;
		let attempts = 0;
		do {
			headlineIndex = Math.floor(Math.random() * headlinesData.length);
			attempts++;
			if (attempts > 100) {
				// Reset if all used
				usedHeadlineIndices.clear();
			}
		} while (usedHeadlineIndices.has(headlineIndex) && attempts <= 100);

		usedHeadlineIndices.add(headlineIndex);
		const headlineText = headlinesData[headlineIndex];

		const id = headlineIdCounter++;
		const x = Math.random() * (window.innerWidth - 270);
		const y = Math.random() * (window.innerHeight - 150);

		headlines = [...headlines, { id, text: headlineText, x, y }];

		// Remove oldest headlines if we have more than 100
		if (headlines.length > 100) {
			headlines = headlines.slice(-100);
		}
	}

	function generateIndividualDonation() {
		if (individualDonations.length === 0) return;

		// Get a random unused individual donation
		let donationIndex: number;
		let attempts = 0;
		do {
			donationIndex = Math.floor(Math.random() * individualDonations.length);
			attempts++;
			if (attempts > 100) {
				usedIndividualIndices.clear();
			}
		} while (usedIndividualIndices.has(donationIndex) && attempts <= 100);

		usedIndividualIndices.add(donationIndex);
		const donation = individualDonations[donationIndex];

		const amount = Math.abs(parseFloat(donation.contribution_receipt_amount) || 0);
		incrementMoney(amount);

		// Build name from first, middle, last if available
		let name = '';
		if (donation.contributor_first_name && donation.contributor_last_name) {
			// Use first middle last format
			name = donation.contributor_first_name;
			if (donation.contributor_middle_name) {
				name += ' ' + donation.contributor_middle_name;
			}
			name += ' ' + donation.contributor_last_name;
		} else if (donation.contributor_name) {
			// Parse "LAST, FIRST" format
			const nameParts = donation.contributor_name.split(',').map((p: string) => p.trim());
			if (nameParts.length === 2) {
				name = nameParts[1] + ' ' + nameParts[0]; // Convert to "FIRST LAST"
			} else {
				name = donation.contributor_name;
			}
		} else {
			name = 'Anonymous';
		}

		// Construct FEC URL from image_number
		const fecUrl = donation.image_number
			? `https://docquery.fec.gov/cgi-bin/fecimg/?${donation.image_number}`
			: undefined;

		const id = donationIdCounter++;
		const x = Math.random() * (window.innerWidth - 240);
		const y = Math.random() * (window.innerHeight - 150);

		donations = [
			...donations,
			{
				id,
				contributorName: name,
				amount,
				isCorporate: false,
				fecUrl,
				x,
				y
			}
		];

		// Remove oldest donations if we have more than 100
		if (donations.length > 100) {
			donations = donations.slice(-100);
		}
	}

	function generateCorporateDonation() {
		if (corporateDonations.length === 0) return;

		// Get a random unused corporate donation
		let donationIndex: number;
		let attempts = 0;
		do {
			donationIndex = Math.floor(Math.random() * corporateDonations.length);
			attempts++;
			if (attempts > 100) {
				usedCorporateIndices.clear();
			}
		} while (usedCorporateIndices.has(donationIndex) && attempts <= 100);

		usedCorporateIndices.add(donationIndex);
		const donation = corporateDonations[donationIndex];

		const amount = Math.abs(parseFloat(donation.contribution_receipt_amount) || 0);
		incrementMoney(amount);

		// Construct FEC URL from image_number
		const fecUrl = donation.image_number
			? `https://docquery.fec.gov/cgi-bin/fecimg/?${donation.image_number}`
			: undefined;

		const id = donationIdCounter++;
		const x = Math.random() * window.innerWidth - 120;
		const y = Math.random() * window.innerHeight - 75;

		donations = [
			...donations,
			{
				id,
				contributorName:
					donation.contributor_name || donation.donor_committee_name || 'Anonymous Corp',
				amount,
				isCorporate: true,
				fecUrl,
				x,
				y
			}
		];

		// Remove oldest donations if we have more than 100
		if (donations.length > 100) {
			donations = donations.slice(-100);
		}
	}

	function removeDonation(id: number) {
		donations = donations.filter((d) => d.id !== id);
	}

	function incrementMoney(amount: number) {
		money += amount;
	}

	function handleClick() {
		incrementMoney(currentMultiplier);
	}

	function handleMoneyChange(amount: number) {
		money += amount;
	}

	function handleMultiplierChange(amount: number) {
		currentMultiplier += amount;
	}

	function handleAutoClickersChange(amount: number) {
		autoClickers += amount;
	}

	function handleLobbyistsChange(amount: number) {
		lobbyists += amount;
	}

	function handleAddEmoji(type: 'intern' | 'lobbyist') {
		const emojiList = type === 'intern' ? internEmojis : lobbyistEmojis;
		addBackgroundEmoji(emojiList);
	}

	function handleIntroComplete() {
		showIntro = false;
	}

	function handleStartNewsCompany() {
		hasStartedNewsCompany = true;
	}

	function handleHireIntern() {
		internCount++;
	}

	function handleHireCampaignManager() {
		campaignManagerCount++;
	}

	function handleHireCorporateFundraiser() {
		corporateFundraiserCount++;
	}

	// Emoji variations for each resource type
	const studentEmojis = [
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
	const managerEmojis = [
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
	const fundraiserEmojis = [
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

	function getResourceEmojis() {
		const emojis: string[] = [];

		// Add interns
		for (let i = 0; i < internCount; i++) {
			emojis.push(studentEmojis[i % studentEmojis.length]);
		}

		// Add campaign managers
		for (let i = 0; i < campaignManagerCount; i++) {
			emojis.push(managerEmojis[i % managerEmojis.length]);
		}

		// Add corporate fundraisers
		for (let i = 0; i < corporateFundraiserCount; i++) {
			emojis.push(fundraiserEmojis[i % fundraiserEmojis.length]);
		}

		return emojis;
	}

	let resourceEmojis = $derived(getResourceEmojis());
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

	<!-- Background emojis -->
	<div class="background-emojis">
		{#each backgroundEmojis as bgEmoji}
			<div class="emoji" style="left: {bgEmoji.x}px; top: {bgEmoji.y}px;">
				{bgEmoji.emoji}
			</div>
		{/each}
	</div>

	<div class="container">
		{#if hasStartedNewsCompany}
			<img src="/dc-enquirer.jpeg" alt="DC Enquirer" class="news-logo" />
		{/if}

		{#if hasStartedNewsCompany}
			<Money {money} />
		{/if}

		<Button onclick={handleClick} />

		<Resources
			{money}
			{currentMultiplier}
			{autoClickers}
			{lobbyists}
			{hasStartedNewsCompany}
			onMoneyChange={handleMoneyChange}
			onMultiplierChange={handleMultiplierChange}
			onAutoClickersChange={handleAutoClickersChange}
			onLobbyistsChange={handleLobbyistsChange}
			onAddEmoji={handleAddEmoji}
			onStartNewsCompany={handleStartNewsCompany}
			onHireIntern={handleHireIntern}
			onHireCampaignManager={handleHireCampaignManager}
			onHireCorporateFundraiser={handleHireCorporateFundraiser}
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

	.background-emojis {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
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

	.news-logo {
		max-width: 300px;
		width: 100%;
		height: auto;
	}
</style>
