export default class Player {
  constructor(name) {
    this.name = name;
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
