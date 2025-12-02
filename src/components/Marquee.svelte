<script lang="ts">
	import { onMount } from 'svelte';
	import headlines from '$lib/dcenquirer_headlines.json';

	interface Props {
		money: number;
	}

	let { money }: Props = $props();

	const HEADLINES_COUNT = 10;

	let displayedHeadlines = $state<string[]>([]);
	let headlineIndex = $state(0);

	// Calculate animation duration based on money
	// Start at 20s, decrease as money increases, min 2s
	const animationDuration = $derived(Math.max(2, 20 - money / 1000));

	function getNextHeadline(): string {
		const headline = headlines[headlineIndex % headlines.length];
		headlineIndex++;
		return headline;
	}

	onMount(() => {
		// Initialize with 10 headlines
		for (let i = 0; i < HEADLINES_COUNT; i++) {
			displayedHeadlines.push(getNextHeadline());
		}
		displayedHeadlines = [...displayedHeadlines];
	});

	function handleAnimationIteration() {
		// Remove the first headline and add a new one at the end
		displayedHeadlines.shift();
		displayedHeadlines.push(getNextHeadline());
		displayedHeadlines = [...displayedHeadlines];
	}
</script>

<div class="marquee-container">
	<div
		class="marquee-content"
		onanimationiteration={handleAnimationIteration}
		style="animation-duration: {animationDuration}s;"
	>
		{#each displayedHeadlines as headline, i (i + headlineIndex)}
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
		gap: 10px;
		white-space: nowrap;
		animation: scroll linear infinite;
	}

	.headline {
		display: inline-block;
		font-size: 1.2rem;
		font-weight: bold;
		text-transform: uppercase;
	}

	.headline::after {
		content: '🚨';
		margin-left: 10px;
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
