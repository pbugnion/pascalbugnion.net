---
contentTitle: Flow types for generators and coroutines
pageTitle: Data diversions | Flow types for generators and coroutines
slug: /blog/flow-typing-generators-coroutines
createdDate: 2018-08-28
lastUpdatedDate: 2018-08-28
summary: Coroutines are becoming more common in JavaScript, with the adoption of async / await. This post describes how to add Flow types to generators and coroutines.
---

Since ECMAScript 6 introduced the `yield` keyword, coroutines have
become more common. The best known example is probably the
`async`/`await` framework for concurrency, but coroutines also form
the backbone of [redux-saga](https://redux-saga.js.org/) and have made
their way into
[bluebird](http://bluebirdjs.com/docs/getting-started.html).

There seems to be little documentation on how to add
[Flow](https://flow.org/en/docs/) types to generators or
coroutines. This post mitigates this by giving many different examples
of typed generators. The code exampes are on
[GitHub](https://github.com/pbugnion/flow-types-for-coroutines).

## Generators vs. coroutines

Coroutines and generators are very different concepts. *Generators*
let you create functions that look like iterators to the consumer.

Coroutines are an extension of the concept of traditional functions.
A function will hand control back to its caller once through the
`return` statement. A coroutine will hand control back any number of
times by calling `yield`. When the coroutine yields, its internal
state is preserved.

The consumer of a generator will *pull* data from the generator as
needed. The caller of a coroutine will *push* data into the coroutine.

Generators and coroutines are very often lumped together because they
use the same underlying machinery. For instance, in Python and
JavaScript, both use the `yield` keyword to hand over control. Both
generators and coroutines can be paused and resumed later.

Despite these similarities, they are used in different contexts:
generators are used to easily create iterators. Coroutines are used to
introduce concurrency or complex control flows.

If you are unfamiliar with coroutines and generators, I have found
[this chapter](http://exploringjs.com/es6/ch_generators.html#sec_overview-generators)
of *Exploring JavaScript* very useful.

## One type to rule them all

Because coroutines and generators use the same underlying machinery, there
is a single generic type in Flow:

```js
Generator<Yield, Return, Next>
```

Here:

- `Yield` is the type of data that is yielded by the generator. If you have
a statement like `yield "my-string"` in your generator/coroutine, 
`Yield` will be `string`.
- `Return` is the type of the generator return statement. If you have a
statement like `return "my-string"`, the type of `Return` will be `string`.
- `Next` is the type of values injected by `yield` into the function. If 
you have a statement like `const nextItem: string = yield`, the type of `Next`
will be `Yield`.

<div class="gatsby-highlight"><pre class="language-js"><span></span><span class="kd">function</span><span class="o">*</span> <span class="nx">example</span><span class="o">:</span> <span class="nx">Generator</span><span class="o">&lt;</span><span class="nx" style="background: rgba(255,0,0,0.2);">string</span><span class="p">,</span> <span class="nx" style="background: rgba(0,255,0,0.2);">boolean</span><span class="p">,</span> <span class="nx" style="background: rgba(0,0,255,0.2);">number</span><span class="o">&gt;</span> <span class="p">{</span>
  <span class="kr">const</span> <span class="nx">toYield</span> <span class="o">=</span> <span class="s1">&#39;this is a string&#39;</span>
  <span class="kr">const</span> <span class="nx" style="background: rgba(0,0,255,0.2);">received</span><span class="o">:</span> <span class="nx">number</span> <span class="o">=</span> <span class="k">yield</span> <span class="nx" style="background: rgba(255,0,0,0.2);">toYield</span>
  <span class="k">return</span> <span class="nx" style="background: rgba(0,255,0,0.2);">false</span>
<span class="p">}</span>
</pre></div>

![](./images/typing-generators-1.jpg)

## Typing generators

Generators publish data. To start simple (and boring), let's create a
generator that publishes even numbers:

```js
function* evens(): Generator<number, void, void> {
  let current = 0;
  while (true) {
    yield current;
    current += 2;
  }
}
```

In this example, we:

- yield numbers
- do not return anything
- do not expect anything to be injected when we yield (there is no
  variable bound to the left of `yield`).

Thus, the type of our generator is `Generator<number, void,
void>`. With generators, the `Next` type parameter is very often
`void`: it is rare to inject values back into the generator (though we
do see lots of contrived examples where people try to restart a
Fibonacci sequence).

Let's try something slightly more complex. We can create a generator that recursively
walks a file tree:

```js
import fs from 'fs'
import path from 'path'

function* walkDirectories(root: string): Generator<string, void, void> {
  for (const name of fs.readdirSync(root)) {
    const filePath = path.join(root, name)
    const stat = fs.lstatSync(filePath)
    if (stat.isFile()) {
      yield filePath
    } else if (stat.isDirectory()) {
      yield* walkDirectories(filePath)
    }
  }
}
```

We read the contents of a root directory and, for each item, publish
it if it is a file, or recursively publish its contents if it is a
directory. We still do not return anything, or bind to the `yield`
statement, so our generator will still be `Generator<?, void,
void>`. We either yield strings directly, or whatever
`walkDirectories` on a subdirectory yields, which is also strings.
The type parameter for `Yield` is therefore `string`, making the 
overall type `Generator<string, void, void>`.

## Typing functions that consume generators

We now have types for our `walkDirectories` function. What about
consumers of our generator? Let's write a function that groups files
by their file extension and counts the number of files for each extension:

```js
function countFilesByExtension(files): {[string]: number} {
  const total = {};
  for (const f of files) {
    const extension = path.extname(f)
    const currentCount = total[extension] || 0
    total[extension] = currentCount + 1
  }
  return total
}
```

Here, the argument `files` is our generator. What is the type of
`files`? We could, of course, type it as:

```js
// overly specific
function countFilesByExtension(files: Generator<string, void, void>): {[string]: number} {
```

or, somewhat better, as:

```js
// still overly specific
function countFilesByExtension(files: Generator<string, any, any>): {[string]: number} {
```

But really, we only care that `files` can be iterated over. It would be
legitimate to pass in an array, for instance. The recommended type to
use is therefore `Iterator`:


```js
function countFilesByExtension(files: Iterator<string>): {[string]: number} {
```

This will work with our generator because `Generator<T, any, any>`
implements the `Iterator<T>` interface. 

We can use the whole pipeline as follows:

```js
import os from 'os'

const rootDirectory = os.homedir()

console.log(
  countFilesByExtension(
    walkDirectories(rootDirectory)
  )
)
```

![](./images/typing-generators-2.jpg)

## Typing coroutines

In programs built around generators, information is pulled by the
consumers. In programs built around coroutines, information is pushed
to the consumer. Let's create a pipeline that prints out the files in
a given directory. We will wrap the asynchronous, callback-based
functions in Node's [`fs`](https://nodejs.org/api/fs.html) module. The
examples in this section are loosely based on the [Generators
section](http://exploringjs.com/es6/ch_generators.html#sec_overview-generators)
of *Exploring JavaScript*.

Commonly, stages in a coroutine pipeline take a `target` argument
that identifies the next stage in the pipeline. Thus, if we have a
function that pushes data of type `T` down the pipeline, the type
signature for that function will be:

```js
function (target: Generator<any, any, T>): void { /* ... */ }
```

Let's start by writing our source function. The source itself is not
typically a coroutine, but it takes a coroutine as target.

We will just use Node's `fs.readdir` to push a list of all the entries
in a given directory to the target:

```js
const pushFiles = function(
  directory: string,
  target: Generator<any, any, string>
): void {
  fs.readdir(
    directory,
    { encoding: 'utf-8' },
    (error, fileNames) => {
      if (error) {
        throw error
      } else {
        for (const fileName of fileNames) {
          const filePath = path.join(directory, fileName)
          target.next(filePath)  // push file paths to a coroutine
        }
      }
    }
  )
}
```

Here, the target must be a `Generator<any, any, string>`: it must
accept strings on the left-hand side of the yield statement. The target
will include a statement like:

```js
const file: string = yield
```

Next, let's create a coroutine that just logs everything passed into it:

```js
const log = function* (): Generator<void, void, any> {
  while (true) {
    const item: any = yield
    console.log(item)
  }
})
```

The type of our coroutine is `Generator<void, void, any>`:

- `Yield` is void since it does not yield anything
- `Return` is void since the function does not return
- `Next` is `any` since it accepts any type from upstream.

Somewhat annoyingly, we cannot use our `log` coroutine directly
without initializing it because the coroutine needs to progress to the
first yield. We need to write:

```js
const logCoroutine = log()
logCoroutine.next() // initialize coroutine

// Read files in home directory and push them to logCoroutine
pushFiles(os.homedir(), logCoroutine)
```

To reduce this boilerplate, it is common to write a helper function
that creates the generator, initializes it by calling its `next`
method and returns it:


```js
function coroutine(generatorFunction) {
  return function(...args) {
    const generator = generatorFunction(...args)
	generator.next()
	return generator
  }
}
```

Typing this helper method is a little tricky. What we really want to
tell Flow is that we return a function with the same type as
`generatorFunction`. We also need to specify that `generatorFunction`
is a function that accepts variadic types and returns a generator. We
can, for instance, write:

```js
function coroutine<G: Generator<any, any, any>>(
  generatorFunction: ((...args: Array<any>) => G)
) {
  return function(...args: Array<any>): G {
    const generator = generatorFunction(...args)
    generator.next()
    return generator
  }
}
```

Here, we specify that `generatorFunction` must be a function that
returns any generator, and that our coroutine function will itself
return function returning that generator. Unfortunately, there is no
good way to type polymorphic variadic functions in Flow (see [this
issue](https://github.com/facebook/flow/issues/1251)) so we lose type
safety in the arguments to `generatorFunction`. We can avoid this
leaking out to the rest of our program by explicitly typing the
coroutines. Our `log` function now becomes:

```js
const log: () => Generator<void, void, any> = coroutine(function* () {
  while (true) {
    const item: any = yield
    console.log(item)
  }
})
```

Thus, by moving the types to `log`, rather than directly on the
argument of `coroutine`, we can use `log` in a type-safe way in the
rest of our program. 

We now don't have to initialize our coroutine to use it any more:

```js
pushFiles(os.homedir(), log())
```

Finally, let's create an intermediate step in our pipeline that filters out anything
that isn't a simple file:

```js
const isFile: (Generator<any, any, string> => Generator<void, void, string>) =
  coroutine(function* (target) {
    while (true) {
      const fileMaybe: string = yield
      fs.lstat(fileMaybe, (error, stat) => {
        if (error) {
          throw error
        } else if (stat.isFile()) {
          target.next(fileMaybe)
        }
      })
    }
  })
```

Our function accepts as its target any coroutine that accepts strings
(since that is what it pushes out). Its return type is `Generator<void, void, string>`:

- `Yield` is void since it does not yield anything
- `Return` is void since the function does not return
- `Next` is `string` since it expects to be fed strings from upstream.

`Generator<void, void, string>` will satisfy the constraint
`Generator<any, any, string>` that we specified on the `target`
argument in `pushFiles`.

We can now build our coroutine pipeline:

```js
pushFiles(os.homedir(), isFile(log()))
```

## Conclusion

Flow is great. It catches a whole slew of errors that unit tests or
manual QA will miss. It also makes the code much more readable to new
users.

Unfortunately, there are few good examples for more complex types. If
you struggle to add flow types to a construct, do write it up so the
community can benefit from it!

## More!

For more information:

The [Flow documentation](https://flow.org/blog/2015/11/09/Generators/)
on generators is useful further reading.

I have already mentioned [Exploring
JavaScript](http://exploringjs.com/es6/ch_generators.html#sec_overview-generators). Code
samples are available on
[GitHub](https://github.com/rauschma/generator-examples/tree/gh-pages/node).

Finally, for a deeper understanding of coroutines in general, David
Beazley has some great
[slides](http://www.dabeaz.com/generators-uk/). These are aimed at
Python but the concepts are very transferable.