import WWHealthCounter from "../js/WWHealthCounter.js";

console.log('IT WORKS!');

Hooks.once('customSystemBuilderReady', () => {
	console.log("Hello there!");
    componentFactory.addComponentType('wWHealthCounter', WWHealthCounter);
});
