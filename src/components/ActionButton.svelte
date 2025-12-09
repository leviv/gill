<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		onclick: () => void;
		disabled?: boolean;
		class?: string;
		children: Snippet;
	}

	let { onclick, disabled = false, class: className = '', children }: Props = $props();
</script>

<button {onclick} {disabled} class="action-button {className}">
	{@render children()}
</button>

<style>
	.action-button {
		background: rgb(170, 141, 48);
		color: white;
		border: none;
		padding: 12px 32px;
		font-size: 18px;
		font-weight: bold;
		border-radius: 4px;
		text-transform: uppercase;
		cursor: pointer;
		transition: all 0.3s ease;
		box-shadow: 0 4px 15px rgba(170, 141, 48, 0.4);
		font-family: Poppins, Arial, Helvetica, sans-serif;
		width: 100%;
	}

	.action-button:hover:not(:disabled) {
		transform: translateY(-2px);
		box-shadow: 0 6px 20px rgb(170, 141, 48);
	}

	.action-button:active:not(:disabled) {
		transform: translateY(0);
	}

	.action-button:disabled {
		background-color: #cccccc;
		color: #666666;
		cursor: not-allowed;
		opacity: 0.6;
		box-shadow: none;
	}

	.action-button:not(:disabled) {
		animation: pulse 2s infinite;
	}

	@keyframes pulse {
		0%,
		100% {
			box-shadow: 0 0 0 0 rgba(170, 141, 48, 0.7);
		}
		50% {
			box-shadow: 0 0 0 10px rgba(170, 141, 48, 0);
		}
	}
</style>
