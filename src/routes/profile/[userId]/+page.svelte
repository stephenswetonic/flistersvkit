<script lang="ts">
    import { goto } from '$app/navigation';
    import { page } from '$app/stores';
    import { currentUser, pb } from '$lib/pocketbase';
    import type { PageData } from './$types';
    import { fade } from 'svelte/transition';
    import { Email, Reddit, Telegram, Tumblr, Facebook, Twitter } from 'svelte-share-buttons-component';

    export let data: PageData;
    const userId = $page.params.userId;
    let playlists = data.playlists;
    let linkCopiedAlert = false;

    const url = $page.url;
	const title = data.user.name + '\'s Flister Profile';

    function newPlaylist() {
        routeToPage((`${userId}/new`), false);
    };



    function selectPlaylist(playlist) {
        routeToPage((`${userId}/${playlist.id}`), false);
    }

    function routeToPage(route: string, replaceState: boolean) {
      goto(`/${route}`, { replaceState }) 
    }

    async function deletePlaylist(playlist) {
        console.log(playlist);
        let moviesInPlaylist = await pb.collection('movies').getFullList(50, { filter: `playlist="${playlist.id}"`});
        for (let i = 0; i < moviesInPlaylist.length; i++) {
            await pb.collection('movies').delete(moviesInPlaylist[i].id);
        }
        await pb.collection('playlists').delete(playlist.id);
        location.reload();
    }

    function signOut() {
        pb.authStore.clear();
    }

    function showLinkCopiedAlert() {
        linkCopiedAlert = true;
        setTimeout(hideLinkCopiedAlert, 3000);
        
    }

    function hideLinkCopiedAlert() {
        linkCopiedAlert = false;
    }

    //getPlaylists();
    console.log($currentUser);

</script>


<header class="text-gray-400 bg-gray-900 body-font border-b-2">
    <div class="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
        <a href="/" class="flex title-font font-medium items-center text-white mb-4 md:mb-0">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h1.5C5.496 19.5 6 18.996 6 18.375m-3.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-1.5A1.125 1.125 0 0118 18.375M20.625 4.5H3.375m17.25 0c.621 0 1.125.504 1.125 1.125M20.625 4.5h-1.5C18.504 4.5 18 5.004 18 5.625m3.75 0v1.5c0 .621-.504 1.125-1.125 1.125M3.375 4.5c-.621 0-1.125.504-1.125 1.125M3.375 4.5h1.5C5.496 4.5 6 5.004 6 5.625m-3.75 0v1.5c0 .621.504 1.125 1.125 1.125m0 0h1.5m-1.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m1.5-3.75C5.496 8.25 6 7.746 6 7.125v-1.5M4.875 8.25C5.496 8.25 6 8.754 6 9.375v1.5m0-5.25v5.25m0-5.25C6 5.004 6.504 4.5 7.125 4.5h9.75c.621 0 1.125.504 1.125 1.125m1.125 2.625h1.5m-1.5 0A1.125 1.125 0 0118 7.125v-1.5m1.125 2.625c-.621 0-1.125.504-1.125 1.125v1.5m2.625-2.625c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125M18 5.625v5.25M7.125 12h9.75m-9.75 0A1.125 1.125 0 016 10.875M7.125 12C6.504 12 6 12.504 6 13.125m0-2.25C6 11.496 5.496 12 4.875 12M18 10.875c0 .621-.504 1.125-1.125 1.125M18 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m-12 5.25v-5.25m0 5.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125m-12 0v-1.5c0-.621-.504-1.125-1.125-1.125M18 18.375v-5.25m0 5.25v-1.5c0-.621.504-1.125 1.125-1.125M18 13.125v1.5c0 .621.504 1.125 1.125 1.125M18 13.125c0-.621.504-1.125 1.125-1.125M6 13.125v1.5c0 .621-.504 1.125-1.125 1.125M6 13.125C6 12.504 5.496 12 4.875 12m-1.5 0h1.5m-1.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M19.125 12h1.5m0 0c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h1.5m14.25 0h1.5" />
            </svg>
            
        <span class="ml-3 text-xl">Flister</span>
        </a>
        <nav class="md:ml-auto flex flex-wrap items-center text-base justify-center">

        <a href="#" class="mr-5 hover:text-white">{data.user.name}</a>


        </nav>

        {#if $currentUser}
        <button on:click={signOut} class="inline-flex items-center bg-gray-800 border-0 py-1 px-3 focus:outline-none hover:bg-gray-700 rounded text-base mt-4 md:mt-0">Sign Out
        </button>
        {/if}
    </div>
</header>

    <!-- <PlaylistForm 
        selectedPlaylist={selectedPlaylist}
        leavePlaylist={() => leavePlaylist()}
        creating={true}
    /> -->
    



<section class="text-gray-400 body-font bg-gray-900 h-screen">
    
    <div class="container px-2 py-10 mx-auto">
        <h1 class="text-center text-4xl tracking-wide mb-10">My Playlists</h1>

        {#if $currentUser}
        <button on:click={newPlaylist} class="float-left bg-gray-800 border-0 py-1 px-3 focus:outline-none hover:bg-gray-700 rounded text-base mt-4 md:mt-0">New Playlist</button>
        {/if}

        <label for="my-modal-3" class="btn">open modal</label>

        <div class="flex flex-wrap -m-4">
            
            {#each playlists as playlist}
            
                <div class="xl:w-1/4 md:w-1/2 p-4">
                    <div on:click={() => selectPlaylist(playlist)} on:keypress={() => selectPlaylist(playlist)} class="bg-gray-800 bg-opacity-40 p-6 rounded-lg cursor-pointer">
                        <img class="h-full rounded w-full object-cover object-center mb-6" src="https://dummyimage.com/300x400" alt="content">
                        <h2 class="text-lg text-white font-medium title-font mb-4">{playlist.name}</h2>
                        <p class="leading-relaxed text-base">Description</p>
                    </div>
                </div>
        

                <!-- <a href="#" on:click={() => selectPlaylist(playlist)}>
                    <div class="playlist-item">{playlist.name}</div>
                </a>
                <a href="#" on:click={() => deletePlaylist(playlist)}>
                    <img src="src/assets/closebutton.svg" alt="close">
                </a> -->

            {/each}
        </div> 
    </div>
</section>

<input type="checkbox" id="my-modal-3" class="modal-toggle" />
<div class="modal">
  <div class="modal-box relative">
    <label for="my-modal-3" class="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
    <Email subject="{title}" body="{url} {url}" />
    <Reddit class="share-button" {title} {url} />
    <Tumblr class="share-button" {title} {url} caption="{title}" />
    <Telegram class="share-button" text={title} {url} />
    <Facebook class="share-button" quote="{title}" {url} />
    <Twitter class="share-button" text="{title}" {url} hashtags="flister" via="username" related="other,users" />
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <label for="" class="btn" on:click={showLinkCopiedAlert}>Copy link</label>

    {#if linkCopiedAlert}
    <div in:fade="{{ duration: 1000 }}" out:fade class="alert alert-success shadow-lg">
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>Link copied to clipboard!</span>
        </div>
      </div>
    {/if}
  </div>
</div>

