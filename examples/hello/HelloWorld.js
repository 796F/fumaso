const Fumaso = require('../../');
const View = Fumaso.components.View;

export default class HelloWorld {
  constructor(node) {
    this.redBox = new View(node.addChild());
    this.redBox.createDOMElement({
      content : 'click me',
      properties : {
        backgroundColor : 'red'
      }
    });
    this.redBox
      .setSizeModeAbsolute()
      .setAbsoluteSize(100, 100)
      .setMountPoint(0.5, 0.5)
      .setAlign(0.5, 0.5);

    this.redBox.on('click', () => {
      this.redBox.setDOMContent('clicked:' + Date.now());
    });
  }
}