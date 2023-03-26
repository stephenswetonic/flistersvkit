import { error, redirect } from "@sveltejs/kit";

export const actions = {
    login: async ({ request, locals}) => {
        const body = Object.fromEntries(await request.formData());

        try {
            await locals.pb.collection('users').authWithPassword(body.email.toString(), body.password.toString());
            
            if (!locals.pb?.authStore?.model?.verified) {
                locals.pb.authStore.clear();
                return {
                    notVerified: true
                }
            }
        } catch(err) {
            console.log(err);
            throw error(500, 'Something went wrong');
        }
        
        console.log(locals.user.id);
        console.log(locals.pb.authStore.model.id);
        throw redirect(303, ('profile/' + locals.pb.authStore.model.id));
        //throw redirect(303, '/');
        
    }
}