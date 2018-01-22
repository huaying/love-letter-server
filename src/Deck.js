import Card from './Card';

const shuffle = (arr) => {
  const cloned = [ ...arr ];
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
      ...Array(5).fill(new Card('Guard')),
      ...Array(2).fill(new Card('Priest')),
      ...Array(2).fill(new Card('Baron')),
      ...Array(2).fill(new Card('Handmaid')),
      ...Array(2).fill(new Card('Prince')),
      ...Array(1).fill(new Card('King')),
      ...Array(1).fill(new Card('Countess')),
      ...Array(1).fill(new Card('Princess')),
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
    return null;
  }

  discard() {
    this.deal();
  }
}
