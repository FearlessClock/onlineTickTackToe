import { error, json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { gameInfo } from '$lib/server/db/schema.js';
import { eq } from 'drizzle-orm';

export async function GET({ params, request, cookies }) {
	const { game_code } = params;

    if (game_code?.length == 0) {
		error(400, 'Must indicate game code');
	}

    const game_info = await db.select().from(gameInfo).where(eq(gameInfo.game_code, game_code));

    if(game_info.length == 0){
		error(400, 'Game doesn\'t exist');
    }
    
	return json({game_info:game_info[0]}, {status: 200});
}