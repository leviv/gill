<script lang="ts">
	export let money: number;
</script>

<div class="container">
	<img src="/dollar.gif" alt="spinning dollar" />
	<div class="money-amount">{money} Dollars</div>
	<img src="/dollar.gif" alt="spinning dollar" />
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
	}
</style>
