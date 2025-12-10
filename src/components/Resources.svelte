<script lang="ts">
	import Resource from './Resource.svelte';

	interface Props {
		money: number;
		hasStartedNewsCompany: boolean;
		onMoneyChange: (amount: number) => void;
		onStartNewsCompany: () => void;
		onHireIntern: () => void;
		onHireCampaignManager: () => void;
		onHireCorporateFundraiser: () => void;
		onBuyFacebookAds: () => void;
		onBecomeStateRep: () => void;
		onBuyInsiderTrade: () => void;
		onRetire: () => void;
	}

	let {
		money,
		hasStartedNewsCompany,
		onMoneyChange,
		onStartNewsCompany,
		onHireIntern,
		onHireCampaignManager,
		onHireCorporateFundraiser,
		onBuyFacebookAds,
		onBecomeStateRep,
		onBuyInsiderTrade,
		onRetire
	}: Props = $props();

	// Track purchase counts for each resource
	let internCount = $state(0);
	let campaignManagerCount = $state(0);
	let corporateFundraiserCount = $state(0);
	let facebookAdsCount = $state(0);
	let hasStateRep = $state(false);
	let insiderTradeCount = $state(0);

	// Base costs
	const baseCosts = {
		newsCompany: 10000,
		intern: 20,
		campaignManager: 100,
		corporateFundraiser: 500,
		facebookAds: 50,
		stateRep: 100000,
		insiderTrade: 50000
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

	function buyFacebookAds(cost: number) {
		onMoneyChange(-cost);
		onBuyFacebookAds();
		facebookAdsCount++;
	}

	function becomeStateRep(cost: number) {
		onMoneyChange(-cost);
		onBecomeStateRep();
		hasStateRep = true;
	}

	function buyInsiderTrade(cost: number) {
		onMoneyChange(-cost);
		onBuyInsiderTrade();
		insiderTradeCount++;
	}

	function retire() {
		onRetire();
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
			tooltip="Hire a UT Austin C-student to write a clickbait article every 10 seconds. Each article generates $10 and was a real headline published by the DC Enquirer."
		/>

		<Resource
			title="Hire campaign manager"
			baseCost={baseCosts.campaignManager}
			purchaseCount={campaignManagerCount}
			currentMoney={money}
			onPurchase={buyCampaignManager}
			tooltip="Hire someone to solicit money from friends, families and bigots every 10 seconds. Each donation a real-life campaign contribution."
		/>

		<Resource
			title="Hire corporate fundraiser"
			baseCost={baseCosts.corporateFundraiser}
			purchaseCount={corporateFundraiserCount}
			currentMoney={money}
			onPurchase={buyCorporateFundraiser}
			tooltip="Hire someone to solicit corporate and PAC donations every 10 seconds. Each donation is a real life campaign contribution."
		/>

		<Resource
			title="Buy Facebook ads"
			baseCost={baseCosts.facebookAds}
			purchaseCount={facebookAdsCount}
			currentMoney={money}
			onPurchase={buyFacebookAds}
			tooltip="Boost the reach of your 'news' articles to get more eyeballs and clicks."
		/>

		{#if !hasStateRep}
			<Resource
				title="Become a state representative"
				baseCost={baseCosts.stateRep}
				purchaseCount={0}
				currentMoney={money}
				onPurchase={becomeStateRep}
				tooltip="One-time purchase: Increases all actions effectiveness by 500x"
			/>
		{/if}

		{#if hasStateRep}
			<Resource
				title="Insider trade"
				baseCost={baseCosts.insiderTrade}
				purchaseCount={insiderTradeCount}
				currentMoney={money}
				onPurchase={buyInsiderTrade}
				tooltip="Illegally use your insider knowledge to trade stocks and crypto every 10 seconds. Each trade generates $1,000,000"
			/>
		{/if}

		{#if money >= 1000000000}
			<Resource
				title="Retire with your billion-dollar fortune"
				baseCost={0}
				purchaseCount={0}
				currentMoney={money}
				onPurchase={retire}
				tooltip="You've won! Time to retire and your wealth, wife and two kids."
			/>
		{/if}
	{/if}
</div>

<style>
	.resources {
		display: flex;
		flex-direction: column;
		gap: 10px;
		margin-top: 20px;
	}
</style>
