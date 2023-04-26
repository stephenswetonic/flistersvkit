<script>
  import "../app.postcss";
  export let data;
  let profileLink;

  if (data.user) {
    profileLink = "/profile/" + data.user.id;
  }
  
</script>

<div class="min-h-full">
  <nav class="navbar bg-base-100 border-b">
    <div class="flex-1">
      <a href="/" class="btn btn-ghost normal-case text-xl">Flister</a>
    </div>
    <div class="flex-none">
      {#if ! data.user}
        <div class="dropdown dropdown-end">
          <a href="/login" class="btn btn-primary">Login</a>
          <a href="/register" class="btn btn-primary">Register</a>
        </div>
      {:else}
      <div class="dropdown dropdown-end">
        <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
        <!-- svelte-ignore a11y-label-has-associated-control -->
        <label tabindex="0" class="btn btn-ghost">
          {data.user.name}
        </label>
        <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
        <ul
          tabindex="0"
          class="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-300 rounded-box w-52"
        >
          <li>
            <a href={profileLink} class="justify-between">My Lists</a>
          </li>
          <li>
            <form action="/logout" method="POST">
              <button type="submit" class="w-full text-start">Logout</button>
            </form>
          </li>
        </ul>
      </div> 
      {/if}
    </div>
  </nav>


    <div class="mx-auto max-w-8xl sm:px-6 lg:px-8">
      <slot />
    </div>

</div>
