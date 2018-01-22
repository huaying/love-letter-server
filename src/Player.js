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
      card: this.card ? this.card.id : null, // hidden others' card later
      isReady: this.isReady,
    }
  }

  setLost() {
    this.lost = true;
  }

  setProtected() {
    this.isProtected = true;
  }

  unsetProtected() {
    this.isProtected = false;
  }
}
