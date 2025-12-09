<script lang="ts">
	import MoneyPopup from './MoneyPopup.svelte';

	interface Props {
		contributorName: string;
		amount: number;
		isCorporate: boolean;
		fecUrl?: string;
		x: number;
		y: number;
	}

	let { contributorName, amount, isCorporate, fecUrl, x, y }: Props = $props();

	let opacity = $state(1);
	let showMoneyPopup = $state(true);

	// Start fading after 5 seconds
	setTimeout(() => {
		opacity = 0.5;
	}, 5000);

	// Remove money popup after animation
	setTimeout(() => {
		showMoneyPopup = false;
	}, 800);
</script>

{#if fecUrl}
	<a
		href={fecUrl}
		target="_blank"
		rel="noopener noreferrer"
		class="donation-slip clickable"
		style="left: {x}px; top: {y}px; opacity: {opacity}"
	>
		<div class="slip-content">
			<div class="slip-header">{isCorporate ? 'CORPORATE' : 'INDIVIDUAL'} DONATION</div>
			<div class="donor-name">{contributorName}</div>
			<div class="amount">${Math.abs(amount).toFixed(2)}</div>
			<div class="fec-link">View on FEC →</div>
		</div>
		{#if showMoneyPopup}
			<MoneyPopup amount={Math.abs(amount)} x={120} y={75} duration={800} distance={50} />
		{/if}
	</a>
{:else}
	<div class="donation-slip" style="left: {x}px; top: {y}px; opacity: {opacity}">
		<div class="slip-content">
			<div class="slip-header">{isCorporate ? 'CORPORATE' : 'INDIVIDUAL'} DONATION</div>
			<div class="donor-name">{contributorName}</div>
			<div class="amount">${Math.abs(amount).toFixed(2)}</div>
		</div>
		{#if showMoneyPopup}
			<MoneyPopup amount={Math.abs(amount)} x={120} y={75} duration={800} distance={50} />
		{/if}
	</div>
{/if}

<style>
	.donation-slip {
		position: fixed;
		z-index: 10;
		transition: opacity 1s ease-out;
		text-decoration: none;
		display: block;
	}

	.donation-slip.clickable {
		pointer-events: auto;
		cursor: pointer;
	}

	.donation-slip:not(.clickable) {
		pointer-events: none;
	}

	.slip-content {
		background: linear-gradient(135deg, #fff9e6 0%, #ffe6b3 100%);
		border: 2px dashed #d4af37;
		border-radius: 6px;
		padding: 12px 16px;
		width: 220px;
		box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.2);
		font-family: Calibri, sans-serif;
	}

	.clickable .slip-content:hover {
		transform: scale(1.05);
		box-shadow: 3px 3px 10px rgba(0, 0, 0, 0.3);
		transition: all 0.2s;
	}

	.slip-header {
		font-size: 10px;
		font-weight: bold;
		color: #666;
		border-bottom: 1px solid #d4af37;
		padding-bottom: 4px;
		margin-bottom: 8px;
		letter-spacing: 1px;
		font-family: Poppins, Arial, Helvetica, sans-serif;
	}

	.donor-name {
		font-size: 13px;
		font-weight: bold;
		color: #2c3e50;
		margin-bottom: 8px;
		text-transform: capitalize;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.amount {
		font-size: 18px;
		font-weight: bold;
		color: #27ae60;
		text-align: right;
		font-family: Poppins, Arial, Helvetica, sans-serif;
	}

	.fec-link {
		font-size: 9px;
		color: #3498db;
		text-align: right;
		margin-top: 4px;
		font-style: italic;
	}
</style>
