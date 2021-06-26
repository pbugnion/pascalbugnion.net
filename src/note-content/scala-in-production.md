---
contentTitle: Scala in production — four conventions for safer programs
pageTitle: "Data diversions | Four conventions for safer Scala programs"
slug: /notes/scala-in-production
createdDate: 2019-01-06
lastUpdatedDate: 2019-01-06
summary: Four conventions that make Scala programs safer and easier to maintain.
onTOC: yes
---

The backend of the Faculty platform is written in Scala. Practically, this means we have spent most of the last three years writing Scala microservices with the [Play framework](https://www.playframework.com/).

When we first started development in Scala, I had some misgivings about whether it was the right choice: would it be difficult to hire developers? Would everyone require a lot of training? Was it just satisfying a personal itch? Three years on, I am much more convinced that Scala was a good choice.

We, as a team, have adopted a set of conventions that help us write programs that are less wrong and easier to understand. This is the first of a two-part series on these conventions. 

In this post, we will focus on writing code that is less wrong. In the [next post](/blog/scala-in-production-2), we describe some conventions that we have adopted to make our code more approachable.

## We need all the help we can get

Some languages make it easy to write code. Others make it hard to write wrong code. Scala definitely falls into the latter category. There is a barrier to entry but, like many other functional languages, once you have a program that satisfies the compiler, there is a chance that it works as intended.

When writing code for production, the later a bug is caught, the [harder catching and fixing that bug is](https://stevemcconnell.com/articles/software-quality-at-top-speed/). Minimizing the probability of bugs is therefore more important than writing that code quickly. It pays to have a language that makes it easy to catch bugs early on, hence why we think Scala is a good fit for us.

There are a few different reasons that make Scala a safe language. Scala provides a rich type system checked by the compiler. By supplementing type checks with an extensive test suite, we can be confident that our code works as intended, including in code paths that are rarely exercised. We have consistently found that the few errors that make it to production are logical errors due to a poorly thought-out implementation, not "stupid" mistakes made when writing the code.

A second reason for Scala's safety is the availability of mature libraries written for the JVM. Using these libraries means that we have to write less code, which means we hopefully write less wrong code.

Most programs that power a sufficiently complex system have elements of concurrency. While this is a good thing for users, it makes life much harder for developers. Scala has high-level concurrency abstractions like [futures](https://danielwestheide.com/blog/2013/01/16/the-neophytes-guide-to-scala-part-9-promises-and-futures-in-practice.html), [actors](https://doc.akka.io/docs/akka/current/guide/introduction.html?language=scala) and [reactive extensions](https://doc.akka.io/docs/akka/current/stream/stream-introduction.html). It also has a strong focus on immutability. These make it harder to write buggy concurrent code by introducing race conditions or deadlocks.

While we think of Scala as a safe language, we have adopted conventions that further minimize the probability of mistakes. We will outline these in the next few sections.

## 1. Wrap simple types

Rather than passing basic types (e.g. `String` or `Int`) around, we prefer to wrap the type in a case class. For instance, replacing function definitions like:

```scala
def createUser(username: String, password: String, emailAddress: String)
```

with:

```scala
def createUser(username: Username, password: Password, emailAddress: EmailAddress)
```

with types defined as:

```scala
case class Username(value: String)

case class Password(value: String)

case class EmailAddress(value: String) {
  require("check for valid email address")
}
```

This adds type safety: it reduces the risk of inverting the arguments. It also adds discoverability and makes the code more self-documenting.

This has the fringe benefit of encapsulating how the objects are stored: if we wanted to switch how email addresses are stored to a (username, host) pair, we would only need to modify code that creates email addresses and code that consumes them, not code that just passes them around.

![](./images/scala-in-production-1.jpg)

## 2. Use sum types for return values

Often, there are multiple termination conditions for a function. For instance, creating a user might fail because the username or email is already taken, or because the proposed password is too short. We have found that a good way to encode this information is to return a particular value of a [sum type](http://tpolecat.github.io/presentations/algebraic_types.html#11):

```scala
def createUser(
  username: Username, 
  password: Password,
  emailAddress: EmailAddress
): CreateUserResult
```

where `CreateUserResult` is a sum type that can represent all the different termination conditions of `createUser`:

```scala
sealed trait CreateUserResult

object CreateUserResult {
  case class Success(user: User) extends CreateUserResult
  case class PasswordValidationFailed(reason: String) extends CreateUserResult
  case class UsernameAlreadyExists() extends CreateUserResult
  case class EmailAlreadyExists() extends CreateUserResult
}
```

The consumer can then pattern match on the result:

```scala
createUser(username, password, emailAddress) match {
  case CreateUserResult.Success(user) => Ok(Json.toJson(user))
  case CreateUserResult.PasswordValidationFailed(reason) => BadRequest()
  case CreateUserResult.UsernameAlreadyExists() => Conflict()
  case CreateUserResult.EmailAlreadyExists() => Conflict()
}
```

By encoding the possible behaviours of `createUser` into the type system, we make it easy to write consumers. Since the compiler checks that pattern matches against sealed traits is exhaustive, it also makes it harder to forget to handle a particular scenario.

## 3. Avoid throwing exceptions

We avoid throwing bare exceptions. Encoding all the information in the return type of a method makes it easier to write clients: you need to know less about the internals of the method.

Obviously, you often need to write code that has unexpected failure cases: network requests might fail, a remote server might return a badly formatted payload etc. To handle the case of a generic unexpected error, we use simple monad-like types from the standard library, such as `Try` or `Future`.

```scala
def createUser(
  username: Username, 
  password: Password, 
  emailAddress: EmailAddress
): Try[CreateUserResult]
```

This forces the consumer to think about the failure case:

```scala
createUser(username, password, emailAddress) map {
  // successful or expected error case
  case CreateUserResult.Success(user) => Ok(Json.toJson(user))
  case CreateUserResult.PasswordValidationFailed(reason) => BadRequest()
  case CreateUserResult.UsernameAlreadyExists() => Conflict()
  case CreateUserResult.EmailAlreadyExists() => Conflict()
} getOrElse {
  // unexpected error case
  log.error("Boom!")
  InternalServerError()
}
```

## 4. Wrap unsafe libraries

One of the strengths of Scala is the wealth and maturity of libraries available for the JVM. The majority of these libraries target Java rather than Scala directly. They will often have behaviour that is idiomatic in Java, rather than Scala. We wrap these external libraries in a class that presents an idiomatic Scala interface.

For instance, the [AWS Java SDK](https://aws.amazon.com/sdk-for-java/) does not play well with Scala programs because it returns Java collections and throws exceptions. We wrap it in a class that converts Java types to Scala types and wraps code likely to throw exceptions in a future:

```scala
import scala.collection.JavaConverters._

import com.amazonaws.services.s3.AmazonS3ClientBuilder
import com.amazonaws.services.s3.AmazonS3

object S3AccessService {
  val s3 = AmazonS3ClientBuilder.defaultClient()

  def listBuckets(): Future[List[S3Bucket]] = Future { 
    val allBuckets = s3.listBuckets().asScala.toList
  }
}
```

## Parting words

These conventions have worked well for us because each mitigates a real pain that we felt before adopting it. They may well not apply to you. Finally, while having a clear set of conventions is useful, they result in incremental improvements. A good team is good because of the people and the team dynamics, not the tools they use or the conventions they adopt. 

[Next post &#8608;](/blog/scala-in-production-2)
