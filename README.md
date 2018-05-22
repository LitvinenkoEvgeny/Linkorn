# Boilerplate for simple layout project which includes:
- pug
- puglint
- sass\scss
- babel for transpile es6 code to es5

## Known issues
- webpack spritesmith plugin did not create sprite file in assets properly,
you must manually import sprite.png in your css like so:

````
i
  +sprite($world)
  background-image: url('../img/sprites/sprite.png')
````

