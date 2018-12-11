import { ClassEvent } from "../utils/ClassEvent";

export class Model extends ClassEvent {
  constructor() {
    super();//chama o constructor do class events

    this._data = {}
  }

  fromJSON(json) {
    this._data = Object.assign(this._data, json);//junta com oque tiver com o objeto, faz um merge
    this.trigger('dataChange', this.toJSON())//cria o evento aqui para outros ouvirem
  }

  toJSON() {
    return this._data;
  }
}