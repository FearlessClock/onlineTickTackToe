import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { gameInfo } from '$lib/server/db/schema.js';
import { eq } from 'drizzle-orm';

function makeid(length: number) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}

export async function POST({ request, cookies }) {
    const { username } = await request.json();

    let randomId : string = "";
    let counter : number = 1000;
    let gameExists : boolean = true;
    do{
        randomId = makeid(6);
        gameExists = (await db.select().from(gameInfo).where(eq(gameInfo.game_code, randomId))).length > 0
        counter--;
    } while(counter > 0 && gameExists);

    const game: typeof gameInfo.$inferInsert = {
        current_player:1,
        game_code: randomId,
        player1: username
      };    

    const game_info = await db.insert(gameInfo).values(game).returning();
    return json({game_info}, { status: 200 });
}
