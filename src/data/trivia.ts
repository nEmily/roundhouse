import type { TriviaQuestion } from './types';

export const triviaQuestions: TriviaQuestion[] = [
  // Pop Culture - Intensity 1 (Easy)
  { id: 'tri-pop-1-001', question: 'What is the main character\'s name in "The Office"?', answer: 'Michael Scott', options: ['Michael Scott', 'Dwight Schrute', 'Jim Halpert', 'Pam Beesly'], category: 'pop-culture', intensity: 1 },
  { id: 'tri-pop-1-002', question: 'What is the name of the coffee shop in "Friends"?', answer: 'Central Perk', options: ['Central Perk', 'The Coffee House', 'Brew Haven', 'Espresso Bar'], category: 'pop-culture', intensity: 1 },
  { id: 'tri-pop-1-003', question: 'What does "MCU" stand for?', answer: 'Marvel Cinematic Universe', options: ['Marvel Cinematic Universe', 'Movie Comics United', 'Major Cinema Unit', 'Marvel Comics Unlimited'], category: 'pop-culture', intensity: 1 },
  { id: 'tri-pop-1-004', question: 'What is the name of Taylor Swift\'s sixth studio album?', answer: 'Reputation', options: ['Reputation', 'Folklore', 'Lover', 'Midnights'], category: 'pop-culture', intensity: 1 },
  { id: 'tri-pop-1-005', question: 'Who plays Iron Man in the MCU?', answer: 'Robert Downey Jr.', options: ['Robert Downey Jr.', 'Chris Evans', 'Chris Hemsworth', 'Mark Ruffalo'], category: 'pop-culture', intensity: 1 },
  { id: 'tri-pop-1-006', question: 'What is the name of Elon Musk\'s social media platform?', answer: 'X', options: ['X', 'Bluesky', 'Threads', 'Mastodon'], category: 'pop-culture', intensity: 1 },
  { id: 'tri-pop-1-007', question: 'How many seasons did "Breaking Bad" have?', answer: '5', options: ['4', '5', '6', '7'], category: 'pop-culture', intensity: 1 },
  { id: 'tri-pop-1-008', question: 'What is the most-watched Netflix series of all time?', answer: 'Squid Game', options: ['Stranger Things', 'The Crown', 'Squid Game', 'Bridgerton'], category: 'pop-culture', intensity: 1 },

  // Pop Culture - Intensity 2 (Medium)
  { id: 'tri-pop-2-001', question: 'What year did "Game of Thrones" premiere?', answer: '2011', options: ['2009', '2010', '2011', '2012'], category: 'pop-culture', intensity: 2 },
  { id: 'tri-pop-2-002', question: 'How many Marvel Infinity Stones are there?', answer: '6', options: ['5', '6', '7', '8'], category: 'pop-culture', intensity: 2 },
  { id: 'tri-pop-2-003', question: 'What is the real name of the rapper "Snoop Dogg"?', answer: 'Calvin Broadus', options: ['Calvin Broadus', 'Marshall Mathers', 'Curtis Jackson', 'Sean Carter'], category: 'pop-culture', intensity: 2 },
  { id: 'tri-pop-2-004', question: 'What country is "ABBA" from?', answer: 'Sweden', options: ['Norway', 'Sweden', 'Denmark', 'Finland'], category: 'pop-culture', intensity: 2 },

  // Pop Culture - Intensity 3 (Hard)
  { id: 'tri-pop-3-001', question: 'What is the name of the fictional town in "Stranger Things"?', answer: 'Hawkins', options: ['Hawkins', 'Derry', 'Castle Rock', 'Twin Peaks'], category: 'pop-culture', intensity: 3 },
  { id: 'tri-pop-3-002', question: 'Who directed "The Matrix"?', answer: 'The Wachowskis', options: ['James Cameron', 'The Wachowskis', 'Christopher Nolan', 'Denis Villeneuve'], category: 'pop-culture', intensity: 3 },

  // Movies - Intensity 1 (Easy)
  { id: 'tri-movie-1-001', question: 'In what year did "Avatar" premiere?', answer: '2009', options: ['2007', '2008', '2009', '2010'], category: 'movies', intensity: 1 },
  { id: 'tri-movie-1-002', question: 'Who directed "Jaws"?', answer: 'Steven Spielberg', options: ['Alfred Hitchcock', 'Steven Spielberg', 'Martin Scorsese', 'Francis Ford Coppola'], category: 'movies', intensity: 1 },
  { id: 'tri-movie-1-003', question: 'What is the highest-grossing film of all time (not adjusted for inflation)?', answer: 'Avatar: The Way of Water', options: ['Avatar: The Way of Water', 'Avengers: Endgame', 'Titanic', 'Avatar'], category: 'movies', intensity: 1 },
  { id: 'tri-movie-1-004', question: 'How many "Star Wars" main saga films are there?', answer: '9', options: ['7', '8', '9', '10'], category: 'movies', intensity: 1 },

  // Movies - Intensity 2 (Medium)
  { id: 'tri-movie-2-001', question: 'What is the name of the planet in "Avatar"?', answer: 'Pandora', options: ['Tatooine', 'Pandora', 'Arrakis', 'Caladan'], category: 'movies', intensity: 2 },
  { id: 'tri-movie-2-002', question: 'Who won Best Picture at the 2024 Oscars?', answer: 'Oppenheimer', options: ['Killers of the Flower Moon', 'Oppenheimer', 'American Fiction', 'Anatomy of a Fall'], category: 'movies', intensity: 2 },
  { id: 'tri-movie-2-003', question: 'What is the real name of "The Rock"?', answer: 'Dwayne Johnson', options: ['Dwayne Johnson', 'John Cena', 'Dave Bautista', 'Jason Momoa'], category: 'movies', intensity: 2 },

  // General Knowledge - Intensity 1 (Easy)
  { id: 'tri-general-1-001', question: 'What is the capital of France?', answer: 'Paris', options: ['Lyon', 'Paris', 'Marseille', 'Nice'], category: 'general-knowledge', intensity: 1 },
  { id: 'tri-general-1-002', question: 'How many continents are there?', answer: '7', options: ['5', '6', '7', '8'], category: 'general-knowledge', intensity: 1 },
  { id: 'tri-general-1-003', question: 'What is the largest ocean on Earth?', answer: 'Pacific Ocean', options: ['Atlantic Ocean', 'Indian Ocean', 'Pacific Ocean', 'Arctic Ocean'], category: 'general-knowledge', intensity: 1 },
  { id: 'tri-general-1-004', question: 'How many sides does a hexagon have?', answer: '6', options: ['5', '6', '7', '8'], category: 'general-knowledge', intensity: 1 },
  { id: 'tri-general-1-005', question: 'What is the fastest land animal?', answer: 'Cheetah', options: ['Lion', 'Cheetah', 'Gazelle', 'Greyhound'], category: 'general-knowledge', intensity: 1 },

  // General Knowledge - Intensity 2 (Medium)
  { id: 'tri-general-2-001', question: 'What is the smallest country in the world by area?', answer: 'Vatican City', options: ['Monaco', 'Vatican City', 'Liechtenstein', 'San Marino'], category: 'general-knowledge', intensity: 2 },
  { id: 'tri-general-2-002', question: 'What is the deepest ocean trench?', answer: 'Mariana Trench', options: ['Tonga Trench', 'Mariana Trench', 'Kuril Trench', 'Kermadec Trench'], category: 'general-knowledge', intensity: 2 },
  { id: 'tri-general-2-003', question: 'How many strings does a violin have?', answer: '4', options: ['3', '4', '5', '6'], category: 'general-knowledge', intensity: 2 },

  // General Knowledge - Intensity 3 (Hard)
  { id: 'tri-general-3-001', question: 'What is the capital of Kyrgyzstan?', answer: 'Bishkek', options: ['Almaty', 'Bishkek', 'Dushanbe', 'Ashgabat'], category: 'general-knowledge', intensity: 3 },

  // Science - Intensity 1 (Easy)
  { id: 'tri-science-1-001', question: 'What is the chemical symbol for gold?', answer: 'Au', options: ['Go', 'Gd', 'Au', 'Ag'], category: 'science', intensity: 1 },
  { id: 'tri-science-1-002', question: 'How many planets are in our solar system?', answer: '8', options: ['7', '8', '9', '10'], category: 'science', intensity: 1 },
  { id: 'tri-science-1-003', question: 'What gas do plants absorb from the air?', answer: 'Carbon dioxide', options: ['Oxygen', 'Nitrogen', 'Carbon dioxide', 'Hydrogen'], category: 'science', intensity: 1 },
  { id: 'tri-science-1-004', question: 'What is the boiling point of water at sea level?', answer: '100°C', options: ['50°C', '75°C', '100°C', '150°C'], category: 'science', intensity: 1 },
  { id: 'tri-science-1-005', question: 'What is the SI unit of force?', answer: 'Newton', options: ['Joule', 'Newton', 'Watt', 'Pascal'], category: 'science', intensity: 1 },

  // Science - Intensity 2 (Medium)
  { id: 'tri-science-2-001', question: 'How many bones are in the adult human body?', answer: '206', options: ['186', '196', '206', '216'], category: 'science', intensity: 2 },
  { id: 'tri-science-2-002', question: 'What is the chemical formula for table salt?', answer: 'NaCl', options: ['NaCl', 'KCl', 'CaCl2', 'MgCl2'], category: 'science', intensity: 2 },
  { id: 'tri-science-2-003', question: 'What organelle is known as the "powerhouse of the cell"?', answer: 'Mitochondria', options: ['Nucleus', 'Mitochondria', 'Ribosome', 'Lysosome'], category: 'science', intensity: 2 },

  // Science - Intensity 3 (Hard)
  { id: 'tri-science-3-001', question: 'What is the name of the protein that carries oxygen in red blood cells?', answer: 'Hemoglobin', options: ['Myoglobin', 'Hemoglobin', 'Albumin', 'Catalase'], category: 'science', intensity: 3 },

  // History - Intensity 1 (Easy)
  { id: 'tri-history-1-001', question: 'In what year did World War II end?', answer: '1945', options: ['1943', '1944', '1945', '1946'], category: 'history', intensity: 1 },
  { id: 'tri-history-1-002', question: 'Who was the first President of the United States?', answer: 'George Washington', options: ['Thomas Jefferson', 'George Washington', 'John Adams', 'Benjamin Franklin'], category: 'history', intensity: 1 },
  { id: 'tri-history-1-003', question: 'What year did the Titanic sink?', answer: '1912', options: ['1910', '1911', '1912', '1913'], category: 'history', intensity: 1 },
  { id: 'tri-history-1-004', question: 'In what year did the Berlin Wall fall?', answer: '1989', options: ['1987', '1988', '1989', '1990'], category: 'history', intensity: 1 },
  { id: 'tri-history-1-005', question: 'Who discovered America?', answer: 'Christopher Columbus', options: ['Amerigo Vespucci', 'Christopher Columbus', 'John Cabot', 'Leif Erikson'], category: 'history', intensity: 1 },

  // History - Intensity 2 (Medium)
  { id: 'tri-history-2-001', question: 'What year did the Roman Empire fall?', answer: '476', options: ['410', '456', '476', '496'], category: 'history', intensity: 2 },
  { id: 'tri-history-2-002', question: 'In what year did the Magna Carta sign?', answer: '1215', options: ['1200', '1215', '1225', '1235'], category: 'history', intensity: 2 },

  // History - Intensity 3 (Hard)
  { id: 'tri-history-3-001', question: 'Who was the first Holy Roman Emperor?', answer: 'Charlemagne', options: ['Otto I', 'Charlemagne', 'Frederick Barbarossa', 'Charles V'], category: 'history', intensity: 3 },

  // Geography - Intensity 1 (Easy)
  { id: 'tri-geography-1-001', question: 'What is the capital of Japan?', answer: 'Tokyo', options: ['Kyoto', 'Tokyo', 'Osaka', 'Yokohama'], category: 'geography', intensity: 1 },
  { id: 'tri-geography-1-002', question: 'What is the longest river in the world?', answer: 'Nile River', options: ['Amazon River', 'Yangtze River', 'Nile River', 'Mississippi River'], category: 'geography', intensity: 1 },
  { id: 'tri-geography-1-003', question: 'What is the capital of Australia?', answer: 'Canberra', options: ['Sydney', 'Melbourne', 'Canberra', 'Brisbane'], category: 'geography', intensity: 1 },
  { id: 'tri-geography-1-004', question: 'How many countries are in the European Union?', answer: '27', options: ['25', '26', '27', '28'], category: 'geography', intensity: 1 },
  { id: 'tri-geography-1-005', question: 'What is the capital of Canada?', answer: 'Ottawa', options: ['Toronto', 'Vancouver', 'Ottawa', 'Montreal'], category: 'geography', intensity: 1 },

  // Geography - Intensity 2 (Medium)
  { id: 'tri-geography-2-001', question: 'What is the capital of New Zealand?', answer: 'Wellington', options: ['Auckland', 'Wellington', 'Christchurch', 'Dunedin'], category: 'geography', intensity: 2 },
  { id: 'tri-geography-2-002', question: 'What is the largest desert in the world?', answer: 'Antarctic Desert', options: ['Sahara Desert', 'Gobi Desert', 'Antarctic Desert', 'Arabian Desert'], category: 'geography', intensity: 2 },

  // Geography - Intensity 3 (Hard)
  { id: 'tri-geography-3-001', question: 'What is the capital of Mauritius?', answer: 'Port Louis', options: ['Curepipe', 'Port Louis', 'Vacoas-Phoenix', 'Quatre Bornes'], category: 'geography', intensity: 3 },

  // Music - Intensity 1 (Easy)
  { id: 'tri-music-1-001', question: 'How many strings does a guitar have?', answer: '6', options: ['4', '5', '6', '7'], category: 'music', intensity: 1 },
  { id: 'tri-music-1-002', question: 'What is the lowest note on a piano?', answer: 'A0', options: ['C0', 'A0', 'E0', 'B0'], category: 'music', intensity: 1 },
  { id: 'tri-music-1-003', question: 'How many keys does a piano have?', answer: '88', options: ['78', '85', '88', '92'], category: 'music', intensity: 1 },
  { id: 'tri-music-1-004', question: 'What is the highest-selling album of all time?', answer: 'Thriller', options: ['Purple Rain', 'Hotel California', 'Thriller', 'Dark Side of the Moon'], category: 'music', intensity: 1 },
  { id: 'tri-music-1-005', question: 'How many members did "The Beatles" have?', answer: '4', options: ['3', '4', '5', '6'], category: 'music', intensity: 1 },

  // Music - Intensity 2 (Medium)
  { id: 'tri-music-2-001', question: 'What is the most-streamed song on Spotify of all time?', answer: 'Blinding Lights', options: ['Levitating', 'Blinding Lights', 'Bad Habits', 'Heat Waves'], category: 'music', intensity: 2 },
  { id: 'tri-music-2-002', question: 'What instrument does John Coltrane play?', answer: 'Saxophone', options: ['Trumpet', 'Saxophone', 'Trombone', 'Clarinet'], category: 'music', intensity: 2 },

  // Music - Intensity 3 (Hard)
  { id: 'tri-music-3-001', question: 'Who composed "The Four Seasons"?', answer: 'Antonio Vivaldi', options: ['Giuseppe Verdi', 'Antonio Vivaldi', 'Johann Strauss', 'George Frideric Handel'], category: 'music', intensity: 3 },

  // Food & Drink - Intensity 1 (Easy)
  { id: 'tri-food-1-001', question: 'What is the capital of Italy?', answer: 'Rome', options: ['Milan', 'Rome', 'Venice', 'Florence'], category: 'food-drink', intensity: 1 },
  { id: 'tri-food-1-002', question: 'What is the main ingredient in guacamole?', answer: 'Avocado', options: ['Lime', 'Avocado', 'Cilantro', 'Onion'], category: 'food-drink', intensity: 1 },
  { id: 'tri-food-1-003', question: 'What type of cuisine is sushi from?', answer: 'Japanese', options: ['Chinese', 'Japanese', 'Thai', 'Korean'], category: 'food-drink', intensity: 1 },
  { id: 'tri-food-1-004', question: 'What is the most consumed beverage in the world?', answer: 'Water', options: ['Tea', 'Coffee', 'Water', 'Beer'], category: 'food-drink', intensity: 1 },
  { id: 'tri-food-1-005', question: 'How many layers does a traditional lasagna have?', answer: '3 or more', options: ['2', '3 or more', '4', '5'], category: 'food-drink', intensity: 1 },

  // Food & Drink - Intensity 2 (Medium)
  { id: 'tri-food-2-001', question: 'What country does champagne come from?', answer: 'France', options: ['Italy', 'Spain', 'France', 'Germany'], category: 'food-drink', intensity: 2 },
  { id: 'tri-food-2-002', question: 'What is the main ingredient in hummus?', answer: 'Chickpeas', options: ['Tahini', 'Chickpeas', 'Garlic', 'Lemon'], category: 'food-drink', intensity: 2 },
  { id: 'tri-food-2-003', question: 'What type of pasta is used to make mac and cheese?', answer: 'Elbow pasta', options: ['Penne', 'Rigatoni', 'Elbow pasta', 'Fusilli'], category: 'food-drink', intensity: 2 },

  // Food & Drink - Intensity 3 (Hard)
  { id: 'tri-food-3-001', question: 'What ingredient is traditional balsamic vinegar made from?', answer: 'Grape must', options: ['Wine', 'Grape must', 'Apple juice', 'Herbs'], category: 'food-drink', intensity: 3 },
];
