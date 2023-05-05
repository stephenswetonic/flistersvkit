<script lang="ts">
    import { goto } from '$app/navigation';
    import { page } from '$app/stores';

    //import type { PageData } from './$types';
    import { fade } from 'svelte/transition';
    import Image from '$lib/components/Image.svelte';
    import { Email, Reddit, Telegram, Tumblr, Facebook, Twitter } from 'svelte-share-buttons-component';

    //From +page.server.ts
    export let data;

    const userId = $page.params.userId;
    let playlists = data.playlists;
    let linkCopiedAlert = false;
    let playlistIdToDelete;
    let isModalOpen = false;
    const url = $page.url;
	  const title = data.name + '\'s Flister Profile';

    function newPlaylist() {
        routeToPage((`playlist/${userId}/new`), true);
    };

    function selectPlaylist(playlist) {
        routeToPage((`playlist/${userId}/${playlist.id}`), false);
    }

    function routeToPage(route: string, replaceState: boolean) {
      goto(`/${route}`, { replaceState }) 
    }

    async function removePlaylist() {
        const response = await fetch('/profile/removePlaylist', {
        method: 'DELETE',
        body: JSON.stringify({ playlistIdToDelete }),
        headers: {
          'content-type': 'application/json'
        }
        });

      await response.json();
      location.reload(); //should remove from ui instead
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

    function setPlaylistToDelete(playlistId) {
      isModalOpen = true;
      playlistIdToDelete = playlistId;
      console.log(playlistIdToDelete);
    }

    console.log(data.playlists);

</script>


<div class="container px-2 mx-auto">

  <div class="relative pb-20 pt-3">
    <h1 class="float-left text-center text-5xl tracking-wide m-2">My Lists</h1>
    <label for="my-modal-3" class="btn btn-primary m-3 float-right">Share</label>
    {#if data.user}
      <button on:click={newPlaylist} class="btn btn-primary m-3 float-right">New List</button>
    {/if}
  </div>

    <div class="flex flex-wrap -m-4">
        {#each playlists as playlist}
            <div class="p-2 relative transition duration-200 hover:scale-105 max-w-sm">
                <div on:click={() => selectPlaylist(playlist)} on:keypress={() => selectPlaylist(playlist)} class="bg-gray-800 p-6 bg-opacity-40 rounded-lg cursor-pointer">
                    {#if data.user}
                    <button class="btn btn-sm btn-ghost absolute top-4 right-4" on:click|stopPropagation={()=> setPlaylistToDelete(playlist.id)}>
                      <svg width="25px" height="25px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M19.207 6.207a1 1 0 0 0-1.414-1.414L12 10.586 6.207 4.793a1 1 0 0 0-1.414 1.414L10.586 12l-5.793 5.793a1 1 0 1 0 1.414 1.414L12 13.414l5.793 5.793a1 1 0 0 0 1.414-1.414L13.414 12l5.793-5.793z" fill="#ff0000"/></svg>
                    </button>
                    {/if}
                    <div class="grid grid-cols-1 mb-2">
                      {#each playlist.thumbnailImgs as thumbnailImg}
                      <div class="col-start-1 row-start-1" style="margin-left: {thumbnailImg.index*40}px;">
                        <Image src={thumbnailImg.img} imgclass="xl:max-h-[300px] md:max-h-[150px] max-h-[100px] rounded" draggable={false}/>
                      </div>
                      {/each}
                    </div>
                    <h2 class="text-lg text-white font-medium title-font mb-4">{playlist.name}</h2>
                    <p class="leading-relaxed text-base truncate">{playlist.description}</p>
                </div>
            </div>
        {/each}
    </div> 
</div>

<input type="checkbox" id="my-modal-3" class="modal-toggle" />
<div class="modal">
  <div class="modal-box relative">
    <label for="my-modal-3" class="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
    <h3 class="mt-2 mb-5 text-center text-3xl font-bold tracking-light text-base-content">Share your profile</h3>
    <div class="flex flex-row justify-evenly">
      <Email subject="{title}" body="{url} {url}"/>
      <Reddit class="share-button" {title} {url} />
      <Tumblr class="share-button" {title} {url} caption="{title}" />
      <Telegram class="share-button" text={title} {url} />
      <Facebook class="share-button" quote="{title}" {url} />
      <Twitter class="share-button" text="{title}" {url} hashtags="flister" via="username" related="other,users" />
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <label for="" class="btn btn-outline" on:click={copyProfileLink}>
        <svg fill="#ffffff" width="30px" height="30px" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff">
          <g id="SVGRepo_bgCarrier" stroke-width="0"/>
          <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/>
          <g id="SVGRepo_iconCarrier"> <path d="M9.239 22.889c0.195 0.195 0.451 0.293 0.707 0.293s0.511-0.098 0.707-0.293l12.114-12.209c0.39-0.39 0.39-1.024 0-1.414s-1.023-0.39-1.414 0l-12.114 12.209c-0.391 0.39-0.391 1.023 0 1.414zM14.871 20.76c0.331 1.457-0.026 2.887-1.152 4.014l-4.039 3.914c-0.85 0.849-1.98 1.317-3.182 1.317s-2.332-0.468-3.182-1.317c-1.754-1.755-1.754-4.61-0.010-6.354l3.946-4.070c0.85-0.849 1.98-1.318 3.182-1.318 0.411 0 0.807 0.073 1.193 0.179l1.561-1.561c-0.871-0.407-1.811-0.619-2.754-0.619-1.663 0-3.327 0.635-4.596 1.904l-3.936 4.061c-2.538 2.538-2.538 6.654 0 9.193 1.269 1.27 2.933 1.904 4.596 1.904s3.327-0.634 4.596-1.904l4.030-3.904c1.942-1.942 2.361-4.648 1.333-7.023zM30.098 1.899c-1.27-1.269-2.933-1.904-4.596-1.904-1.664 0-3.328 0.635-4.596 1.904l-4.029 3.905c-2.012 2.013-2.423 5.015-1.244 7.439l1.552-1.552c-0.459-1.534-0.107-3.261 1.096-4.463l4.039-3.914c0.851-0.849 1.98-1.318 3.183-1.318 1.201 0 2.332 0.469 3.181 1.318 1.754 1.755 1.754 4.611 0.010 6.354l-4.039 4.039c-0.849 0.85-1.98 1.317-3.181 1.317-0.306 0-0.576 0.031-0.87-0.029l-1.593 1.594c0.796 0.331 1.613 0.436 2.463 0.436 1.663 0 3.326-0.634 4.596-1.904l4.029-4.029c2.538-2.538 2.538-6.653-0-9.192z"/> </g>
        </svg>
      </label>
    </div>
    {#if linkCopiedAlert}
    <div in:fade="{{ duration: 1000 }}" out:fade class="alert alert-success shadow-lg mt-2">
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>Link copied to clipboard!</span>
        </div>
      </div>
    {/if}
  </div>
</div>

<!-- Put this part before </body> tag -->
<div class="modal" class:modal-open={isModalOpen}>
  <div class="modal-box">
    <h3 class="font-bold text-lg">Delete list</h3>
    <p class="py-4">Are you sure you want to delete this list?</p>
    <div class="modal-action" on:click={removePlaylist} on:keypress={removePlaylist}>
      <button class="btn btn-outline" on:click|stopPropagation={() => isModalOpen = false}>Cancel</button>
      <button class="btn btn-error" on:click={()=>isModalOpen = false}>DELETE</button>
    </div>
  </div>
</div>
