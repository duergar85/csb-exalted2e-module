import WWHealthCounter from "../js/WWHealthCounter.js";

Hooks.once('init', () => {
	console.log("CBS WW Health Counter | Module is loading...");
    componentFactory.addComponentType('wWHealthCounter', WWHealthCounter);
	console.log("CBS WW Health Counter | Module is loaded!");
});
