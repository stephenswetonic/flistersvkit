<script lang="ts">
    let isHovered = false;
    let nums = [1, 2, 3, 4]
</script>

<div class="flex flex-row">
    {#each nums as num}
    <!-- svelte-ignore a11y-mouse-events-have-key-events -->
    <div class="w-full p-1 relative inline"  on:mouseover={() => isHovered = true} on:mouseout={() => isHovered = false}>
        <p>{num}</p>
        <!-- svelte-ignore missing-declaration -->
        <a href="#" class="absolute top-2 right-2" class:class-on-hover={isHovered}>
            <svg width="25px" height="25px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M19.207 6.207a1 1 0 0 0-1.414-1.414L12 10.586 6.207 4.793a1 1 0 0 0-1.414 1.414L10.586 12l-5.793 5.793a1 1 0 1 0 1.414 1.414L12 13.414l5.793 5.793a1 1 0 0 0 1.414-1.414L13.414 12l5.793-5.793z" fill="#ff0000"/></svg>
        </a>
    </div>  
    {/each}
</div>

<style>
    .class-on-hover {
      background-color: azure;
    }
</style>

