import Card from './Card';
import {
  GUARD,
  PRIEST,
  BARON,
  HANDMAID,
  PRINCE,
  KING,
  COUNTESS,
  PRINCESS,
} from './Card';

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
      ...Array(5).fill(new Card(GUARD)),
      ...Array(2).fill(new Card(PRIEST)),
      ...Array(2).fill(new Card(BARON)),
      ...Array(2).fill(new Card(HANDMAID)),
      ...Array(2).fill(new Card(PRINCE)),
      ...Array(1).fill(new Card(KING)),
      ...Array(1).fill(new Card(COUNTESS)),
      ...Array(1).fill(new Card(PRINCESS)),
    ];
    this.shuffle();
    this.discard();
  }

  isEmpty() {
    return this.cards.length === 0;
  }

  shuffle() {
    this.cards = shuffle(this.cards);
  }

  deal() {
    if (this.cards.length > 0) {
      return this.cards.pop();
    }
    return null;
  }

  discard() {
    this.deal();
  }
}
