export const getTypeColor = (type: string) => {
  const colors: {[key: string]: string} = {
    fire: '#F4A260',
    water: '#82A9F8',
    grass: '#9ACF80',
    electric: '#F9E087',
    ice: '#A8E0E0',
    fighting: '#E06C58',
    poison: '#C26BCF',
    ground: '#E4D98B',
    flying: '#B7B8F9',
    psychic: '#F98DA6',
    bug: '#C1D73A',
    rock: '#D0B47A',
    ghost: '#8E7BC2',
    dragon: '#9A64F9',
    dark: '#9C7B63',
    steel: '#D0D0E0',
    fairy: '#F4B7C0',
    normal: '#B2C18C',
  };

  const textColors: {[key: string]: string} = {
    fire: '#4B4B4B',
    water: '#4B4B4B',
    grass: '#4B4B4B',
    electric: '#4B4B4B',
    ice: '#4B4B4B',
    fighting: '#4B4B4B',
    poison: '#4B4B4B',
    ground: '#4B4B4B',
    flying: '#4B4B4B',
    psychic: '#4B4B4B',
    bug: '#4B4B4B',
    rock: '#4B4B4B',
    ghost: '#FFFFFF',
    dragon: '#4B4B4B',
    dark: '#FFFFFF',
    steel: '#4B4B4B',
    fairy: '#4B4B4B',
    normal: '#4B4B4B',
  };

  return {
    backgroundColor: colors[type] || '#B2C18C',
    textColor: textColors[type] || '#B8B8B8',
  };
};

export const getBgColor = (type: string) => {
  const colors: {[key: string]: string} = {
    fire: 'rgba(240, 128, 48, 0.2)',
    water: 'rgba(104, 144, 240, 0.2)',
    grass: 'rgba(120, 200, 80, 0.2)',
    electric: 'rgba(248, 208, 48, 0.2)',
    ice: 'rgba(152, 216, 216, 0.2)',
    fighting: 'rgba(192, 48, 40, 0.2)',
    poison: 'rgba(160, 64, 160, 0.2)',
    ground: 'rgba(224, 192, 104, 0.2)',
    flying: 'rgba(168, 144, 240, 0.2)',
    psychic: 'rgba(248, 88, 136, 0.2)',
    bug: 'rgba(168, 184, 32, 0.2)',
    rock: 'rgba(184, 160, 56, 0.2)',
    ghost: 'rgba(112, 88, 152, 0.2)',
    dragon: 'rgba(112, 56, 248, 0.2)',
    dark: 'rgba(112, 88, 72, 0.2)',
    steel: 'rgba(184, 184, 208, 0.2)',
    fairy: 'rgba(238, 153, 172, 0.2)',
    normal: 'rgba(168, 168, 120, 0.2)',
  };
  return colors[type] || 'rgba(168, 168, 120, 0.2)';
};

export const statColors = [
  '#F8D010', // Yellow for HP
  '#F44336', // Red for Attack
  '#4CAF50', // Green for Defense
  '#3F51B5', // Blue for Special Attack
  '#9C27B0', // Purple for Special Offense
  '#2196F3', // Light Blue for Speed
];

interface StatColors {
  bgColor: string;
  bar: string;
}

export const statsColors: { [key: string]: StatColors } = {
  hp: {
    bgColor: 'rgba(248, 16, 16, 0.1)',
    bar: '#4CAF50',
  },
  attack: {
    bgColor: 'rgba(255, 87, 34, 0.1)',
    bar: '#F44336',
  },
  defense: {
    bgColor: 'rgba(76, 175, 80, 0.1)',
    bar: '#4CAF50',
  },
  'special-attack': {
    bgColor: 'rgba(63, 81, 181, 0.1)',
    bar: '#3F51B5',
  },
  'special-defense': {
    bgColor: 'rgba(156, 39, 176, 0.1)',
    bar: '#9C27B0',
  },
  speed: {
    bgColor: 'rgba(33, 150, 243, 0.1)',
    bar: '#2196F3',
  },
};
