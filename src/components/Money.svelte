<script lang="ts">
	export let money: number;
</script>

<div class="container">
	<img src="/dollar.gif" alt="spinning dollar" />
	<div class="money-amount">{Math.round(money).toLocaleString('en-US')} Dollars</div>
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
		background-color: rgb(143, 213, 143);
		padding: 4px 8px;
	}
</style>
