export default class Player {
  constructor(id) {
    this.id = id;
    this.name = null;
    this.card = null;
    this.lost = false;
    this.isProtected = false;
    this.isReady = false;
  }

  static data = () => {
    return {
      id: this.id,
      name: this.name,
      card: this.card, // hidden others' card later
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
