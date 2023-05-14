<script lang="ts">
    export let id;
    let watchProvidersUS = {rent : [], buy : [], flatrate : []};
    import {PUBLIC_TMDB_KEY} from '$env/static/public';
    import { onMount } from "svelte";

    onMount(async () => {
        const watchUrl = "https://api.themoviedb.org/3/movie/" + id + "/watch/providers" + "?api_key=" + PUBLIC_TMDB_KEY;
        const watchResponse = await fetch(watchUrl);
        const watchData = await watchResponse.json();
        watchProvidersUS = watchData.results.US;

        console.log(watchProvidersUS);
    })
</script>

<div class="stat shadow-lg xl:max-w-lg lg:max-w-md md:max-w-sm sm:max-w-xs bg-base-200 rounded-lg">
    <h1 class="text-base-content font-medium text-3xl pb-4">Streaming</h1>

    {#if watchProvidersUS.rent}
        <h3 class="text-primary font-medium text-xl">Rent</h3>
        <div class="flex">
            {#each watchProvidersUS.rent as provider}
                <div class="tooltip p-1" data-tip={provider.provider_name}>
                    <img src={`https://image.tmdb.org/t/p/original${provider.logo_path}?api_key=${PUBLIC_TMDB_KEY}`} alt="logo" class="w-full h-auto max-h-12 rounded object-cover">
                </div>
            {/each}
        </div>
    {/if}

    {#if watchProvidersUS.buy}
        <h3 class="text-primary font-medium text-xl">Buy</h3>
        <div class="flex">
            {#each watchProvidersUS.buy as provider}
                <div class="tooltip p-1" data-tip={provider.provider_name}>
                    <img src={`https://image.tmdb.org/t/p/original${provider.logo_path}?api_key=${PUBLIC_TMDB_KEY}`} alt="logo" class="w-full h-auto max-h-12 rounded object-cover">
                </div>
            {/each}
        </div>
    {/if}

    {#if watchProvidersUS.flatrate}
        <h3 class="text-primary font-medium text-xl">Subscription</h3>
        <div class="flex">
            {#each watchProvidersUS.flatrate as provider}
                <div class="tooltip p-1" data-tip={provider.provider_name}>
                    <img src={`https://image.tmdb.org/t/p/original${provider.logo_path}?api_key=${PUBLIC_TMDB_KEY}`} alt="logo" class="w-full h-auto max-h-12 rounded object-cover">
                </div>
            {/each}
        </div>
    {/if}
</div>