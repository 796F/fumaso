import HelloWorld from './hello/HelloWorld';

const FamousEngine = FamousPlatform.core.FamousEngine;

FamousEngine.init();

var rootNode = FamousEngine.createScene('body');

window.app = new HelloWorld(rootNode);