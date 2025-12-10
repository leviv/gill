<script lang="ts">
	import DialogueScreen from './DialogueScreen.svelte';

	interface Props {
		onComplete: () => void;
	}

	let { onComplete }: Props = $props();

	const dialogues = [
		'Even though I have riches and power beyond what most people could imagine, as well as a lovely wife and kids, something within me still feels hollow...',
		"Retirement just doesn't seem as fun as scapegoating minorities and doing anything for a crumb of attention or another zero on my bank account.",
		"I think I'll continue exactly what I've been doing - maybe I'll run for president next! Thanks for playing."
	];
</script>

<DialogueScreen {dialogues} {onComplete} finalButtonText="Finish" />
