import {BASE_URL, GEMINI_URL} from '@config/env';
import axios from 'axios';

export const fetchPokemon = async (page: number, limit: number = 10) => {
  try {
    const offset = page * limit;
    const response = await axios.get(
      `${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`,
    );

    if (!response.data || !response.data.results) {
      throw new Error('Invalid response structure');
    }

    const detailedPokemon = await Promise.all(
      response.data.results.map(
        async (pokemon: {name: string; url: string}) => {
          const detailsResponse = await axios.get(pokemon.url);
          return {...pokemon, ...detailsResponse.data};
        },
      ),
    );

    return {
      results: detailedPokemon,
      nextPage: response.data.next ? page + 1 : null,
    };
  } catch (error) {
    console.error('Error fetching Pokémon:', error);
    throw new Error('Failed to fetch Pokémon data');
  }
};

export const getPokemonDetails = async (identifier: string | number) => {
  try {
    const response = await axios.get(`${BASE_URL}/pokemon/${identifier}`);

    if (!response.data) {
      throw new Error('No data found for this Pokémon');
    }

    const resp = await axios.get(
      `https://pokeapi.co/api/v2/pokemon-species/${identifier}`,
    );
    const flavorTextEntries = resp.data?.flavor_text_entries;
    const englishDescription = flavorTextEntries.map((entry: any) => {
      if (entry?.language?.name === 'en') {
        return entry?.flavor_text;
      }
    });

    const data = response?.data;
    data.meta = resp.data || null;
    data.description = englishDescription || [];
    return data;
  } catch (error: any) {
    throw new Error('Failed to fetch Pokémon details');
  }
};

export const getMultiplePokemons = async (identifiers: (string | number)[]) => {
  const results = await Promise.allSettled(
    identifiers.map(id => getPokemonDetails(id)),
  );

  const successful: any[] = [];
  const failed: {id: string | number; reason: any}[] = [];

  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      successful.push(result.value);
    } else {
      failed.push({id: identifiers[index], reason: result.reason});
    }
  });

  if (failed.length > 0) {
    console.warn(`${failed.length} Pokémon failed to load.`, failed);
  }

  return successful;
};

const cleanGeminiJSON = (text: string): string => {
  return text
    .replace(/```json/g, '')
    .replace(/```/g, '')
    .trim();
};

export const generatePokemonProfile = async (pokemonName: string | number) => {
  const prompt = `
Act as a Pokémon expert and assistant for an app that uses PokeAPI.

For a given Pokémon (by name or ID), generate rich and immersive content suitable for a detailed Pokémon info sheet in the app. Use only information inspired by anime, and general Pokémon canon (no fan-made details).
Present your response strictly in valid JSON format.

Create a 10 JSON-based multiple-choice quiz for Pokémon fans.
– Be related to specific Pokémon, moves, abilities, types, or general Pokémon world knowledge.
– Include 4 options with one clearly correct answer (options should not be long).
– Vary in difficulty (2 easy, 2 medium, 1 hard).
– Be fun and slightly witty if possible.

Write a short interactive story featuring the Pokémon [POKÉMON NAME] as the main character.
– Set the scene in a vivid Pokémon region any random (Kanto, Johto, etc.).
– Involve a light adventure, challenge, or quest that reflects the Pokémon’s personality, type, and abilities.
– The tone should be whimsical and immersive for kids and fans.
– Split the story into 5-8 long paragraphs (200 min words for each pages) as pages.
– Add a short title and include names of any other featured Pokémon.
– Avoid fanon content. Stick to anime, games, and PokeAPI-inspired lore.
- Make sure it sounds realistic and proffesional 
Use the following structure exactly:

{
  "id": "<POKEMON_ID>",
  "name": "<POKEMON_NAME>",
  "lore": {
    "title": "Lore / Backstory title",
    "content": "<Describe the Pokémon’s origin, habitat, unique characteristics, and role in nature or Pokémon society. Mention legends or cultural significance if any.>"
  },
  "pokedex_entry": {
    "title": "Write a unique pokedex entry title",
    "content": "<Write a unique and creative Pokédex entry in the tone of a real Pokédex. Keep it short and quirky.>"
  },
   "quiz": [
    {
      "question": "string",
      "options": ["string", "string", "string", "string"],
      "answer": "string",
      "difficulty": "easy" | "medium" | "hard"
    },
    ...
  ],
  "story":[{
  "title": "string",
  "pages": ["Page 1 content", "Page 2 content", ..., "Page 7 content"], 
  "main_pokemon": "string",
  "supporting_pokemon": ["string", ...],
  "region": "string"
}],
  "battle_tips": {
    "title": "Battle Strategy Tips",
    "strengths": ["<Rock>", "<Ice>", "..."],
    "weaknesses": ["<Fire>", "<Ground>", "..."],
    "best_moveset": ["<Aura Sphere>", "<Bullet Punch>", "..."],
    "role": "<Sweeper | Support | Tank | etc.>",
    "synergy": [
      "<Short bullet of synergy idea 1>",
      "<Short bullet of synergy idea 2>"
    ]
  },
  "personality_facts": {
    "title": "Personality & Fun Facts",
    "content": "<Imagine the Pokémon’s personality. What kind of attitude or habits does it have? What would its catchphrase be if it could talk?>"
  },
}

Only return the JSON above. Do not add markdown, code blocks, or any explanation.

Target Pokémon: ${pokemonName}
`;

  try {
    const response = await axios.post(
      GEMINI_URL,
      {
        contents: [
          {
            parts: [{text: prompt}],
            role: 'user',
          },
        ],
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    const rawText = response.data.candidates[0]?.content?.parts[0]?.text;
    const cleaned = cleanGeminiJSON(rawText);

    const parsed = JSON.parse(cleaned);
    return parsed;
  } catch (error: any) {
    console.error(
      'Error calling Gemini API:',
      error.response?.data || error.message,
    );
    return null;
  }
};
