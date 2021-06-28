---
contentTitle: Scala in production — making your codebase more approachable
pageTitle: Data diversions | making your codebase more approachable
slug: /notes/scala-in-production-2
createdDate: 2019-01-09
lastUpdatedDate: 2019-01-09
summary: Four suggestions to make it easier to onboard new joiners and facilitate knowledge transfer on a Scala codebase.
onTOC: yes
---

This is the second post in a two-part series describing conventions that we have adopted when developing the Faculty platform.

In the [first post](/blog/scala-in-production), we looked at conventions that reduced the likelihood of introducing bugs. In this post, we will look at conventions that make our codebase more approachable for new joiners.

There are many good things about Scala, but approachability is not one of them. It is a language that is hard to learn and even harder to master. 

Despite the difficulty of the language, engineers who have just joined the team start contributing effectively in a relatively short time. This is mostly thanks to pair programming, code reviews and a culture of mutual help. We have also adopted some conventions that make our codebase more approachable. This blog post is about these conventions.

## 1. Avoid premature abstraction

The ability to abstract behaviour is one of the cornerstones of programming. It lets us build complex systems without losing our sanity.

Scala has tremendous abstracting power. This is due in part to how easy it is to write anonymous functions and classes. By easily allowing the definition of [internal DSLs](http://debasishg.blogspot.com/2008/05/designing-internal-dsls-in-scala.html), Scala takes this abstracting power a step further.

Abstraction comes at a cost: to gain a full understanding of a system, you have to switch back and forth between abstraction levels. By design, each abstraction level contains incomplete information about the full behaviour of the system. For instance, if you express behaviour through an internal DSL, to really understand how a program works, you have to look at both the code in the DSL and at the DSL interpreter.

So before you wrap all your side-effects in the free monad, or before you implement an internal DSL to represent business logic, think about whether the abstraction is justified, or whether you are getting misled by a programmer's natural search for elegance. After all, we are paid to write code other people can read, not to scratch intellectual itches.

## 2. Avoid exotic functional constructs

Being a functional language, Scala has a number of libraries that add a menagerie of functional constructs: functors, lenses, monoids etc. These are accompanied by blog posts describing how using them will change your life. These functional constructs can encourage useful abstractions and decoupling, and learning how they work will make you a better programmer.

However, using *exotic* functional constructs (by exotic, I mean constructs that come from functional libraries such as [scalaz](https://github.com/scalaz/scalaz) or [cats](https://typelevel.org/cats/)) makes your codebase significantly less approachable for new joiners. For better or for worse, the majority of programmers come from an object-oriented, imperative world. This, coupled to the difficulty of understanding a new production codebase, makes joining a team that uses Scala more difficult. Adding another layer of complexity by over-using abstract functional constructs would make the barrier to entry too high.

This obviously does not mean we shirk away from functional programming. We make extensive use of functions as first-class citizens, of anonymous classes, of immutable data structures and we separate the data from the code that acts on it. We use monad-like constructs available in the standard library (*options*, *trys*, *futures* and the collection library). We also use all the parsers from the Play framework and anorm. Finally, we use lenses (from  [quicklens](https://github.com/adamw/quicklens)) in tests to generate test data.

There is a useful Pareto rule: by using 20% of the functional toolchain, we get 80% of the value. By being very deliberate about which 20% we use, we can mitigate the barrier to entry for new joiners.

As always, while this has worked for us, your mileage may vary. The only constant is that religiously sticking to dogma will always be a bad thing.

![](./images/scala-in-production-2.jpg)

## 3. Develop a house style to increase consistency

One of [Guido van Rossum](https://en.wikipedia.org/wiki/Guido_van_Rossum)'s most insightful ideas is summarized in the [Zen of Python](https://en.wikipedia.org/wiki/Zen_of_Python) as:

> There should be one — and preferably only one — obvious way to do it

Python experts have a very strong sense of what idiomatic Python looks like. All good Python code looks similar. This makes it easy to discern what a code snippet is trying to achieve without having to think about syntactic quirks. It also reduces the number of arguments about trivial syntactic, layout and quoting issues.

Unlike Python, there are many different ways to write Scala. Idiomatic Scala is much less well-defined than idiomatic Python. We have found it valuable to develop a *house style* that regulates syntax and code layout as well as how code should be structured.

We use the [Play framework](https://www.playframework.com) extensively for web APIs. Play is opinionated about the directory tree structure, how code should be split between models, services and controllers and how tests should be written. Since Play provides many libraries for common tasks (e.g. JSON serialization, database access, making HTTP requests), this naturally encourages consistency. For tasks where Play has no natural library (e.g. symmetric encryption, secure hashing), we have been careful to consistently use the same library across all our microservices.

We are very deliberate about introducing new ideas: for instance, we recently started introducing [lenses](https://github.com/adamw/quicklens) to reduce the number `.copy` calls on case classes when creating test fixtures. We made sure there was sufficient consensus around the idea and then deliberately started introducing lenses in new test code. Pair programming and extensive code reviews help with this.

## 4. Auto-formatting and linting

We value consistency, but we do not want to expend energy and attention in code reviews discussing how to format code.

To make the layout of our code consistent everywhere, we use [scalafmt ](https://scalameta.org/scalafmt/) to autoformat our code, as well as [Scalastyle](http://www.scalastyle.org) and [this linter](https://github.com/HairyFotr/linter).

## Parting words

Having a strong set of conventions that are understood and followed by members of the team will not make a bad team good, but they can make a good team more productive.

A post on convention would be incomplete without Emerson's quote:

> A foolish consistency is the hobgoblin of little minds

Sometimes, breaking a convention is justified. Team members should be familiar with why a convention exists so they know when they can break it.

[&#8606; Previous post](/blog/scala-in-production)
