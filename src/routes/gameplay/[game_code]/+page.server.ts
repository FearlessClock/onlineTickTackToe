import { db } from '$lib/server/db';
import { gameInfo, user } from '$lib/server/db/schema';
import type { GameInfo } from '$lib/types/GameInfo';
import type { User } from '$lib/types/User';
import { error } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export async function load({params}) {
	const {game_code} = params
    const games : GameInfo[] = await db.select().from(gameInfo).where(eq(gameInfo.game_code, game_code));
	if(games[0]===undefined){
		error(400, "Could not find game");
		
	}
    const users : User[] = await db.select().from(user).where(eq(user.game_id, games[0].id));
    console.log(games[0]);
	return {
		game_info: games[0],
		users: users
	};
}