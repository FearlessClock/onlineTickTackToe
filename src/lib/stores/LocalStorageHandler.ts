import { writable, type Writable } from 'svelte/store';

const isBrowser = typeof window !== 'undefined';

function createPersistentStore(key: string, initialValue: string) : Writable<string> {
    let storedValue = initialValue;
    
    if(isBrowser){
        const saved = localStorage.getItem(key);
        storedValue = saved ? JSON.parse(saved) : initialValue;
    }
    console.log("Stored value: ", storedValue , " key ", key);
    const store = writable(storedValue);

    if (isBrowser) {
        store.subscribe((value) => {
            if (value !== null) {
                localStorage.setItem(key, JSON.stringify(value));
            }
        });
    }

    return store;
}

export const game_code_store = createPersistentStore('game_code_store', "");
export const player_number_store = createPersistentStore('player_number_store', "");

export function resetAll(){
    game_code_store.set("");
    player_number_store.set("");
}
