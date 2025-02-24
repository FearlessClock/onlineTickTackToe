import { error, json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { gameInfo } from '$lib/server/db/schema.js';
import { eq } from 'drizzle-orm';

export async function POST({ request, cookies }) {
	const { index, player, game_code } = await request.json();

	let game_information = await db.select().from(gameInfo).where(eq(gameInfo.game_code, game_code));

	if(game_information[0].current_player != player)
	{
		error(400, "Not your turn");
	}

	if(game_information[0].game_state[index] != "0"){
		error(400, "Square not empty");
	}

	const newGameState = replaceAt(game_information[0].game_state, index, player);

    const nextPlayer = player== 1? 2:1;

	const victoryResult = CheckForVictory(newGameState, player);
	let victor = null;
	let is_game_done = false;
	console.log(victoryResult);
	if(victoryResult){
		victor = player;
		is_game_done = true;
	}

	game_information = await db.update(gameInfo).set({current_player: nextPlayer, game_state: newGameState, is_game_done: is_game_done, winner: victor }).where(eq(gameInfo.game_code, game_code)).returning();

	return json({ game_information: game_information }, { status: 200 });
}


function CheckForVictory(game_state: string, player: string) {
	const checks = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8],[0,4,8],[2,4,6]];
	console.log(player);
	console.log(game_state);
	let foundVictory = false;
	checks.forEach(element => {
		if(game_state[element[0]] == player && game_state[element[1]] == player && game_state[element[2]] == player){
			foundVictory = true;
		}
	});
	return foundVictory;
}

function replaceAt (original : string, index : number, replacement : string) {
    return original.substring(0, index) + replacement + original.substring(index + replacement.length);
}