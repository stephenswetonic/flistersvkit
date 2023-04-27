<script lang=ts>
	import Input from '$lib/components/Input.svelte'
	export let form;
</script>

<div class="flex flex-col items-center h-full w-full">
    <h2 class="mt-2 text-center text-3xl font-bold tracking-light text-base-content">
        Register an account
    </h2>
    <p class="text-center mt-1">
        Or <a href="/login" class="text-primary font-medium hover:cursor-pointer hover:underline"> sign in </a>
        if you already have an account.
    </p>
    <form action="?/register" method="POST" class="flex flex-col items-center space-y-2 w-full pt-4">
        <Input type="text" id="name" label="Name" value={form?.data?.name} errors={form?.errors?.name} />
		<Input type="email" id="email" label="Email" value={form?.data?.email} errors={form?.errors?.email} />
		<Input type="password" id="password" label="Password" errors={form?.errors?.password} optionalMessage="Password must be a minimum of 8 characters and contain at least one letter, one number, and one special character (@$!%*#?&)."/>
		<Input type="password" id="passwordConfirm" label="Confirm Password" errors={form?.errors?.passwordConfirm} optionalMessage="Password must be a minimum of 8 characters and contain at least one letter, one number, and one special character (@$!%*#?&)." />

		<div class="w-full max-w-lg pt-2">
			<button type="submit" class="btn btn-primary w-full">Register</button>
		</div>

        {#if form?.invalid}
            <div class="alert alert-error shadow-lg w-full max-w-lg">
                <div>
                <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>{form?.error.email.message}</span>
                </div>
            </div>
            <p class="text-center mt-1">
                <a href="/login" class="text-primary font-medium hover:cursor-pointer hover:underline"> Sign in </a>
                if you already have an account.
            </p>
        {/if}
    </form>
</div>