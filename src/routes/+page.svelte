<script lang="ts">
    import { currentUser, pb } from '$lib/pocketbase';
    import { goto } from '$app/navigation';

  
    let username: string;
    let password: string;
  
    async function login() {
      const user = await pb.collection('users').authWithPassword(username, password);
      routeToPage(('profile/' + user.record.id), true);
    }

    function routeToPage(route: string, replaceState: boolean) {
      goto(`/${route}`, { replaceState }) 
    }
  
  </script>

