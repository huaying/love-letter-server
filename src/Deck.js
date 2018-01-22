import Card from './Card';

const shuffle = (arr) => {
  const cloned = { ...arr };
  cloned.forEach((_, i) => {
    const idx = Math.floor(Math.random() * (i + 1));
    [cloned[i], cloned[idx]] = [cloned[idx], cloned[i]];
  })
  return cloned;
}

export default class Deck {
  constructor() {
    this.cards = [];
  }

  setup() {
    this.cards = [
      ...Array(5).fill(Card('Guard')),
      ...Array(2).fill(Card('Priest')),
      ...Array(2).fill(Card('Baron')),
      ...Array(2).fill(Card('Handmaid')),
      ...Array(2).fill(Card('Prince')),
      ...Array(1).fill(Card('King')),
      ...Array(1).fill(Card('Countess')),
      ...Array(1).fill(Card('Princess')),
    ];
    this.shuffle();
    this.discard();
  }

  shuffle() {
    this.cards = shuffle(this.cards);
  }

  deal() {
    if (this.cards.length > 0) {
      return this.cards.pop()
    }
  }

  discard() {
    this.deal();
  }
}
