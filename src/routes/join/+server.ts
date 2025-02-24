import { error, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { gameInfo } from '$lib/server/db/schema.js';
import { eq } from 'drizzle-orm';

export const GET: RequestHandler = async ({ url }) => {
	const username : string = url.searchParams.get('username') ?? "";
	const game_code : string = url.searchParams.get('game_code') ?? "";

	if (username?.length == 0) {
		error(400, 'Must indicate username');
	}

	if (game_code?.length == 0) {
		error(400, 'Must indicate game code');
	}

    const game_info = await db.select().from(gameInfo).where(eq(gameInfo.game_code, game_code));

    if(game_info.length == 0){
		error(400, 'Game doesn\'t exist');
    }

    await db.update(gameInfo).set({player2: username, has_started: true}).where(eq(gameInfo.game_code, game_code));

	return new Response(undefined, {status: 200});
};