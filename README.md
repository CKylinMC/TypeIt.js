# TypeIt.js
Simple typing visual effect for webpages write in vanilla javascript. (for learning)

## Usages

The first thing is import this script into your page.

CDN:

**jsDelivr**

```html
<script src="https://cdn.jsdelivr.net/gh/CKylinMC/TypeIt.js@main/typeit.js"></script>
```

**Statically**

```html
<script src="https://cdn.staticaly.io/gh/CKylinMC/TypeIt.js/main/typeit.js"></script>
```

The script file is very small, and you can import it before your body tag instead of import after you body part to get better experiences.

### 1. Just type it forward

Just add `data-typeit` to any element you want to add this effect like:

```html
<h2 data-typeit class="typeit">TypeIt.js Demo</h2>
```

And you can add `data-typeit-speed` to control the speed:

```html
<h2 data-typeit data-typeit-speed="30" class="typeit">TypeIt.js Demo</h2>
```

The name of the speed property seems be confusing, it actually saying "delay".

### 2. One line typing

You need to create a TypeIt class instance to controll your element.

First, you need a container:

```html
<span id="typeit"></span>
```

You can write anythin into it and they will be cleared when script start to "type it".

Then write script like below:

```javascript
new TypeIt('#typeit', {
    text: "Hello World!",
}).start();
```

Then it will start to "type it".

### 3. Multi-line typing

Just simply extend the script using in one line typing, change `text` property to an array of all you want to say, and add one `mode` property with one of "`loop`", "`forwards`" and "`random`".

```javascript
new TypeIt('#typeit', {
    text: [
        "Hello World!",
        "This is a simple string.",
        "This is another string.",
        "This is a third string."
    ],
    mode: "random"
}).start();
```

### 4. Typing speed controll

There are some properties to controll the speed.

The name of property seems be confusing, it actually saying "delay".

The final speed will be calculated as this:

```
TypeSpeed = StaticSpeed(speed) + RandomSpeed(randomRange)
```

For example:

```javascript
new TypeIt('#loop', {
    text: [
        "Hello World!",
        "This is a simple string.",
        "This is another string.",
        "This is a third string."
    ],
    mode: "loop",
    speed: 20,
    randomRange: [50,100]
}).start();
```

This example setted 20 as static delay and 50~100 as random delay, so each letter will have 70~120 delay.

And when TypeIt meet an space or line-breaker, it will read `stutterSpace` property value, add it into normal letter delay value.

### 5. Line switching speed controll

Each line will have an unique delay time setting with `lineGag` property defaults with 2 seconds(2000 ms). To change it, just add this property and specify a new value.

```javascript
new TypeIt('#loop', {
    text: [
        "Hello World!",
        "This is a simple string.",
        "This is another string.",
        "This is a third string."
    ],
    mode: "loop",
    lineGag: 5000
}).start();
```

### 6. Callback functions

TypeIt could call for some callback functions after typing. For one line typing, callback will be called after all letter were typed into element. For multi-line typing, callback will be called for each times the hole line was typed.

To register a callback function, you need to get the TypeIt instance, and use the `onDone(...)` method.

```javascript
const instance = new TypeIt('#loop', {
    text: [
        "Hello World!",
        "This is a simple string.",
        "This is another string.",
        "This is a third string."
    ],
    mode: "loop",
    lineGag: 5000
});
instance.onDone(()=> console.log("I'm done!"));
instance.start();
```

### 7. Stop

Make it stop typing is easy, just set the stage value to stop:

```javascript
// const instance = new TypeIt(...);
// instance.start();

instance.stage = "stop"; // Just stop after current loop.
```

### 8. Override the styles

To override the styles, just define the styles by specified class name your self.

* All typing text will have classname `typeit-text`
* The cursor will have classname `typeit-cursor`
* The typing element will have classname `typeit-typing`

------
That's basically all the features TypeIt.js currently have. Check out the simple demo at [here](https://ckylinmc.github.io/TypeIt.js/)
