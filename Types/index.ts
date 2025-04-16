export interface PokemonAbility {
  ability: {
    name: string;
    url: string;
  };
  is_hidden: boolean;
  slot: number;
}

export interface PokemonCry {
  latest: string;
  legacy: string;
}

export interface PokemonForm {
  name: string;
  url: string;
}

export interface PokemonGameIndex {
  game_index: number;
  version: {
    name: string;
    url: string;
  };
}

export interface PokemonMove {
  move: {
    name: string;
    url: string;
  };
  version_group_details: {
    level_learned_at: number;
    move_learn_method: {
      name: string;
      url: string;
    };
    version_group: {
      name: string;
      url: string;
    };
  }[];
}

export interface PokemonSpecies {
  name: string;
  url: string;
}

export interface PokemonSprites {
  back_default: string;
  back_female: string | null;
  back_shiny: string;
  back_shiny_female: string | null;
  front_default: string;
  front_female: string | null;
  front_shiny: string;
  front_shiny_female: string | null;
  other: {
    dream_world: {
      front_default: string;
      front_female: string | null;
    };
    home: {
      front_default: string;
      front_female: string | null;
      front_shiny: string;
      front_shiny_female: string | null;
    };
    'official-artwork': {
      front_default: string;
      front_shiny: string;
    };
    showdown: {
      back_default: string;
      back_female: string | null;
      back_shiny: string;
      back_shiny_female: string | null;
      front_default: string;
      front_female: string | null;
      front_shiny: string;
      front_shiny_female: string | null;
    };
  };
}

export interface PokemonType {
  slot: number;
  type: {
    name: string;
    url: string;
  };
}

export interface PokemonStats {
  base_stat: number;
  effort: number;
  stat: {
    name: string;
    url: string;
  };
}

export interface IPokemonStoryPage {
  main_pokemon: string;
  region: string;
  title: string;
  supporting_pokemon: string[];
  pages: string[];
}

export interface IPokemonLore {
  title: string;
  content: string;
}

export interface IPokemonPersonalityFacts {
  title: string;
  content: string;
}

export interface IPokemonPokedexEntry {
  title: string;
  content: string;
}

export interface IPokemonBattleTips {
  title: string;
  role: string;
  best_moveset: string[];
  strengths: string[];
  weaknesses: string[];
  synergy: string[];
}

export interface IPokemonQuizQuestion {
  question: string;
  options: string[];
  answer: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface IPokemon {
  id: number;
  name: string;
  base_experience: number;
  height: number;
  is_default: boolean;
  location_area_encounters: string;
  abilities: PokemonAbility[];
  description: string[];
  cries: PokemonCry;
  forms: PokemonForm[];
  game_indices: PokemonGameIndex[];
  moves: PokemonMove[];
  species: PokemonSpecies;
  sprites: PokemonSprites;
  past_abilities: any[];
  past_types: any[];
  order: number;
  held_items: any[];
  types: PokemonType[];
  stats: PokemonStats[];
  lore: IPokemonLore;
  personality_facts: IPokemonPersonalityFacts;
  pokedex_entry: IPokemonPokedexEntry;
  battle_tips: IPokemonBattleTips;
  quiz: IPokemonQuizQuestion[];
  story: IPokemonStoryPage[];
}
