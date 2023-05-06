<script lang="ts">
    import { goto } from '$app/navigation';
    import { page } from '$app/stores';
    import type { PageData } from './$types';
    import {flip} from 'svelte/animate';
    import {fade} from 'svelte/transition';
    import { afterNavigate } from '$app/navigation';
    import AutoComplete from "simple-svelte-autocomplete"
    import { Email, Reddit, Telegram, Tumblr, Facebook, Twitter } from 'svelte-share-buttons-component';
    import { PUBLIC_TMDB_KEY} from '$env/static/public';

    let playlistName : string;
    let descriptionText : string;
    let hovering : any = false;
    let movieList = [];
    let moviesToDelete = [];
    let selectedMovie;
  
    let draggable = false;
    let editing = false;
    let creating = false;
    let viewing = false;

    export let data: PageData;
    let slugArr = $page.params.slug.split('/');
    let playlistId = slugArr[1];
    
    let posterWidth = 25;

    const url = $page.url;
    let linkCopiedAlert = false;

    async function addPlaylist() {
        console.log(movieList);
        const response = await fetch('/playlist/add', {
        method: 'POST',
        body: JSON.stringify({ movieList, playlistName, descriptionText, creating, playlistId }),
        headers: {
          'content-type': 'application/json'
        }
      });

      let addresponse = await response.json();
      playlistId = addresponse.playlistId;
      creating = false
      editing = false;
      draggable = false;
      viewing = true;

      changeIsNewState();
      await deleteMovies();
      routeToPage((`playlist/${slugArr[0]}/${playlistId}`), true);
      
    }
  
    // Sets ui movielist to reflect db state
    function changeIsNewState() {
      for (var i = 0; i < movieList.length; i++) {
        movieList[i].isNew = false;
      }
    }

    // Routing
    function routeToPage(route: string, replaceState: boolean) {
      goto(`/${route}`, {replaceState, invalidateAll : true}); 
    }

  
    // Drag and drop
    const drop = (event, target) => {
      event.dataTransfer.dropEffect = 'move'; 
      const start = parseInt(event.dataTransfer.getData("text/plain"));
      const newTracklist = movieList
  
      if (start < target) {
      newTracklist.splice(target + 1, 0, newTracklist[start]);
      newTracklist.splice(start, 1);
      } else {
      newTracklist.splice(target, 0, newTracklist[start]);
      newTracklist.splice(start + 1, 1);
      }
      movieList = newTracklist
      hovering = null
    }
  
    // Drag and drop
    const dragstart = (event, i) => {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.dropEffect = 'move';
      const start = i;
      event.dataTransfer.setData('text/plain', start);
    }
  
    // Adds movie from search box to ui
    async function addMovieToList() {
      // Getting high res poster
      const posterUrl = "https://image.tmdb.org/t/p/original/" + selectedMovie.poster_path + "?api_key=" + PUBLIC_TMDB_KEY;
  
      // Adding to playlist ui. In creating or editing mode,
      // isNew is true so the record is created.
      movieList.push({"recordid" : "","title" : selectedMovie.original_title, "id" : movieList.length, "img": posterUrl, "imdbid" : selectedMovie.id, "isNew" : true});
      hovering = movieList.length;
      updatePosterWidth();
    }
  
    // Edit button clicked
    function startEditing() {
      editing = true;
      draggable = true;
      viewing = false;
      creating = false;

      //playlistId = slugArr[1];
      playlistName = data.playlist.name;
    }
  
    // Cancel button clicked
    function cancelEdit() {
      creating = false
      editing = false;
      draggable = false;
      viewing = true;
      playlistName = data.playlist.name;
      movieList = [];
      updatePosterWidth();
      refreshMovieList();
    }
  
    // Removes a movie from the ui and deletes the record,
    // if it exists
    function removeMovieFromList(movieIndex) {
      // Templist is for new ui list
      let tempList = []
      for (var i = 0; i < movieList.length; i++) {
  
        if (i == movieIndex) {
          // Only delete if record exists
          if (!movieList[i].isNew) {
            moviesToDelete.push(movieList[i]);
          }
        } else {
          // Add all except one to delete
          tempList.push(movieList[i])
        }
      }
      movieList = tempList;
      hovering = movieList.length;
    }

    async function deleteMovies() {
      const response = await fetch('/playlist/remove', {
        method: 'DELETE',
        body: JSON.stringify({ moviesToDelete, playlistId }),
        headers: {
          'content-type': 'application/json'
        }
      });

      await response.json();

    }
  
    // Gets search suggestions from TMDB
    async function getSearchItems(keyword) {
        const url = "https://api.themoviedb.org/3/search/movie?api_key=" + PUBLIC_TMDB_KEY + "&query=" + encodeURI(keyword);
        const response = await fetch(url);
        const json = await response.json();
        return json.results;


    }
  
    // Adds movies from a playlist to the ui
    async function refreshMovieList() {
      movieList = [];
      for (var i = 0; i < data.movies.length; i++) {
        movieList.push({"recordid" : data.movies[i].id, "title" : data.movies[i].title, "id" : data.movies[i].rank-1, "img": data.movies[i].poster, "imdbid" : data.movies[i].imdbid, "isNew" : false})
      }
      hovering = movieList.length;
      
    };

    function updatePosterWidth() {
      if (movieList.length < 5) {
        posterWidth = 25;
      }
      if (movieList.length > 4) {
        posterWidth = 20;
      }
      if (movieList.length > 10) {
        posterWidth = 15;
      }
      if (movieList.length > 18) {
        posterWidth = 12;
      }
      if (movieList.length > 32) {
        posterWidth = 10;
      }
    }

    function copyListLink() {
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

    afterNavigate(() => {
      if (data.movies.length > 0) {
        refreshMovieList();
        playlistName = data.playlist.name;
        descriptionText = data.playlist.description;
        viewing = true;

    } else {
        creating = true;
        draggable = true;
    }
    })
  
    // If loading a playlist that already exists, 
    // fill the ui with that data. Otherwise start in 
    // create mode.
    // if (data.movies.length > 0) {
    //     addMoviesToList();
    //     playlistName = data.playlist.name;
    //     descriptionText = data.playlist.description;
    //     viewing = true;

    // } else {
    //     creating = true;
    //     draggable = true;
    // }
</script>

<section class="body-font bg-gray-900 container mx-auto px-5 lg:px-32 lg:pt-6">

  
  {#if viewing}
    <div class="flex">
      <h1 class="text-5xl tracking-wide grow">{playlistName}</h1>

      <div class="mt-2">
        {#if editing}
          <button class="btn btn-primary btn-sm ml-2" on:click={addPlaylist}>Save</button>
          <button class="btn btn-primary btn-sm ml-2" on:click={cancelEdit}>Cancel</button>
        {/if}

        {#if creating}
          <button class="btn btn-primary btn-sm ml-2" on:click={addPlaylist}>Create</button>

        {/if}

        {#if viewing && data.user}
          <button class="btn btn-primary btn-sm ml-2" on:click={startEditing}>Edit</button>
        {/if}
        <label for="my-modal-3" class="btn btn-primary btn-sm ml-2">Share</label>
      </div>
    </div>
  {/if}
  
  {#if creating || editing}
    <div class="flex flex-row">
      <div class="grow mr-2">
        <label for="listTitle" class="label font-medium">
        <span class="font-medium">List Title</span>
        </label>
        <input type="text" id="listTitle" required={true} placeholder="List Name" class="input input-bordered w-full max-w-xl" bind:value={playlistName}>
      </div>

      <div class="grow">
        <label for="listTitle" class="label font-medium">
        <span class="font-medium">Description</span>
        </label>
        <textarea name="Description" id="" cols="30" rows="5" placeholder="Description" class="input input-bordered w-full max-w-xl" bind:value={descriptionText}></textarea>
      </div>

      <div class="mt-12">
        {#if editing}
          <button class="btn btn-primary btn-sm ml-2 mb-1" on:click={addPlaylist}>Save</button>
          <button class="btn btn-primary btn-sm ml-2 mb-1" on:click={cancelEdit}>Cancel</button>
        {/if}

        {#if creating}
          <button class="btn btn-primary btn-sm ml-2 mb-1" on:click={addPlaylist}>Create</button>

        {/if}

        {#if viewing && data.user}
          <button class="btn btn-primary btn-sm ml-2 mb-1" on:click={startEditing}>Edit</button>
        {/if}
      </div>
    </div>
  
  <div class="autocomplete-wrapper">
    <AutoComplete
      searchFunction="{getSearchItems}"
      delay="0"
      localFiltering={false}
      showLoadingIndicator={true}
      matchAllKeywords={false}
      labelFieldName="original_title"
      valueFieldName="id"
      bind:selectedItem="{selectedMovie}"
      placeholder="Search Movies..."
      class="w-full p-3 mt-4 text-sm text-gray-900 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:ring-blue-500 focus:border-blue-500 hover:ring-blue-500 hover:border-blue-500"
      >
  
    <div slot="item" let:item={item} let:label={label} class="flex flex-row">
        <img src={`https://image.tmdb.org/t/p/original${item.poster_path}?api_key=${PUBLIC_TMDB_KEY}`} alt="thumbnail" style="max-width: 100px; height: auto;">
        <div class="text-white pl-6 text-lg font-medium">{@html label}</div>
    </div>
  
    </AutoComplete>
  
    
  <button type="submit" on:click={addMovieToList} class="btn btn-primary mt-4 ml-4">Add</button>
  </div>
  {/if}
  </section>




    <div class="container mx-auto px-5 py-2 lg:px-32 lg:pt-6">
  
      
      <!-- ignore error for ondragover="return false"-->
      <div class="-m-1 flex flex-wrap md:-m-2">
        {#each movieList as n, index  (n.id)}
          <div
            id="list-item"
            class="flex flex-wrap"
            style="width: {posterWidth}%;"
            animate:flip="{{duration: 500}}"
            draggable={draggable} 
            on:dragstart={event => dragstart(event, index)}
            on:drop|preventDefault={event => drop(event, index)}
            ondragover="return false"
            on:dragenter={() => hovering = index}
            class:is-active={hovering === index}
            out:fade={{duration : 100}}
            in:fade={{duration : 300}}
            >

            <!-- svelte-ignore a11y-mouse-events-have-key-events -->
            <div class="w-full p-1 relative inline" class:movie-hover={true}>
              <img src={n.img} alt="poster" class="h-full w-full rounded-lg object-cover object-center" draggable={false}>
              <p class="font-bold text-3xl absolute top-2 left-2"> {index+1}</p>
              {#if editing || creating}
                <button on:click={() => removeMovieFromList(index)} class="opacity-0 btn btn-sm btn-ghost absolute top-3 right-3">
                    <svg width="25px" height="25px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M19.207 6.207a1 1 0 0 0-1.414-1.414L12 10.586 6.207 4.793a1 1 0 0 0-1.414 1.414L10.586 12l-5.793 5.793a1 1 0 1 0 1.414 1.414L12 13.414l5.793 5.793a1 1 0 0 0 1.414-1.414L13.414 12l5.793-5.793z" fill="#ff0000"/></svg>
                </button>
              {/if}
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
          <Email subject={playlistName} body="{url} {url}"/>
          <Reddit class="share-button" title={playlistName} {url} />
          <Tumblr class="share-button" title={playlistName} {url} caption="{playlistName}" />
          <Telegram class="share-button" text={playlistName} {url} />
          <Facebook class="share-button" quote="{playlistName}" {url} />
          <Twitter class="share-button" text="{playlistName}" {url} hashtags="flister" via="username" related="other,users" />
          <!-- svelte-ignore a11y-click-events-have-key-events -->
          <label for="" class="btn btn-outline" on:click={copyListLink}>
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
  
<style>
    #list-item.is-active {
      background-color: #3273dc;
      color: #fff;
    }
  
    .autocomplete-wrapper :global(.autocomplete) {
      width: 510px;
    }
  
    .autocomplete-wrapper :global(.autocomplete-list) {
      top : 0px !important;
      --tw-bg-opacity: 1;
      background-color: rgb(31 41 55 / var(--tw-bg-opacity));
    }
  
    .autocomplete-wrapper :global(.autocomplete-list-item) {
      --tw-bg-opacity: 1;
      background-color: rgb(31 41 55 / var(--tw-bg-opacity));
      padding-top: 10px !important;
    }
  
    .autocomplete-wrapper :global(.autocomplete-list-item.selected) {
      --tw-bg-opacity: 1 !important;
      background-color: rgb(55 65 81 / var(--tw-bg-opacity)) !important;
    }

    .movie-hover:hover > button {
      opacity: 100%
    }
  </style>
