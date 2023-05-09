import { fail, redirect } from "@sveltejs/kit";
import { validateData } from "$lib/utils";
import { loginUserSchema } from "$lib/schemas";
import type { Actions } from './$types';

export const actions: Actions = {
    login: async ({ request, locals}) => {
        const { formData, errors } = await validateData(await request.formData(), loginUserSchema);
        console.log(errors);

        if (errors) {
            return fail(400, {
                data: formData,
                errors: errors.fieldErrors
            });
        }

        try {
            await locals.pb.collection('users').authWithPassword(formData.email, formData.password);
            
            if (!locals.pb?.authStore?.model?.verified) {
                console.log("not verified")
                locals.pb.authStore.clear();
                return fail(400, {notVerified : true})

            }
        } catch(err) {
            console.log("error after try");
            console.log(err);
            return fail(400, {invalid : true})
        }
        
        throw redirect(303, ('profile/' + locals.pb.authStore.model.id));
    }
}