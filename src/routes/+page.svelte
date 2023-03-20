<script lang="ts">
    import { currentUser, pb } from '$lib/pocketbase';
    import { goto } from '$app/navigation';

  
    let username: string;
    let password: string;
  
    async function login() {
      const user = await pb.collection('users').authWithPassword(username, password);
      routeToPage(('profile/' + user.record.id), true);
    }
  
    async function signUp() {
      try {
        const data = {
          "username": username,
          "password": password,
          "passwordConfirm": password,
          "name": username
        };
        const createdUser = await pb.collection('users').create(data);
        await login();
      } catch (err) {
        console.error(err)
      }
    }

    function routeToPage(route: string, replaceState: boolean) {
      goto(`/${route}`, { replaceState }) 
    }
  
  </script>
  

<section class="text-gray-400 bg-gray-900 body-font h-screen">
  <div class="container px-5 py-24 mx-auto flex flex-wrap items-center">
    <h1 class="text-9xl text-gray font-medium title-font mb-2 md:w-2/5">Flister</h1>
    <div class="lg:w-2/6 md:w-1/2 bg-gray-800 bg-opacity-50 rounded-lg p-8 flex flex-col md:ml-auto w-full mt-10 md:mt-0">
      <form on:submit|preventDefault>
        <div class="relative mb-4">
          <label for="full-name" class="leading-7 text-sm text-gray-400">Username</label>
          <input type="text" id="full-name" name="username" class="w-full bg-gray-600 bg-opacity-20 focus:bg-transparent focus:ring-2 focus:ring-red-900 rounded border border-gray-600 focus:border-red-500 text-base outline-none text-gray-100 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
          bind:value={username}
          />
        </div>
        <div class="relative mb-4">
          <label for="email" class="leading-7 text-sm text-gray-400">Password</label>
          <input type="password" id="email" name="password" class="w-full bg-gray-600 bg-opacity-20 focus:bg-transparent focus:ring-2 focus:ring-red-900 rounded border border-gray-600 focus:border-red-500 text-base outline-none text-gray-100 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
          bind:value={password} 
          />
        </div>
        <button on:click={signUp} class="text-white bg-red-500 border-0 py-2 px-8 focus:outline-none hover:bg-red-600 rounded text-lg">Sign Up</button>
        <button on:click={login} class="text-white bg-red-500 border-0 py-2 px-8 focus:outline-none hover:bg-red-600 rounded text-lg">Login</button>
      </form>
    </div>
  </div>
</section>

