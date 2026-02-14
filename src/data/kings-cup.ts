import type { KingsCupCard } from '../types';

export const kingsCupRules: KingsCupCard[] = [
  {
    value: 'A',
    name: 'Waterfall',
    rule: "Everyone starts drinking. You can't stop until the person to your right stops.",
    explanation: "The person who drew starts drinking. Then the person to their right can start. Each person can only stop when the person to their right stops. The person who drew can stop whenever they want!",
    intensity: 3,
  },
  {
    value: '2',
    name: 'You',
    rule: 'Pick someone to drink',
    explanation: 'Point to anyone in the group. They drink!',
    intensity: 1,
  },
  {
    value: '3',
    name: 'Me',
    rule: 'You drink',
    explanation: 'The person who drew this card takes a drink.',
    intensity: 1,
  },
  {
    value: '4',
    name: 'Floor',
    rule: 'Everyone touches the floor. Last person drinks.',
    explanation: 'As soon as this card is revealed, everyone must touch the floor. The last person to touch the floor takes a drink.',
    intensity: 2,
  },
  {
    value: '5',
    name: 'Guys',
    rule: 'All guys drink',
    explanation: 'Everyone who identifies as a guy takes a drink.',
    intensity: 1,
  },
  {
    value: '6',
    name: 'Chicks',
    rule: 'All girls drink',
    explanation: 'Everyone who identifies as a girl takes a drink.',
    intensity: 1,
  },
  {
    value: '7',
    name: 'Heaven',
    rule: 'Point to the sky. Last person drinks.',
    explanation: 'As soon as this card is revealed, everyone must point up to the sky. The last person to point up takes a drink.',
    intensity: 2,
  },
  {
    value: '8',
    name: 'Mate',
    rule: 'Pick a drinking buddy',
    explanation: 'Choose someone to be your mate. For the rest of the game, whenever you drink, they drink. And whenever they drink, you drink!',
    intensity: 2,
  },
  {
    value: '9',
    name: 'Rhyme',
    rule: 'Pick a word. Go around rhyming. First to fail drinks.',
    explanation: 'The person who drew picks a word. Going around the circle, everyone must say a word that rhymes. No repeats! First person to hesitate too long or mess up drinks.',
    intensity: 2,
  },
  {
    value: '10',
    name: 'Categories',
    rule: 'Pick a category. Go around naming things. First to fail drinks.',
    explanation: 'The person who drew picks a category (types of beer, countries, pizza toppings, etc.). Going around the circle, everyone must name something in that category. No repeats! First person to hesitate or mess up drinks.',
    intensity: 2,
  },
  {
    value: 'J',
    name: 'Make a Rule',
    rule: 'Create a new rule everyone must follow',
    explanation: 'Make up a rule that everyone must follow for the rest of the game. Examples: no pointing, no saying names, no swearing, drink with your left hand, etc. Anyone who breaks the rule drinks!',
    intensity: 2,
  },
  {
    value: 'Q',
    name: 'Question Master',
    rule: 'You are the Question Master until someone else draws a Queen',
    explanation: 'You are now the Question Master! If you ask someone a question and they answer it, they have to drink. The trick is to catch people off guard. This lasts until someone else draws a Queen.',
    intensity: 2,
  },
  {
    value: 'K',
    name: 'King',
    rule: 'Pour some of your drink into the Kings Cup',
    explanation: 'Pour some of your drink into the Kings Cup in the middle. Whoever draws the 4th (final) King has to drink the entire Kings Cup. Good luck!',
    intensity: 3,
  },
];

// Suits for visual representation
export const suits = ['♠', '♥', '♣', '♦'] as const;
export type Suit = typeof suits[number];

// Generate a full deck
export function generateDeck(): Array<{ value: string; suit: Suit; id: string }> {
  const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  const deck: Array<{ value: string; suit: Suit; id: string }> = [];

  values.forEach(value => {
    suits.forEach(suit => {
      deck.push({
        value,
        suit,
        id: `${value}${suit}`,
      });
    });
  });

  // Shuffle the deck
  return deck.sort(() => Math.random() - 0.5);
}

// Get rule for a card value
export function getRuleForCard(value: string): KingsCupCard | undefined {
  return kingsCupRules.find(rule => rule.value === value);
}
