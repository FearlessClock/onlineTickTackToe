export type GameInfo = {
    id: number;
    current_player: number;
    game_code: string;
    game_state: string;
    player1: string;
    player2: string | null;
    is_game_done: boolean;
    winner: number | null;
    has_started: boolean;
}