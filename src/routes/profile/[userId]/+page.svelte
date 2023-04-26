<script lang="ts">
    import { goto } from '$app/navigation';
    import { page } from '$app/stores';

    //import type { PageData } from './$types';
    import { fade } from 'svelte/transition';
    import { Email, Reddit, Telegram, Tumblr, Facebook, Twitter } from 'svelte-share-buttons-component';

    //From +page.server.ts
    export let data;

    const userId = $page.params.userId;
    let playlists = data.playlists;
    let linkCopiedAlert = false;
    const url = $page.url;
	const title = data.name + '\'s Flister Profile';

    function newPlaylist() {
        routeToPage((`playlist/${userId}/new`), false);
    };

    function selectPlaylist(playlist) {
        routeToPage((`playlist/${userId}/${playlist.id}`), true);
    }

    function routeToPage(route: string, replaceState: boolean) {
      goto(`/${route}`, { replaceState }) 
    }

    // async function deletePlaylist(playlist) {
    //     console.log(playlist);
    //     let moviesInPlaylist = await pb.collection('movies').getFullList(50, { filter: `playlist="${playlist.id}"`});
    //     for (let i = 0; i < moviesInPlaylist.length; i++) {
    //         await pb.collection('movies').delete(moviesInPlaylist[i].id);
    //     }
    //     await pb.collection('playlists').delete(playlist.id);
    //     location.reload();
    // }

    async function removePlaylist(playlistId) {
        console.log(playlistId)
        const response = await fetch('/profile/removePlaylist', {
        method: 'DELETE',
        body: JSON.stringify({ playlistId }),
        headers: {
          'content-type': 'application/json'
        }
        });

      await response.json();
      location.reload();
    }

    function copyProfileLink() {
        navigator.clipboard.writeText($page.url.toString());
        showLinkCopiedAlert();
    }

    function showLinkCopiedAlert() {
        linkCopiedAlert = true;
        setTimeout(hideLinkCopiedAlert, 3000);
    }

    function hideLinkCopiedAlert() {
        linkCopiedAlert = false;
    }

</script>

<div class="container px-2 py-10 mx-auto">
    <h1 class="text-center text-4xl tracking-wide mb-10">My Playlists</h1>

    {#if data.user}
    <button on:click={newPlaylist} class="float-left btn btn-primary m-2">New Playlist</button>
    {/if}

    <label for="my-modal-3" class="btn btn-primary m-2">Share</label>

    <div class="flex flex-wrap -m-4">
        
        {#each playlists as playlist}
        
            <div class="xl:w-1/4 md:w-1/2 p-4 relative">
                <div on:click={() => selectPlaylist(playlist)} on:keypress={() => selectPlaylist(playlist)} class="bg-gray-800 bg-opacity-40 p-6 rounded-lg cursor-pointer">
                    {#if data.user}
                    <button class="btn btn-sm absolute top-5 right-5" on:click|stopPropagation={() => removePlaylist(playlist.id)}>
                        <svg width="25px" height="25px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M19.207 6.207a1 1 0 0 0-1.414-1.414L12 10.586 6.207 4.793a1 1 0 0 0-1.414 1.414L10.586 12l-5.793 5.793a1 1 0 1 0 1.414 1.414L12 13.414l5.793 5.793a1 1 0 0 0 1.414-1.414L13.414 12l5.793-5.793z" fill="#ff0000"/></svg>
                    </button>
                    {/if}
                    <img class="h-full rounded w-full object-cover object-center mb-6" src="https://dummyimage.com/300x400" alt="content">
                    <h2 class="text-lg text-white font-medium title-font mb-4">{playlist.name}</h2>
                    <p class="leading-relaxed text-base">Description</p>
                </div>
            </div>
        {/each}
    </div> 
</div>

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
    <label for="" class="btn" on:click={copyProfileLink}>Copy link</label>

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

