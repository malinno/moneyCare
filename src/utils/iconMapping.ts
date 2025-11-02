// Icon mapping từ API string sang emoji/icon hiển thị
export const iconMapping: Record<string, string> = {
  // Food & Dining
  'food_icon': '🍽️',
  'restaurant': '🍽️',
  'coffee': '☕',
  'fast_food': '🍔',
  'pizza': '🍕',
  'sushi': '🍣',
  
  // Shopping & Essentials
  'shopping': '🛒',
  'grocery': '🛒',
  'clothes': '👕',
  'shoes': '👟',
  'electronics': '📱',
  
  // Transportation
  'transport': '🚗',
  'gas': '⛽',
  'bus': '🚌',
  'taxi': '🚕',
  'flight': '✈️',
  
  // Entertainment
  'entertainment': '🎬',
  'movie': '🎬',
  'game': '🎮',
  'music': '🎵',
  'sport': '⚽',
  
  // Education
  'education': '📚',
  'book': '📚',
  'course': '🎓',
  'training': '🎓',
  
  // Health
  'health': '🏥',
  'medical': '🏥',
  'pharmacy': '💊',
  'fitness': '💪',
  
  // Utilities
  'electricity': '⚡',
  'water': '💧',
  'internet': '🌐',
  'phone': '📞',
  
  // Savings & Investment
  'savings': '🐷',
  'investment': '📈',
  'bank': '🏦',
  
  // Charity
  'charity': '⛪',
  'donation': '💝',
  
  // Others
  'other': '📦',
  'misc': '📦',
  'gift': '🎁',
  'travel': '✈️',
  'home': '🏠',
  'work': '💼',
};

// Function để lấy icon từ string
export const getIconFromString = (iconString: string): string => {
  return iconMapping[iconString] || '📦'; // Default icon nếu không tìm thấy
};
