import type { PageLoad } from './$types';
import { pb } from '$lib/pocketbase';
 
export const load = (async ({ params }) => {
    try {
        return {
            user : await pb.collection('users').getOne(params.userId),
            playlists : await pb.collection('playlists').getFullList(50, { filter: `user.id="${params.userId}"`})
        }
    } catch(err) {
        console.log(err);
    }
}) satisfies PageLoad;