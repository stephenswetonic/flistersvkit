<script lang="ts">
    import { goto } from '$app/navigation';
    import { redirect } from "@sveltejs/kit";

    export let data;

    function routeToPage(route: string, replaceState: boolean) {
      goto(`/${route}`, { replaceState }) 
    }

    if(data.user) {
      console.log(data.user.id);
      let url = '/profile/' + data.user.id;
      routeToPage(url, false);
    }

</script>

 

