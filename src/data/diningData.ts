import { DiningItem } from '../types/database';

export const diningConfig = {
  restaurantName: 'Crystal Restaurant & Café',
  cuisineType: 'International, Arabic & Asian Specialties',
  description: 'Experience freshly prepared dining throughout the day at Crystal Plaza Hotel. Our culinary team serves a versatile buffet and à la carte menu featuring Middle Eastern favorites, wholesome breakfast selections, and savory continental specialties in an inviting, family-friendly ambience.',
  serviceHours: {
    breakfast: '6:30 AM – 10:30 AM',
    lunch: '12:30 PM – 3:30 PM',
    dinner: '7:00 PM – 11:00 PM',
    roomService: 'Hotline: 056 973 2183'
  },
  highlights: [
    'Daily Continental & Oriental Breakfast Buffet',
    'Flavorful Arabic Grills & Regional Specialties',
    'Carefully Crafted Vegetarian & Vegan Choices',
    'Special Event Catering & Banquet Dining Menus',
    'Room Service Hotline (056 973 2183) for In-House Guests'
  ]
};

export const sampleMenuCategories = [
  {
    id: 'breakfast',
    title: 'Morning Breakfast & Continental',
    items: [
      {
        name: 'Continental Morning Set',
        description: 'Fresh bakeries, croissants, toast, preserves, butter, sliced cheeses, fresh fruit cuts, and choice of fresh juice, tea or brewed coffee.',
        note: 'Available daily during breakfast hours'
      },
      {
        name: 'Arabic Shakshuka & Foul',
        description: 'Traditional poached eggs cooked in spiced tomato, cumin, and bell pepper sauce, served with warm pita bread, olives, and mint tea.',
        note: 'Freshly prepared to order'
      },
      {
        name: 'Made-to-Order Omelette Station',
        description: 'Farm-fresh eggs with choice of mushrooms, onions, bell peppers, cheese, tomato, and fresh herbs.',
        note: 'Served with roasted potatoes and grilled tomato'
      }
    ]
  },
  {
    id: 'arabic_specialties',
    title: 'Middle Eastern & Grills',
    items: [
      {
        name: 'Mixed Grill Platter',
        description: 'Tender skewers of shish tawook, lamb kofta, and beef kebab chargrilled with aromatic herbs, served with garlic dip and spiced rice.',
        note: 'Chef signature specialty'
      },
      {
        name: 'Traditional Hot & Cold Mezze',
        description: 'Creamy hummus tahini, mutabbal, tabbouleh, fattoush salad, crispy falafel, and stuffed cheese sambousek with warm flatbread.',
        note: 'Ideal for sharing'
      },
      {
        name: 'Chicken Biryani / Mandi',
        description: 'Fragrant basmati rice slow-cooked with whole spices, caramelized onions, and tender spiced chicken with cucumber raita and tomato salsa.',
        note: 'Popular daily staple'
      }
    ]
  },
  {
    id: 'international',
    title: 'Continental & Comfort Dishes',
    items: [
      {
        name: 'Grilled Herb Chicken Breast',
        description: 'Marinated in rosemary and lemon zest, accompanied by seasonal roasted vegetables and creamy mashed potatoes.',
        note: 'Light and wholesome'
      },
      {
        name: 'Penne Arrabbiata / Alfredo',
        description: 'Al dente penne pasta tossed in spicy basil pomodoro sauce or rich parmesan cream sauce with mushrooms.',
        note: 'Vegetarian option available'
      },
      {
        name: 'Club Sandwich & Fries',
        description: 'Triple-decker toasted bread layered with grilled chicken, fried egg, lettuce, tomato, cheese, and seasoned steak fries.',
        note: 'All-day favorite'
      }
    ]
  },
  {
    id: 'beverages',
    title: 'Beverages & Hot Brews',
    items: [
      {
        name: 'Moroccan Mint Tea & Selection of Fine Teas',
        description: 'Fragrant green tea brewed with fresh spearmint leaves, English breakfast tea, Earl Grey, and soothing herbal infusions.',
        note: 'Freshly brewed'
      },
      {
        name: 'Freshly Squeezed Seasonal Juices',
        description: 'Valencia orange, watermelon, green apple, or refreshing lemon with mint.',
        note: '100% natural, no added sugar'
      }
    ]
  }
];

export const diningGalleryImages = [
  {
    url: 'https://i.ibb.co/fz8CHH3x/Whats-App-Image-2026-09-04-at-5-06-41-PM.jpg',
    title: 'Crystal Dining Restaurant',
    alt: 'Crystal Plaza Hotel dining hall and seating'
  },
  {
    url: 'https://i.ibb.co/HLhqtyxG/Whats-App-Image-2026-09-04-at-5-04-54-PM.jpg',
    title: 'Restaurant Dining Space',
    alt: 'Crystal Plaza Hotel restaurant tables and warm ambiance'
  }
];
