export default class Player {
  constructor(id) {
    this.id = id;
    this.card = null;
    this.lost = false;
    this.isProtected = false;
    this.isReady = false;
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
