<script lang="ts">
	import Resource from './Resource.svelte';

	interface Props {
		money: number;
		currentMultiplier: number;
		autoClickers: number;
		lobbyists: number;
		hasStartedNewsCompany: boolean;
		onMoneyChange: (amount: number) => void;
		onMultiplierChange: (amount: number) => void;
		onAutoClickersChange: (amount: number) => void;
		onLobbyistsChange: (amount: number) => void;
		onAddEmoji: (type: 'intern' | 'lobbyist') => void;
		onStartNewsCompany: () => void;
		onHireIntern: () => void;
		onHireCampaignManager: () => void;
		onHireCorporateFundraiser: () => void;
	}

	let {
		money,
		currentMultiplier,
		autoClickers,
		lobbyists,
		hasStartedNewsCompany,
		onMoneyChange,
		onMultiplierChange,
		onAutoClickersChange,
		onLobbyistsChange,
		onAddEmoji,
		onStartNewsCompany,
		onHireIntern,
		onHireCampaignManager,
		onHireCorporateFundraiser
	}: Props = $props();

	// Track purchase counts for each resource
	let internCount = $state(0);
	let campaignManagerCount = $state(0);
	let corporateFundraiserCount = $state(0);

	// Base costs
	const baseCosts = {
		newsCompany: 10000,
		intern: 20,
		campaignManager: 100,
		corporateFundraiser: 500
	};

	function buyNewsCompany(cost: number) {
		onMoneyChange(-cost);
		onStartNewsCompany();
	}

	function buyIntern(cost: number) {
		onMoneyChange(-cost);
		onHireIntern();
		internCount++;
	}

	function buyCampaignManager(cost: number) {
		onMoneyChange(-cost);
		onHireCampaignManager();
		campaignManagerCount++;
	}

	function buyCorporateFundraiser(cost: number) {
		onMoneyChange(-cost);
		onHireCorporateFundraiser();
		corporateFundraiserCount++;
	}
</script>

<div class="resources">
	{#if !hasStartedNewsCompany}
		<Resource
			title="Start an online 'news' company"
			baseCost={baseCosts.newsCompany}
			purchaseCount={0}
			currentMoney={money}
			onPurchase={buyNewsCompany}
			tooltip="Unlock the rest of the game"
		/>
	{:else}
		<Resource
			title="Hire intern"
			baseCost={baseCosts.intern}
			purchaseCount={internCount}
			currentMoney={money}
			onPurchase={buyIntern}
			tooltip="Generates $10/sec and writes headlines"
		/>

		<Resource
			title="Hire campaign manager"
			baseCost={baseCosts.campaignManager}
			purchaseCount={campaignManagerCount}
			currentMoney={money}
			onPurchase={buyCampaignManager}
			tooltip="Generates individual donations each second"
		/>

		<Resource
			title="Hire corporate fundraiser"
			baseCost={baseCosts.corporateFundraiser}
			purchaseCount={corporateFundraiserCount}
			currentMoney={money}
			onPurchase={buyCorporateFundraiser}
			tooltip="Generates corporate donations each second"
		/>
	{/if}
</div>

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
