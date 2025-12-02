<script lang="ts">
	import Marquee from '../components/Marquee.svelte';
	import Button from '../components/Button.svelte';
	import Resource from '../components/Resource.svelte';
	import { onMount } from 'svelte';

	let money = $state(10000);
	let currentMultiplier = $state(1);
	let eagleSound: HTMLAudioElement;
	let autoClickers = $state(0); // Interns
	let lobbyists = $state(0);

	// Track last hundred for eagle sound
	let lastHundred = $state(0);

	// Reactive effect to play eagle sound when crossing 100 multiples
	$effect(() => {
		const currentHundred = Math.floor(money / 100);
		if (currentHundred > lastHundred && eagleSound) {
			lastHundred = currentHundred;
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

		// Auto increment from interns (1 per second)
		const internInterval = setInterval(() => {
			if (autoClickers > 0) {
				for (let i = 0; i < autoClickers; i++) {
					incrementMoney(1);
				}
			}
		}, 1000);

		// Auto increment from lobbyists (10 per second)
		const lobbyistInterval = setInterval(() => {
			if (lobbyists > 0) {
				for (let i = 0; i < lobbyists * 10; i++) {
					incrementMoney(1);
				}
			}
		}, 1000);

		return () => {
			clearInterval(internInterval);
			clearInterval(lobbyistInterval);
		};
	});

	function incrementMoney(amount: number) {
		money += amount;
	}

	function handleClick() {
		incrementMoney(currentMultiplier);
	}

	function buyFacebookAd() {
		money -= 100;
		currentMultiplier += 1;
	}

	function buyIntern() {
		money -= 1000;
		autoClickers += 1;
		addBackgroundEmoji(internEmojis);
	}

	function buyLobbyist() {
		money -= 10000;
		lobbyists += 1;
		addBackgroundEmoji(lobbyistEmojis);
	}
</script>

<Marquee {money} />

<!-- Background emojis -->
<div class="background-emojis">
	{#each backgroundEmojis as bgEmoji}
		<div class="emoji" style="left: {bgEmoji.x}px; top: {bgEmoji.y}px;">
			{bgEmoji.emoji}
		</div>
	{/each}
</div>

<div class="container">
	<p>Money: {money}</p>
	<p>Multiplier: {currentMultiplier}</p>

	<Button onclick={handleClick} />

	<div class="resources">
		<Resource title="Buy Facebook ad" cost={100} currentMoney={money} onPurchase={buyFacebookAd} />

		<Resource title="Buy intern" cost={1000} currentMoney={money} onPurchase={buyIntern} />

		<Resource title="Court lobbyist" cost={10000} currentMoney={money} onPurchase={buyLobbyist} />
	</div>

	{#if autoClickers > 0}
		<p>Interns: {autoClickers}</p>
	{/if}

	{#if lobbyists > 0}
		<p>Lobbyists: {lobbyists}</p>
	{/if}
</div>

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

	.resources {
		display: flex;
		flex-direction: column;
		gap: 10px;
		margin-top: 20px;
	}

	.background-emojis {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
		z-index: 1;
	}

	.emoji {
		position: absolute;
		font-size: 40px;
		user-select: none;
	}
</style>
