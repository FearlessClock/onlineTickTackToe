<script lang="ts">
	import { goto } from '$app/navigation';
	import { game_code_store, player_number_store } from '$lib/stores/LocalStorageHandler';
	import type { User } from '$lib/types/User.js';
	import { onMount } from 'svelte';

	let { data } = $props();
    let yourTurn = $state(true);
    let gameInformation = $state(data.game_info);
    let current_player = $state(data.game_info.current_player);
    console.log(data.game_info);

    let players : User[] = $state([]);
    players = data.users;

    let slots: string = $state(data.game_info.game_state);

    onMount( () =>{
        setInterval(Refresh, 2000);
    })

    async function Refresh(){
        const response = await fetch('/update/'+$game_code_store, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		});
        let gameResponse = await response.json();
		gameInformation = gameResponse.game_info;
        slots = gameInformation.game_state;
    }

    async function onclick(id : number){
        if(gameInformation.current_player !== parseInt($player_number_store))
        {
            return;
        }

        if(gameInformation.is_game_done){
            return;
        }

        if(!gameInformation.has_started){
            return;
        }

        const response = await fetch('/play', {
			method: 'POST',
			body: JSON.stringify({"index": id, "player": $player_number_store, "game_code": $game_code_store}),
			headers: {
				'Content-Type': 'application/json'
			}
		});

        if(response.status == 400){
            console.error(response.statusText);
            return;
        }

        const gameResponse = await response.json();
		gameInformation = (gameResponse.game_information[0]);
        console.log(gameResponse.game_information[0]);

        let index = id;
        slots = gameInformation.game_state;
        yourTurn = !yourTurn;
    }

    function newGame(){
        goto("/")
    }
</script>

<div class="flex flex-col gap-4 items-center justify-center">
    <h1 class="text-2xl">Online tick tack toe</h1>
    <h2>{gameInformation.player1} {current_player == 1? "X" : ""} VS {gameInformation.player2} {current_player == 2? "X" : ""}</h2>
    <h3>Game code: {gameInformation.game_code}</h3>
    {#if gameInformation.is_game_done}
        <div class="{gameInformation.winner == parseInt($player_number_store)? "text-green-700" : "text-red-700"}">
            {gameInformation.winner == parseInt($player_number_store)? "Winner" : "You lost"}
        </div>
    {/if}
    <div class="grid grid-cols-3 grid-rows-3 w-100 h-100">
        {#each slots as slot, index}
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div class="flex bg-base-300 h-full items-center justify-center border-2" onclick={()=>{onclick(index)}}>
                {#if slot == "1"}
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="-0.1 -0.1 3.2 3.2">
                        <path d="M.5.5 2 2m-1.5 0L2 .5" stroke="#000000" stroke-width="0.3" fill="none"/>
                    </svg>
                {:else if slot == "2"}
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="-0.1 -0.1 3.2 3.2">
                        <circle cx="1.5" cy="1.5" r="1" stroke="black" stroke-width="0.3" fill="none" />
                    </svg>
                {/if}
            </div>
        {/each}
    </div>
    {#if gameInformation.is_game_done}
        <button class="btn btn-primary" onclick={newGame}>New game</button>
    {/if}
</div>