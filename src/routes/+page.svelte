<script lang="ts">
	let money = 0;
	let currentMultiplier = 1;

	function handleClick() {
		money += currentMultiplier;
	}

	function increaseMultiplier() {
		currentMultiplier += 1;
	}
</script>

<div class="container">
	<p>Money: {money}</p>

	<button on:click={handleClick}> Click me! </button>

	<button on:click={increaseMultiplier}>
		Increase Multiplier (Current: {currentMultiplier})
	</button>
</div>

<style>
	.container {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 20px;
		margin-top: 20px;
	}
</style>
