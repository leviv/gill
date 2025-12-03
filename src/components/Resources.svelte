<script lang="ts">
	import Resource from './Resource.svelte';

	interface Props {
		money: number;
		currentMultiplier: number;
		autoClickers: number;
		lobbyists: number;
		onMoneyChange: (amount: number) => void;
		onMultiplierChange: (amount: number) => void;
		onAutoClickersChange: (amount: number) => void;
		onLobbyistsChange: (amount: number) => void;
		onAddEmoji: (type: 'intern' | 'lobbyist') => void;
	}

	let {
		money,
		currentMultiplier,
		autoClickers,
		lobbyists,
		onMoneyChange,
		onMultiplierChange,
		onAutoClickersChange,
		onLobbyistsChange,
		onAddEmoji
	}: Props = $props();

	function buyFacebookAd() {
		onMoneyChange(-100);
		onMultiplierChange(1);
	}

	function buyInsiderTrade() {
		onMoneyChange(-2000);
		onMultiplierChange(5);
	}

	function buyIntern() {
		onMoneyChange(-1000);
		onAutoClickersChange(1);
		onAddEmoji('intern');
	}

	function buyLobbyist() {
		onMoneyChange(-10000);
		onLobbyistsChange(1);
		onAddEmoji('lobbyist');
	}
</script>

<div class="resources">
	<Resource title="Buy Facebook ad" cost={100} currentMoney={money} onPurchase={buyFacebookAd} />

	<Resource title="Insider trade" cost={2000} currentMoney={money} onPurchase={buyInsiderTrade} />

	<Resource title="Buy intern" cost={1000} currentMoney={money} onPurchase={buyIntern} />

	<Resource title="Court lobbyist" cost={10000} currentMoney={money} onPurchase={buyLobbyist} />
</div>

{#if autoClickers > 0}
	<p>Interns: {autoClickers}</p>
{/if}

{#if lobbyists > 0}
	<p>Lobbyists: {lobbyists}</p>
{/if}

<style>
	.resources {
		display: flex;
		flex-direction: column;
		gap: 10px;
		margin-top: 20px;
	}

	p {
		margin: 5px 0;
		font-weight: bold;
	}
</style>
