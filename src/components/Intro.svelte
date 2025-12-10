<script lang="ts">
	import DialogueScreen from './DialogueScreen.svelte';

	interface Props {
		onComplete: () => void;
	}

	let { onComplete }: Props = $props();

	const dialogues = [
		"Hi! I'm Brandon Gill, a United States representative from Texas. You may know me from my proposed bills to put Donald Trump on the $100 bill and my petitions to deport Ilhan Omar and Zohran Mamdani.",
		"I grew up with a rich Dad who lost his election to congress in 2004, and ever since then it's been my dream to cosplay as a poor Texas rancher while actually being an Ivy League educated millionaire investment banker.",
		"My only goal in life is to make 1 billion dollars, using public office to enrich myself and my friends regardless of the societal cost. Let's get started!"
	];
</script>

<DialogueScreen {dialogues} {onComplete} finalButtonText="Play Game" />
