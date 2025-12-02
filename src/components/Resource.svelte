<script lang="ts">
	interface Props {
		title: string;
		cost: number;
		currentMoney: number;
		onPurchase: () => void;
	}

	let { title, cost, currentMoney, onPurchase }: Props = $props();

	const canAfford = $derived(currentMoney >= cost);

	function handleClick() {
		if (canAfford) {
			onPurchase();
		}
	}
</script>

<button onclick={handleClick} disabled={!canAfford} class:affordable={canAfford}>
	{title} (Cost: {cost})
</button>

<style>
	button {
		padding: 10px 20px;
		font-size: 16px;
		cursor: pointer;
		background-color: #4caf50;
		color: white;
		border: 2px solid #45a049;
		border-radius: 5px;
		transition: all 0.3s ease;
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
</style>
