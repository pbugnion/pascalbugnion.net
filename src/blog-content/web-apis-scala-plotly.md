---
contentTitle: Using Plotly as a lightweight, append-only database
pageTitle: Data diversions | Plotly as an append-only database
slug: /blog/plotly-as-lightweight-database
createdDate: 2016-02-23
lastUpdatedDate: 2016-02-23
summary: We often need to keep track of quantities that evolve over time, like stock prices or weather data. This post describes how to use Plotly as a lightweight, append-only database for keeping track of this data. We query the price of Google stock every hour and send the results to Plotly.
---

*Acknowledgements: the original idea of using Plotly as a lightweight database should be credited to my [CTO](https://github.com/brookesey) and [Robbie](http://roygbiv.co.uk), an engineer at the ASI. [Scott](https://scott.stevenson.io), a current ASI fellow, also helped flesh out the idea.*

The real world is full of quantities that evolve continuously: stock price, weather data, betting odds, the health of systems that we monitor. How can we keep track of this information?

Let's start with a concrete example. We want to monitor the value of the Google stock price (I know, you can get historical data on stocks quite easily, so this is a bit artificial). One solution is to build a custom web application that gets the stock price every minute or every hour and saves it to a database along with a timestamp. The application could then offer a D3 graph of the stock price when queried from a web browser. If you are interested in going down this route, you could use the Play framework. The code examples of chapter 14 of [Scala for data science](http://www.scala4datascience.com/about.html) should be enough to get you started.

This is a fairly heavy approach, though: you have to build a fully-fledged web application, connect it to a database, and deploy it and maintain it. In this post, I will look at [Plotly](https://plot.ly), a platform that offers *plotting as a service*. The cool part is that we can use it as both a *database* to keep track of small amounts of tabular data, and as a way of visualizing and sharing this data. We will build an application that queries the [Markit on Demand](http://dev.markitondemand.com/MODApis/) for the Google stock price every hour and sends the results to a Plotly graph:

<iframe width="100%" height="600" frameborder="0" scrolling="no" src="https://plot.ly/~pbugnion/28.embed?link=false"></iframe>

*Caveat emptor*: this post assumes that you are familiar with Scala futures, including future composition. If you are not, I highly recommend Daniel Westheide's [blog](http://danielwestheide.com/blog/2013/01/09/the-neophytes-guide-to-scala-part-8-welcome-to-the-future.html), Aleksandar Prokopec's [book](http://www.amazon.co.uk/Learning-Concurrent-Programming-Aleksandar-Prokopec/dp/1783281413) on concurrent programming in Scala, or chapter four of my [book](http://www.amazon.co.uk/Scala-Data-Science-Pascal-Bugnion/dp/1785281372/ref=sr_1_1?s=books&ie=UTF8&qid=1456082848&sr=1-1&keywords=scala+for+data+science).

The full code example for this blog post is available on [GitHub](https://github.com/pbugnion/google-stock-price).

## Plotly: a very quick introduction

[Plotly](https://plot.ly/feed/) is a *plotting as a service* provider: it lets you plot and host graphs within Plotly and share them with other people. Besides actually displaying a graph, it also maintains a record of the data backing it. You can view the data in a spreadsheet, or download it as a CSV or JSON.

You can interact with Plotly either manually through the web UI or programmatically with a web API. When entering data through their web API, you can append data to an existing graph. This lets us use Plotly as a very lightweight, append-only *database*. As an added bonus, we can trivially visualize all our data.

Plotly therefore ticks all our boxes. We can query the Markit on Demand API every hour to get an update for the Google stock price and send that new point to Plotly. Plotly will happily append this point to our data table. We can generate a graph from this table and embed it in web-pages to have a plot that is updating continuously. If we want to retrieve the data at a later date, we can either download a CSV through the Plotly website, or through the API.

Now that we have an idea of what to do, let's write some code!

## Interacting with web APIs: an introduction

We will get the Google stock price from the [Markit On Demand](http://dev.markitondemand.com/MODApis/) API, which offers stock price quotes updated hourly. The API accepts HTTP GET requests and returns an XML document. For a sample response, follow this link in your browser:
[http://dev.markitondemand.com/MODApis/Api/v2/Quote?symbol=GOOGL](http://dev.markitondemand.com/MODApis/Api/v2/Quote?symbol=GOOGL).

This returns an XML document with the current value of the Google stock price:

```xml
<StockQuote>
  <Status>SUCCESS</Status>
  <Name>Alphabet Inc</Name>
  <Symbol>GOOGL</Symbol>
  <LastPrice>706.05</LastPrice>
  ...
</StockQuote>
```

We will use the [scalaj-http](https://github.com/scalaj/scalaj-http) library to formulate HTTP requests programatically from Scala. We will also need to parse the XML response, which we can do with the [scala-xml](https://github.com/scala/scala-xml) library. Let's declare these dependencies in our `build.sbt` file.

```scala
// build.sbt

scalaVersion := "2.11.7"

libraryDependencies ++= Seq(
  "org.scalaj" %% "scalaj-http" % "2.2.1",
  "org.scala-lang" % "scala-xml" % "2.11.0-M4"
)
```

We can now formulate HTTP GET requests to fetch the price of Google stock. We wrap the code for fetching the stock price in a trait:

```scala
trait StockFetcher {

  // Abstract parameter defining which stock we fetch.
  def stockSymbol: String

  // Fetch the price corresponding to `stockSymbol`
  def stockPrice = ...
}
```

Our `StockFetcher` trait exposes an abstract variable, `stockSymbol`, describing which stock we want to fetch. The stock symbol for Google stock, for instance, is `"GOOGL"`. The trait exposes a single concrete method, `stockPrice`, which fetches the value of the stock.

Let's start by formulating the request to fetch the current value of the Google stock. We want to hit the
URL `http://dev.markitondemand.com/MODApis/Api/v2/Quote` and pass the stock symbol as a parameter in the query string:

```scala
import scalaj.http.{ Http, HttpRequest }

private def request: HttpRequest =
  Http("http://dev.markitondemand.com/MODApis/Api/v2/Quote")
    .param("symbol", stockSymbol)
```

This creates an `HttpRequest` instance describing a GET request, but does not query the API. We can dispatch the request with the `.asString` method, which tells `scalaj-http` to send the request and to convert the response body to a Scala string.

Whenever you query a web API, or perform a time-consuming I/O operation, you should consider wrapping that operation in a future. The code in the future is executed in a separate thread, leaving the main application thread free to get on with other stuff instead of waiting for the API to respond. We will therefore make the `stockPrice` method return a `Future` containing the stock price as a `BigDecimal`:

```scala
import scala.concurrent._
import scala.concurrent.ExecutionContext.Implicits.global
import scala.xml.XML

def stockPrice: Future[BigDecimal] = {
  val strResponse = Future { request.asString }
  ...
  price
}
```

We now have our HTTP response wrapped in a future. To extract the price from the response, we can use future composition to register transformations that occur when the response comes back from the API. This lets us define an entire pipeline that is executed asynchronously when the API responds to our query. With these, our `stockPrice` method is now:

```scala
def stockPrice: Future[BigDecimal] = {
  val strResponse = Future { request.asString }
  val xmlResponse = strResponse.map { s => XML.loadString(s.body) }
  val priceAsString = xmlResponse.map { r =>  (r \ "LastPrice").text }
  val price = priceAsString.map { price => BigDecimal(price) }
  price
}
```

Futures also provide fault tolerance: if any step in the pipeline fails, the return value of `stockPrice` will be a failed future. This avoids us having to worry about wrapping calls in `try` / `catch` blocks.

So our query is happily proceeding asynchronously, in the background. We can assign a callback that is executed at the end of the pipeline using the `onComplete` method. Let's write a driver program that uses our `StockFetcher` trait to query the web API and print the result to screen.

```scala
// GooglePriceFetcher.scala

import scala.util.{ Success, Failure }
import scala.concurrent.ExecutionContext.Implicits.global

object GooglePriceFetcher extends App {

  // Instantiate the trait
  val fetcher = new StockFetcher {
    val stockSymbol = "GOOGL"
  }

  // Create the future
  val priceFuture = fetcher.stockPrice

  // Called when 'priceFuture' completes
  priceFuture.onComplete {
    case Success(price) => println(s"Stock price: $price")
    case Failure(error) =>
      println(s"Error querying Markit on demand API: $error")
  }

}
```

If you run this in SBT, you will notice that the program finishes before the API calls have had a chance to complete. This is because all the computation happens in a separate thread of execution: the main thread's only responsibility is to create the initial futures. When the main thread is done, it just shuts down the program, even if other threads are still working in the background. Ultimately, this will not be a problem because the main thread will carry on running until we interrupt it manually. For now, however, it is useful to stop the main thread from exiting early. We can insert an `Await.ready` call to block until the future returns:

```scala
import scala.concurrent.Await
import scala.concurrent.duration._

Await.ready(priceFuture, 10.seconds)
```

This blocks the main thread until `priceFuture` finishes. The second argument to `Await.ready` indicates a timeout: if the future fails to complete in that time, a time-out exception is thrown.

We now have working code for fetching the Google stock price.

## Sending data to Plotly

Now that we can query the stock price, the next step is to attach a time stamp to this stock price and send it to Plotly. Plotly exposes an API to which you can send POST requests for interacting with graphs. The API offers many features for manipulating both the data and the style and layout of graphs.

We first need to generate an API key to access Plotly programatically. If you do not have a Plotly account yet, create one through the [web interface](https://plot.ly/feed/). Then, generate an API key by clicking on your username in the top-right corner of the screen, selecting *Settings* followed by *API keys*. This should generate an alphanumeric string.

We will encapsulate the code for sending data to Plotly in a trait:

```scala
// PlotlyWriter.scala

import org.joda.time.Instant

trait PlotlyWriter {

  // Abstract attributes to override when instantiating the trait
  def username: String
  def key: String
  def plotName: String

  // Write a (time, price) pair to the plot
  def write(time: Instant, price: BigDecimal): Future[HttpResponse[String]] = ...
}
```

Our trait exposes abstract attributes describing what account and plot to connect to, and a single public method, `write`, that appends a (*time*, *price*) pair to that plot. The `write` method dispatches a POST request containing the new point to Plotly. We return a future that will eventually contain the Plotly API response.

Our trait expects the timestamp to be a [Joda Time](http://www.joda.org/joda-time/) `Instant`, so we will to add a dependency on Joda Time to our `build.sbt` file:

```scala
libraryDependencies ++= Seq(
  "joda-time" % "joda-time" % "2.9.2",
  "org.scalaj" %% "scalaj-http" % "2.2.1",
  "org.scala-lang" % "scala-xml" % "2.11.0-M4"
)
```

If you have not used Joda time yet, you should definitely consider using it over the native Java `Date` instances. It offers a much nicer API. Obviously, we cannot pass Joda time instances directly to Plotly, so we will need to convert our `Instant` to a string. Let's write a method to convert a Joda time instant into a string that Plotly understands (I discovered the correct format mostly through trial and error):

```scala
import org.joda.time.format.DateTimeFormat

private def instantToPlotlyString(time: Instant): String = {
  val fmt = DateTimeFormat.forPattern("yyyy-MM-dd HH:mm")
  time.toString(fmt)
}
```

Let's now write a helper method to compose the request. The request will take, as argument, a *time*, *price* pair of values and return an `HttpRequest` instance ready to be fired.

The entire Plotly API resides at a single end-point, `/clientresp`, which must be queried with POST requests. We write what we want the API to do in the post body. Note that this goes against suggested best practice when designing an API: each end-point should really offer access to a single resource.

The query to the API must be encoded as a *form*. [Form-encoding](https://en.wikipedia.org/wiki/POST_(HTTP)#Use_for_submitting_web_forms) is a popular way of formatting the body of POST requests as a set of key-value pairs.

Some of the form fields expected by Plotly relate to authentication:

 - `un`: your Plotly username
 - `key`: the API key that we generated

Some of the fields relate to what we want Plotly to do:

 - `origin`: the *method* that we are calling. We will only use `"plot"` here, which allows us to add data to a new or to an existing plot. Other methods affect the style of a plot or the layout.
 - `args`: JSON array of arguments. The format these take depend on the value of `origin`. We pass the data series to be plotted as arguments.
 - `kwargs`: more arguments, passed as key-value pairs in the form of a JSON object. We pass the plot name as a keyword argument.

Users familiar with Python will note the similarity of the naming convention for the API with calling a function in Python. The final key that we must pass is `platform`, which is required but does not seem to affect the API call itself. We will just pass this as `scala`.

```scala
import scalaj.http.{ Http, HttpRequest, HttpResponse }

private val plotlyUrl = "https://plot.ly/clientresp"

private def request(time: Instant, value: BigDecimal): HttpRequest = {
  val timeStr = instantToPlotlyString(time)
  val request = Http(plotlyUrl).postForm(Seq(
    "un" -> username,
    "key" -> key,
    "origin" -> "plot",
    "platform" -> "scala",
    "args" -> s"""[ ["$timeStr"], [$value] ]""",
    "kwargs" -> s""" { "filename": "$plotName", "fileopt": "extend", "traces": [0] }"""
  ))
  request
}
```

We start by creating an initial request using the `Http` factory function and transform it to a POST request by calling the `postForm` method. The `postForm` method takes a sequence of key-value pairs as arguments, and composes the request body as a form-encoded string from these pairs. It automatically sets the content type.

The values that we pass in our form should all be fairly self-explanatory, apart from the `args` and `kwargs` values. The value of `args` should be a JSON-array like string representing sequences of *x*, *y* arrays. Thus, our request will instruct Plotly to append the sequence `["$timeStr"]` to the *x* values on our plot, and `[$value]` to the *y* values on our plot. We could have specified more than one *x*, *y* pair with: `[ [x0, x1], [y0, y1] ]`. Refer to the Plotly documentation for additional ways of specifying the data to be plotted.

The value corresponding to `kwargs` must be a JSON object-like string. By passing the `extend` keyword to `fileopt`, we specify that we want to append data to an existing plot, rather than overwriting it. The `traces` argument indicates which trace (which series) on the plot we want to append data to. This might be useful if we were plotting more than one line.

Now that we have a method to create the request, all that our `write` method needs to do is to dispatch this request to Plotly:

```scala
import scala.concurrent.Future
import scala.concurrent.ExecutionContext.Implicits.global

def write(time: Instant, value: BigDecimal): Future[HttpResponse[String]] =
  Future { request(time, value).asString }
```

## Securing credentials

We now have a trait with all the functionality ready for appending to a Plotly plot. Our `PlotlyWriter` trait has three abstract attributes: the username, the API key and the name of the plot to append to. The username and plot can easily be hard-coded, or passed through the configuration. We will inject the key through an environment variable. Using environment variables for credentials is a common pattern in application development.

To create an environment variable in the current shell session, you can just write:

```none
$ export PLOTLY_KEY=fjsdkl...
```
This only affects the current shell session. To add the key permanently, you must write that line in your `.bashrc` file (or `.profile` file on a Mac).

We can access environment variables in Scala with the `sys.env` map. Thus, we can instantiate our `PlotlyWriter` trait like this:

```scala
val writer = new PlotlyWriter {
  val username = "pbugnion"
  val plotName = "google-stock-price"
  val key = sys.env.getOrElse("PLOTLY_KEY",
    throw new IllegalStateException("Expected PLOTLY_KEY environment variable")
  )
}
```

This will attempt to read the environment variable `PLOTLY_KEY` and throw an exception if it is missing.

## Bringing it all together

We now have a trait for fetching the Google stock price from the Markit on Demand API, and a trait for sending that stock price to Plotly. Our `stockPrice` method for fetching the current value of the stock returns a `Future[BigDecimal]`. Our `write` method takes a `BigDecimal` and returns a `Future[HttpResponse]`. We want the `write` method to execute when the future containing the response of the Markit on Demand API completes, provided it was successful.

We can compose a future with a function returning another future using `.flatMap`:

```scala
import org.joda.time.Instant

// Fetch the stock price
val priceFuture = fetcher.stockPrice

// When the stock price arrives, forward it to Plotly
val plotlyResponse = priceFuture.flatMap { stockPrice =>
  writer.write(Instant.now, stockPrice)
}
```

The value `plotlyResponse` is now a Future holding the response of the Plotly API, if everything was successful. If the pipeline failed at any stage, `plotlyResponse` will hold the exception that was raised.

For better reporting, we can bind callbacks to different stages of the pipeline. This will give us insight into the pipeline, giving us greater granularity if the pipeline fails:

```scala
// Callbacks to print information about the API calls.
priceFuture.onComplete {
  case Success(price) => println(s"Stock price: $price")
  case Failure(error) =>
    println(s"Error querying Markit on demand API: $error")
}

plotlyResponse.onComplete {
  case Success(response) =>
    println(s"Plotly status code: ${response.code}")
    println(response.body)
  case Failure(error) =>
    println(s"Error sending results to Plotly: $error")
}
```

Finally, we must change the call to `Await.ready` to wait on `plotlyResponse`:

```scala
Await.ready(plotlyResponse, 10.seconds)
```

## Regular code execution in Scala

We now have all the code in place to add a single point to our Plotly chart. However, we really want to query the APIs periodically (once an hour, for instance). There are a few options for this:

 - we could rely on operating system utilities, like [cron](https://en.wikipedia.org/wiki/Cron), to handle the scheduling. While this has the advantage of keeping our code relatively simple, it shifts some of the burden onto deployment: we must now configure the cron job appropriately to make sure everything runs, and we cannot maintain state across several runs. This also involves the overhead of starting the JVM for every code invocation.

 - we can write a single, long-running Scala script that handles the scheduling itself. We will go down this route because it facilitates deployment and gives us much more scheduling flexibility. For instance, we could decide to stop querying the APIs if we have more than a certain number of failures in a row.

We must therefore decide on a scheduler technology. While Akka provides a scheduler, importing Akka just for the scheduler seems unnecessary. We will use the Java [scheduled executor service](https://docs.oracle.com/javase/7/docs/api/java/util/concurrent/ScheduledExecutorService.html) class instead, an executor service that executes a runnable at a specified interval. This reduces the number of dependencies.

The `ScheduledExecutorService` trait exposes a `scheduleAtFixedRate` method that allows a piece of code to be run at certain interval. We will use a concrete implementation of `ScheduledExecutorService` that runs its tasks in a separate thread.
To use the scheduled executor service class, we must wrap our code for fetching the stock price in a class that extends `Runnable`. We put the code that we want to run regularly in the runnable's `run` method:

```scala
import java.util.concurrent.Executors
import java.util.concurrent.TimeUnit

val runnable = new Runnable {
  override def run {
    val priceFuture = fetcher.stockPrice
    val plotlyResponse = priceFuture.flatMap { stockPrice =>
      writer.write(Instant.now, stockPrice)
    }

    // Callbacks to print information about the API calls.
    priceFuture.onComplete { ... }
    plotlyResponse.onComplete { ... }

  }
}
```

We can now create a scheduler and pass it our runnable:

```scala
// Create a `ScheduledExecutorService`:
val scheduler = Executors.newSingleThreadScheduledExecutor

// Tell it to execute `runnable` every one minute, starting
// immediately.
scheduler.scheduleAtFixedRate(runnable, 0, 1, TimeUnit.HOURS)
```

Run this through SBT: you now have a fully functional tool that queries the Markit on demand API every hour and sends the results to Plotly.

Note that we are still using futures inside our runnable instance: all the scheduler does every hour is to create the futures and hand them over to the global execution context. The code that hits the web APIs therefore runs in a different thread to the scheduler. This is a good thing: the scheduler is not affected if one of the calls to the web APIs takes a long time to finish.

Thus, the thread workflow for our program looks a little like this:

<!-- from google-stock-price diagram on draw.io -->

<img width="60%"
 style="display:block;margin-left:auto;margin-right:auto;margin-top:1em;margin-bottom:1em;"
 src="images/google-stock-price.svg" />


## Packaging and deployment

I package the code using SBT assembly. This builds a single, stand-alone jar that contains the application and all its Scala dependencies. I wrap this jar in a Docker container, which I run on Amazon ECS. The Dockerfile for this is available on [GitHub](https://github.com/pbugnion/google-stock-price).