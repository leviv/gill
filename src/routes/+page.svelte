<script lang="ts">
	import Marquee from '../components/Marquee.svelte';
	import Button from '../components/Button.svelte';
	import Resource from '../components/Resource.svelte';
	import { onMount } from 'svelte';

	let money = 10000;
	let currentMultiplier = 1;
	let eagleSound: HTMLAudioElement;
	let lastHundred = 0;
	let autoClickers = 0; // Interns
	let lobbyists = 0;

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

		// Check if we crossed a 100 multiple
		const currentHundred = Math.floor(money / 100);
		if (currentHundred > lastHundred) {
			lastHundred = currentHundred;
			eagleSound.currentTime = 0; // Reset to start
			eagleSound.play().catch((err) => console.log('Audio play failed:', err));
		}
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
	}

	function buyLobbyist() {
		money -= 10000;
		lobbyists += 1;
	}
</script>

<Marquee />

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
	}

	.resources {
		display: flex;
		flex-direction: column;
		gap: 10px;
		margin-top: 20px;
	}
</style>
