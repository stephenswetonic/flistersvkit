<script>
	export let showCard; // boolean
    export let poster_path;
    export let id;
    import {PUBLIC_TMDB_KEY} from '$env/static/public';
    import Image from './Image.svelte';
    import StreamCard from './StreamCard.svelte';
    import { onMount } from "svelte";

    let movieData = {};
    let movieCredits = {cast : [], crew : []};
    let director = [];
    let producers = [];
    let editors = [];
    let musicComposers = [];
    let genres = [];
	let dialog; // HTMLDialogElement

    let tabs = [
		"Genres",
		"Crew",
	]
	let activeTab = 1
	$: if (dialog && showCard) dialog.showModal();

    onMount(async () => {
        const url = "https://api.themoviedb.org/3/movie/" + id + "?api_key=" + PUBLIC_TMDB_KEY;
        const response = await fetch(url);
        const data = await response.json();

        const creditsURL = "https://api.themoviedb.org/3/movie/" + id + "/credits" + "?api_key=" + PUBLIC_TMDB_KEY;
        const creditsReponse = await fetch(creditsURL);
        const creditsData = await creditsReponse.json();

        movieData = data;
        movieCredits = creditsData;

        const crewJobs = groupBy(movieCredits.crew, 'job');
        director = crewJobs.Director;
        producers = crewJobs.Producer;
        editors = crewJobs.Editor;
        musicComposers = crewJobs['Original Music Composer'];
        genres = movieData.genres;

        // console.log(movieData);
        // console.log(movieCredits)

    })

    function getLongDate(date) {
        const d = new Date(date);
        return d.toLocaleDateString();
    }

    function getLocaleString(count) {
        const n = new Number(count);
        return n.toLocaleString();
    }

    // Parameter d in minutes
    function secondsToHms(d) {
        d = Number(d*60);
        var h = Math.floor(d / 3600);
        var m = Math.floor(d % 3600 / 60);
        var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
        var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes") : "";
        return hDisplay + mDisplay;
    }

    const groupBy = (array, key) => {
        // Return the end result
        return array.reduce((result, currentValue) => {
            // If an array already present for key, push it to the array. Else create an array and push the object
            (result[currentValue[key]] = result[currentValue[key]] || []).push(
            currentValue
            );
            // Return the current iteration `result` value, this will be taken as next iteration `result` value and accumulate
            return result;
        }, {}); // empty object is the initial value for result object
    };



</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<dialog
	bind:this={dialog}
	on:close={() => (showCard = false)}
	on:click|self={() => dialog.close()}
    class="w-5/6 bg-base-100 rounded-lg"
    
>
	<div on:click|stopPropagation class="h-[90vh]">
        <div class="flex">
            <div class="w-1/3">
                <Image src={poster_path} imgclass='w-full rounded-lg object-cover object-center' draggable={false}/>
                <div class="stats shadow overflow-visible block">
                    <div class="stat">
                        <div class="stat-figure text-secondary">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-8 h-8 stroke-current"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        </div>
                        <div class="stat-title">User Score</div>
                        <div class="stat-value">{Math.floor(movieData.vote_average * 10)}%</div>
                    </div>
                    
                    <div class="stat">
                        <div class="stat-figure text-secondary">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-8 h-8 stroke-current"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
                        </div>
                        <div class="stat-title">Vote Count</div>
                        <div class="stat-value">{getLocaleString(movieData.vote_count)}</div>
                    </div>
                </div>
            </div>
 
            
            <div class="w-2/3 ml-6">
                <h1 class="my-2 text-3xl font-bold tracking-light text-base-content mb-6">{movieData.original_title}</h1>
                <hr>
                <p class="text-base-content mb-2">{movieData.overview}</p>
                <p class="text-base-content font-medium">Release Date: <span class="font-light">{getLongDate(movieData.release_date)}</span></p>
                <p class="text-base-content font-medium mb-2">Runtime: <span class="font-light">{secondsToHms(movieData.runtime)}</span></p>

                <div class="tabs">
                    {#each tabs as tab, index}
                      <button class="tab tab-bordered text-base-content text-xl w-1/2" class:tab-active={activeTab == index} on:click={()=>activeTab = index}>{tab}</button>
                    {/each}
                </div>
                <div class="card" class:hidden={activeTab != 0}>
                    {#each genres as genre}
                        <p class="text-base-content font-medium tracking-wide my-2">{genre.name}</p>
                    {/each}
                </div>
                <div class="card" class:hidden={activeTab != 1}>
                    <p class="text-base-content font-medium tracking-wide my-2">Director</p>
                    {#each director as dir}
                        <p class="font-light">{dir.name}</p>
                    {/each}
                    <p class="text-base-content font-medium tracking-wide my-2">Producers</p>
                    {#each producers as producer}
                        <p class="font-light">{producer.name}</p>
                    {/each}
                    <p class="text-base-content font-medium tracking-wide my-2">Editors</p>
                    {#each editors as editor}
                        <p class="font-light">{editor.name}</p>
                    {/each}
                    <p class="text-base-content font-medium tracking-wide my-2">Music Composers</p>
                    {#each musicComposers as composer}
                        <p class="font-light">{composer.name}</p>
                    {/each}
                </div>

                <div class="mt-2">
                <StreamCard {id}/>
                </div>
                
            </div>

        </div>
        



    </div>
    

    <!-- <button autofocus on:click={() => dialog.close()}>close modal</button> -->
</dialog>

<style>
	dialog::backdrop {
		background: rgba(0, 0, 0, 0.3);
	}
	dialog > div {
		padding: 1em;
	}
	dialog[open] {
		animation: zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
	}
	@keyframes zoom {
		from {
			transform: scale(0.8);
		}
		to {
			transform: scale(1);
		}
	}
	dialog[open]::backdrop {
		animation: fade 0.2s ease-out;
	}
	@keyframes fade {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
	button {
		display: block;
	}
</style>
