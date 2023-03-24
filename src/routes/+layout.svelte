<script>
  import "../app.postcss";
  export let data;
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
          {data.user.username}
        </label>
        <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
        <ul
          tabindex="0"
          class="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
        >
          <li>
            <a href="/my/projects" class="justify-between">My Projects</a>
          </li>
          <li><a href="/my/settings">Settings</a></li>
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
</div>

<slot />
