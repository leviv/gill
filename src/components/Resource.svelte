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

	let showTooltip = $state(false);
	let longPressTimer: ReturnType<typeof setTimeout> | null = null;

	function handleClick() {
		if (canAfford) {
			onPurchase(cost);
		}
	}

	function handleTouchStart() {
		longPressTimer = setTimeout(() => {
			showTooltip = true;
		}, 500);
	}

	function handleTouchEnd() {
		if (longPressTimer) {
			clearTimeout(longPressTimer);
			longPressTimer = null;
		}
	}

	function dismissTooltip() {
		showTooltip = false;
	}
</script>

{#if showTooltip && tooltip}
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<div class="tooltip-overlay" ontouchstart={dismissTooltip} onclick={dismissTooltip}></div>
{/if}

<div
	class="resource-container"
	ontouchstart={handleTouchStart}
	ontouchend={handleTouchEnd}
	ontouchmove={handleTouchEnd}
	role="group"
>
	<ActionButton onclick={handleClick} disabled={!canAfford}>
		{title} (Cost: {cost.toLocaleString()})
	</ActionButton>
	{#if tooltip}
		<div class="tooltip" class:show={showTooltip}>{tooltip}</div>
	{/if}
</div>

<style>
	.resource-container {
		position: relative;
		display: inline-block;
		width: 100%;
		pointer-events: auto;
	}

	.tooltip-overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 999;
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
		white-space: normal;
		z-index: 1000;
		pointer-events: none;
		opacity: 0;
		transition: opacity 0.3s ease;
		max-width: 250px;
		text-align: center;
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

	/* Hover for non-touch devices */
	@media (hover: hover) {
		.resource-container:hover .tooltip {
			visibility: visible;
			opacity: 1;
		}
	}

	/* Long-press triggered tooltip (touch devices) */
	.tooltip.show {
		visibility: visible;
		opacity: 1;
	}
</style>
