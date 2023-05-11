<script lang="ts">
	import { onMount } from 'svelte'
	import missingimg from '$lib/assets/missingimg.jpg'
	import { fade } from 'svelte/transition';
	export let src : string;
    export let imgclass : string;
    export let draggable : boolean;


	let loaded = false;
	let failed = false;
	let loading = false;

	onMount(() => {
			const img = new Image();
			img.src = src;
			loading = true;

			img.onload = () => {
					loading = false;
					loaded = true;
			};
			img.onerror = () => {
					loading = false;
					failed = true;
			};
	})
</script>
{#if loaded}
	<img {src} alt="Document" class={imgclass} draggable="{draggable}" in:fade={{duration : 200}}/>
{:else if failed}
	<img src={missingimg} alt="missing" in:fade={{duration : 200}} class={imgclass} draggable={draggable}>
{:else if loading}
	<img src={missingimg} alt="missing" in:fade={{duration : 200}} class={imgclass} draggable={draggable}>
{/if}