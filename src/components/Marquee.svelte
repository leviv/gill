<script lang="ts">
	import { onMount } from 'svelte';
	import headlines from '$lib/dcenquirer_headlines.json';

	// Number of headlines to show at once (balance between variety and performance)
	const HEADLINES_TO_SHOW = 50;

	// Shuffle array using Fisher-Yates algorithm
	function shuffleArray<T>(array: T[]): T[] {
		const shuffled = [...array];
		for (let i = shuffled.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
		}
		return shuffled;
	}

	// Get a random subset of headlines
	function getRandomHeadlines(count: number): string[] {
		const shuffled = shuffleArray(headlines);
		return shuffled.slice(0, count);
	}

	let displayedHeadlines = getRandomHeadlines(HEADLINES_TO_SHOW);

	// Duplicate headlines for seamless loop
	$: headlinesToRender = [...displayedHeadlines, ...displayedHeadlines];

	onMount(() => {
		// Optionally rotate to new headlines periodically (every 2 minutes)
		const interval = setInterval(() => {
			displayedHeadlines = getRandomHeadlines(HEADLINES_TO_SHOW);
		}, 120000);

		return () => clearInterval(interval);
	});
</script>

<div class="marquee-container">
	<div class="marquee-content">
		{#each headlinesToRender as headline}
			<span class="headline">{headline}</span>
		{/each}
	</div>
</div>

<style>
	.marquee-container {
		width: 100%;
		overflow: hidden;
		background: #000;
		color: #fff;
		padding: 1rem 0;
		position: relative;
	}

	.marquee-content {
		display: flex;
		gap: 3rem;
		white-space: nowrap;
		animation: scroll 10s linear infinite;
	}

	.headline {
		display: inline-block;
		font-size: 1.2rem;
		font-weight: bold;
		text-transform: uppercase;
	}

	.headline::after {
		content: '•';
		margin-left: 3rem;
		color: #ff0000;
	}

	@keyframes scroll {
		0% {
			transform: translateX(0);
		}
		100% {
			transform: translateX(-50%);
		}
	}

	/* Pause animation on hover */
	.marquee-container:hover .marquee-content {
		animation-play-state: paused;
	}
</style>
