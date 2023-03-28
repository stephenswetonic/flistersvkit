import type { PageServerLoad } from './$types';
import { error } from "@sveltejs/kit";
 
export const load = (async ({ locals, params }) => {
    const slugArr = params.slug.split('/');
    if (slugArr.length == 2) {
        try {
            if (slugArr[1] == 'new') {
                return {
                    user : structuredClone( await locals.pb.collection('users').getOne(slugArr[0])),
                    movies : [],

    
                }
            }
            return {
                user : structuredClone(await locals.pb.collection('users').getOne(slugArr[0])),
                movies : structuredClone(await locals.pb.collection('movies').getFullList(50, { filter: `playlist="${slugArr[1]}"`, sort : "rank"})),
                playlist : structuredClone(await locals.pb.collection('playlists').getOne(slugArr[1])),


            }
        } catch(err) {
            console.log(err);
            throw error(500, "Something went wrong");
        }
    }
}) satisfies PageServerLoad;