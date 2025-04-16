interface NameCategory {
  names: string[];
  color: string;
}

const getRandomItem = <T>(array: T[]): T =>
  array[Math.floor(Math.random() * array.length)];

const nameCategories: Record<string, NameCategory> = {
  fusion: {
    names: ['Lugon', 'Rayzor', 'Zapix', 'Kyvix', 'Mewdra', 'Groudex'],
    color: '#FF5733', // Fiery Orange
  },
  type: {
    names: ['Blazix', 'Aquor', 'Thundor', 'Psychon', 'Glacir', 'Venix'],
    color: '#3498DB', // Cool Blue
  },
  region: {
    names: ['Kantor', 'Johtan', 'Sinix', 'Unovix', 'Galaron'],
    color: '#2ECC71', // Vibrant Green
  },
  move: {
    names: ['Flamix', 'Shocka', 'Vortex', 'Blizzon', 'Hydron', 'Shadowx'],
    color: '#9B59B6', // Mystic Purple
  },
};

const getUserName = (): string => {
  const categoryKeys = Object.keys(nameCategories);
  const randomCategory = nameCategories[getRandomItem(categoryKeys)];
  return getRandomItem(randomCategory.names);
};

export default getUserName;
