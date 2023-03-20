import type { PageLoad } from './$types';
import { page } from '$app/stores';
import { pb } from '$lib/pocketbase';


 
export const load = (async ({ params }) => {
    const slugArr = params.slug.split('/');
    if (slugArr.length == 2) {
        try {
            if (slugArr[1] == 'new') {
                return {
                    user : await pb.collection('users').getOne(slugArr[0]),
                    movies : []
    
                }
            }
            return {
                user : await pb.collection('users').getOne(slugArr[0]),
                movies : await pb.collection('movies').getFullList(50, { filter: `playlist="${slugArr[1]}"`, sort : "rank"}),
                playlist : await pb.collection('playlists').getOne(slugArr[1])

            }
        } catch(err) {
            console.log(err);
        }
    }
}) satisfies PageLoad;