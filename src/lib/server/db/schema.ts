import { pgTable, serial, text, integer, boolean } from 'drizzle-orm/pg-core';

export const user = pgTable('user', {
	id: serial('id').primaryKey(),
	name: text('name').notNull(),
	player_number: integer('player_number').notNull().default(1),
	game_id: integer('game_id').references(() => gameInfo.id).notNull()
});

export const gameInfo = pgTable('game_table', {
	id: serial('id').primaryKey(),
	current_player: integer('current_player').notNull(),
	game_code: text('game_code').notNull(),
	game_state: text('game_state').notNull().default('000000000'),
	player1: text('player1').notNull().default(''),
	player2: text('player2').default(''),
	is_game_done: boolean('is_game_done').notNull().default(false),
	winner: integer('winner').default(0),
	has_started: boolean('has_started').notNull().default(false)
})