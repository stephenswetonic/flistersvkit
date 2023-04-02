import { registerUserSchema } from "$lib/schemas";
import { validateData } from "$lib/utils";
import { error, fail, redirect } from "@sveltejs/kit";


export const actions = {
    register: async ({locals, request}) => {
        const { formData, errors } = await validateData(await request.formData(), registerUserSchema);

        if (errors) {
            return fail(400, {
                data: formData,
                errors: errors.fieldErrors
            })
        }

        try {
            await locals.pb.collection('users').create({...formData});
            await locals.pb.collection('users').requestVerification(formData.email.toString());
        } catch(err) {
            console.log('caught error')
            console.log(err.response)
            return {
                invalid: true,
                error: err.response.data
            }
        }
        throw redirect(303, '/login')
    }
}