<script lang="ts">
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
	<button onclick={handleClick} disabled={!canAfford} class:affordable={canAfford}>
		{title} (Cost: {cost.toLocaleString()})
	</button>
	{#if tooltip}
		<div class="tooltip">{tooltip}</div>
	{/if}
</div>

<style>
	.resource-container {
		position: relative;
		display: inline-block;
		width: 100%;
	}

	button {
		padding: 10px 20px;
		font-size: 16px;
		cursor: pointer;
		background-color: #4caf50;
		color: white;
		border: 2px solid #45a049;
		border-radius: 5px;
		transition: all 0.3s ease;
		width: 100%;
	}

	button:hover:not(:disabled) {
		background-color: #45a049;
		transform: scale(1.05);
	}

	button:disabled {
		background-color: #cccccc;
		color: #666666;
		border-color: #999999;
		cursor: not-allowed;
		opacity: 0.6;
	}

	button.affordable {
		animation: pulse 2s infinite;
	}

	@keyframes pulse {
		0%,
		100% {
			box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.7);
		}
		50% {
			box-shadow: 0 0 0 10px rgba(76, 175, 80, 0);
		}
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
