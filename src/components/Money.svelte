<script lang="ts">
	let { money }: { money: number } = $props();

	const GOAL = 1_000_000_000; // 1 billion
	const progressPercentage = $derived(Math.min((money / GOAL) * 100, 100));
</script>

<div class="container">
	<img src="dollar.gif" alt="spinning dollar" />
	<div class="money-amount">
		<div class="progress-bar" style="width: {progressPercentage}%"></div>
		<span class="money-text">{Math.round(money).toLocaleString('en-US')} Dollars</span>
	</div>
	<img src="dollar.gif" alt="spinning dollar" />
</div>

<style>
	.container {
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	img {
		height: 50px;
	}

	.money-amount {
		font-size: 24px;
		position: relative;
		overflow: hidden;
		padding: 4px 8px;
		font-family: Poppins, Arial, Helvetica, sans-serif;
		font-weight: 600;
		border: 2px solid rgb(100, 180, 100);
		border-radius: 4px;
		background-color: rgb(240, 255, 240);
	}

	.progress-bar {
		position: absolute;
		left: 0;
		top: 0;
		height: 100%;
		background: linear-gradient(90deg, rgb(143, 213, 143) 0%, rgb(100, 180, 100) 100%);
		transition: width 0.3s ease;
		z-index: 0;
	}

	.money-text {
		position: relative;
		z-index: 1;
		color: #1a5c1a;
		text-shadow: 0 0 2px rgba(255, 255, 255, 0.8);
	}
</style>
