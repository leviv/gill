<script lang="ts">
	interface Props {
		amount: number;
		x: number;
		y: number;
		duration?: number;
		distance?: number;
	}

	let { amount, x, y, duration = 300, distance = 10 }: Props = $props();
</script>

<div
	class="money-popup"
	style="left: {x}px; top: {y}px; --duration: {duration}ms; --distance: {distance}px;"
>
	${amount.toLocaleString()}
</div>

<style>
	.money-popup {
		position: absolute;
		font-family: 'Arial', sans-serif;
		font-size: 24px;
		font-weight: bold;
		color: #2ecc40;
		text-shadow:
			-1px -1px 0 #000,
			1px -1px 0 #000,
			-1px 1px 0 #000,
			1px 1px 0 #000;
		animation: moneyDrift var(--duration) ease-out forwards;
		transform: translate(-50%, -50%);
		pointer-events: none;
		z-index: 100;
	}

	@keyframes moneyDrift {
		0% {
			opacity: 1;
			transform: translate(-50%, -50%) translateY(0px);
		}
		100% {
			opacity: 0;
			transform: translate(-50%, -50%) translateY(calc(-1 * var(--distance)));
		}
	}
</style>
