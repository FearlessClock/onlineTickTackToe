<script lang="ts">
    import { goto } from "$app/navigation";
	import { game_code_store, player_number_store } from "$lib/stores/LocalStorageHandler";

    let username:string = "";
    let game_code:string = "";

    let errorMessage:string = "";
    let isLoading:boolean = false;

    const joinCallback =async () =>{
        try {
            isLoading = true;
            const response = await fetch('/join?' + new URLSearchParams({username: username, game_code: game_code}), {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            console.log(response)
            if(response.status >= 400){
                let res = await response.json();
                console.log(res);
                isLoading = false;
                errorMessage = res.message;
                return;
            }

            let game_info = await response.json
            game_code_store.set(game_code);
            player_number_store.set("2");
            goto("/gameplay/"+game_code);

        } catch (error) {
            console.log(error);
        }
    }

    const createCallback =async () =>{
        try {
            const response = await fetch('/create', {
                method: 'POST',
                body: JSON.stringify({"username": username}),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            let game = (await response.json()).game_info[0];
            console.log(game)
            game_code_store.set(game.game_code);
            player_number_store.set("1");
            goto("/gameplay/"+game.game_code);
        } catch (error) {
            console.log(error);
        }
    }

</script>
<div class="flex flex-col">
    <p class="text-3xl m-4 self-center">Welcome to the online tick tack toe!</p>
    <div class="flex items-center justify-center">
        <div class="card shadow-xl w-1/2 items-center justify-center">
            <div class="card-title m-4 text-center">
                <p>Log in</p>
            </div>
            <div class="card-body m-4 gap-4">
                <form class="flex flex-col gap-4" onsubmit={joinCallback}>
                    <label class="floating-label">
                        <span>Username</span>
                        <input type="text" placeholder="Username" class="input input-md" bind:value={username}>
                    </label>
                    
                    <label class="floating-label">
                        <span>Game code</span>
                        <input type="text" placeholder="123ABC" class="input input-md" bind:value={game_code}>
                    </label>
                    
                    <button class="btn btn-primary w-full" disabled={isLoading}>Join game</button>
                </form>
                <button class="btn btn-secondary w-full" disabled={isLoading} onclick={createCallback}>Create game</button>
                {#if errorMessage}
                    <div class="alert alert-error">{errorMessage}</div>
                {/if}
                {#if isLoading}
                <span class="self-center loading loading-ring loading-xl"></span>
                {/if}
            </div>
        </div>
    </div>
    
</div>