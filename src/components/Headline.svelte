<script lang="ts">
	interface Props {
		text: string;
		x: number;
		y: number;
	}

	let { text, x, y }: Props = $props();

	let opacity = $state(1);

	// Start fading after 5 seconds
	setTimeout(() => {
		opacity = 0.5;
	}, 5000);
</script>

<div class="headline" style="left: {x}px; top: {y}px; opacity: {opacity}">
	<div class="newspaper">
		<div class="masthead">DC ENQUIRER</div>
		<div class="headline-text">{text}</div>
	</div>
</div>

<style>
	.headline {
		position: fixed;
		z-index: 5;
		pointer-events: none;
		transition: opacity 1s ease-out;
	}

	.newspaper {
		background: linear-gradient(to bottom, #f8f8f8 0%, #e8e8e8 100%);
		border: 2px solid #333;
		border-radius: 4px;
		padding: 12px;
		width: 250px;
		box-shadow: 3px 3px 8px rgba(0, 0, 0, 0.3);
		font-family: 'Georgia', serif;
	}

	.masthead {
		font-size: 14px;
		font-weight: bold;
		text-align: center;
		border-bottom: 3px double #333;
		padding-bottom: 4px;
		margin-bottom: 8px;
		letter-spacing: 2px;
	}

	.headline-text {
		font-size: 11px;
		line-height: 1.4;
		color: #222;
		font-weight: bold;
		text-transform: capitalize;
	}
</style>
