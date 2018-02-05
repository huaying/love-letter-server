export default class Player {
  constructor(id) {
    this.id = id;
    this.name = null;
    this.card = null;
    this.lost = false;
    this.isProtected = false;
    this.isReady = false;
  }

  getData = () => {
    return {
      id: this.id,
      name: this.name,
      cardId: this.card ? this.card.id : null, // hidden others' card later
      cardName: this.card ? this.card.name : null,
      isReady: this.isReady,
      isProtected: this.isProtected,
      lost: this.lost,
    }
  }

  setLost() {
    this.lost = true;
  }

  setCard(newCard) {
    this.card = newCard;
  }

  protect() {
    this.isProtected = true;
  }

  unprotect() {
    this.isProtected = false;
  }
}
