const Fumaso = require('../../');
const View = Fumaso.components.View;

export default class HelloWorld {
  constructor(node) {
    this.redBox = new View(node.addChild());
    this.redBox.createDOMElement({
      properties : {
        backgroundColor : 'red'
      }
    });
    this.redBox
      .setSizeModeAbsolute()
      .setAbsoluteSize(100, 100);
  }
}