<script lang="ts">
	import ActionButton from './ActionButton.svelte';

	interface Props {
		title: string;
		baseCost: number;
		purchaseCount: number;
		currentMoney: number;
		onPurchase: (cost: number) => void;
		tooltip?: string;
	}

	let { title, baseCost, purchaseCount, currentMoney, onPurchase, tooltip }: Props = $props();

	// Calculate current cost (50% increase per purchase, rounded up)
	const cost = $derived(Math.ceil(baseCost * Math.pow(1.5, purchaseCount)));

	const canAfford = $derived(currentMoney >= cost);

	function handleClick() {
		if (canAfford) {
			onPurchase(cost);
		}
	}
</script>

<div class="resource-container">
	<ActionButton onclick={handleClick} disabled={!canAfford}>
		{title} (Cost: {cost.toLocaleString()})
	</ActionButton>
	{#if tooltip}
		<div class="tooltip">{tooltip}</div>
	{/if}
</div>

<style>
	.resource-container {
		position: relative;
		display: inline-block;
		width: 100%;
		pointer-events: auto;
	}

	.tooltip {
		visibility: hidden;
		position: absolute;
		bottom: 100%;
		left: 50%;
		transform: translateX(-50%);
		margin-bottom: 8px;
		padding: 8px 12px;
		background-color: rgba(0, 0, 0, 0.9);
		color: white;
		font-size: 14px;
		border-radius: 6px;
		white-space: nowrap;
		z-index: 1000;
		pointer-events: none;
		opacity: 0;
		transition: opacity 0.3s ease;
	}

	.tooltip::after {
		content: '';
		position: absolute;
		top: 100%;
		left: 50%;
		transform: translateX(-50%);
		border: 5px solid transparent;
		border-top-color: rgba(0, 0, 0, 0.9);
	}

	.resource-container:hover .tooltip {
		visibility: visible;
		opacity: 1;
	}
</style>
