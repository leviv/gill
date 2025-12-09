<script lang="ts">
	import { onMount } from 'svelte';
	import MoneyPopup from './MoneyPopup.svelte';

	interface Props {
		ticker: string;
		profit: number;
		x: number;
		y: number;
	}

	let { ticker, profit, x, y }: Props = $props();

	let opacity = $state(1);
	let showMoneyPopup = $state(true);

	onMount(() => {
		// Fade out after 5 seconds
		setTimeout(() => {
			opacity = 0.5;
		}, 5000);

		// Remove money popup after animation
		setTimeout(() => {
			showMoneyPopup = false;
		}, 800);
	});
</script>

<div class="stock-ticker" style="left: {x}px; top: {y}px; opacity: {opacity}">
	<div class="ticker-header">
		<span class="ticker-symbol">{ticker}</span>
		<span class="ticker-profit">+${profit.toLocaleString()}</span>
	</div>
	<div class="ticker-status">TRADE EXECUTED</div>

	{#if showMoneyPopup}
		<MoneyPopup amount={profit} x={100} y={30} duration={0.8} distance={50} />
	{/if}
</div>

<style>
	.stock-ticker {
		position: absolute;
		background: linear-gradient(135deg, #1a472a 0%, #2d5a3d 100%);
		border: 3px solid #4caf50;
		border-radius: 8px;
		padding: 15px 20px;
		font-family: 'Courier New', monospace;
		color: #4caf50;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
		transition: opacity 0.5s;
		z-index: 5;
		min-width: 200px;
	}

	.ticker-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 8px;
	}

	.ticker-symbol {
		font-size: 20px;
		font-weight: bold;
		letter-spacing: 2px;
	}

	.ticker-profit {
		font-size: 18px;
		font-weight: bold;
		color: #66ff66;
	}

	.ticker-status {
		font-size: 12px;
		text-align: center;
		opacity: 0.8;
		border-top: 1px solid #4caf50;
		padding-top: 6px;
	}
</style>
