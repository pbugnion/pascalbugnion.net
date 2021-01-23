---
contentTitle: How frustrating is your programming language?
pageTitle: Data diversions | How frustrating is your programming language?
createdDate: 2016-07-31
lastUpdatedDate: 2016-07-31
slug: /blog/frustrating-programming-language
summary: "By looking at the number of swear words in commit messages on GitHub, we answer the age-old question: which programming language is the most frustrating?"
---

The internet is rife with bad metrics for comparing programming languages. This blog post adds another dubious measure: how often developpers swear in open source projects. This may serve as a proxy for how frustrated people get when developing in a particular language.

First of all, credit where it's due: the methodology for this post is largely inspired by [Andrew Vos's](http://andrewvos.com/) [blog post](http://andrewvos.com/2011/02/21/amount-of-profanity-in-git-commit-messages-per-programming-language). I've just included more languages and twenty times more commit messages. I have used the same regular expression as him to decide whether a word is profane.

Before plumbing the depths of open source software, however, I want to speak about Scala. Scala is becoming the *de-facto* language for big data analytics. Many big data tools are designed for Scala (Spark being the most famous). Its native interoperability with Java gives it access to the entire Hadoop ecosystem, without having to actually write Java code.

Scala's lack of a mature plotting library is thus particularly surprising. Of course, writing a good, cross-platform plotting library is difficult. Matplotlib, for instance, has 18,000 commits. At a conservative five hours per commit, that's the equivalent of ten people working 24 hours a day for an entire year. I am therefore very excited about the new Scala Plotly client: by offloading all the hard work of actually drawing dots on a screen onto an existing service or a JavaScript library, we can short-circuit the difficult (and frankly boring) parts of writing a library: writing backends that will work on different systems.

The client is still in early stages, specially compared to other Plotly clients. Take a look at the [examples](https://plot.ly/scala/) page for an idea of what it can do. 

Let's look at a more concrete example. I have analyzed just shy of 22 million commit messages for GitHub repositories in 17 different languages to try and identify how languages correlated with people's use of swear words. 

<iframe width="100%" height="600" frameborder="0" scrolling="no" src="https://plot.ly/~pbugnion/606.embed"></iframe>

To show how the client works, let's write a function that takes an array of languages and an array denoting the fraction of commits with swear words for that language.

```scala
def plotSwearWordBars(languages: Iterable[String], fractions: Iterable[Double]): PlotFile = {
  
  // Avoid having tiny numbers
  val swearyCommitsPer100k = fractions.map { _ * 1e5 }
  
  // Define a plot
  val p = Plot()
    .withBar(sortedLanguages, swearyCommitsPer100k,
      BarOptions().marker(
        MarkerOptions()
          .color(230, 184, 175)
          .lineColor(67, 67, 67)
          .lineWidth(1)
      )
    )
    .yAxisOptions(AxisOptions()
      .title("Number of 'sweary' commit messages / 100,000 commits")
    )
      
  // Embed the plot in a figure
  val figure = Figure()
    .plot(p)
    .title("Frustrating programming languages")
    
  // Send the figure to Plotly
  draw(figure, "fraction-sweary-commits")
}
```

I hope this example shows that the client aims to expose a declarative, functional interface to Plotly. It should make Scala developpers feel right at home. This is an exciting project, partly because it can have a large impact on the Scala community, and partly because drawing nice pictures is really fun. It is an open source project driven by the engineering team at ASI Data Science. We really encourage contributions.

If you want to read some sweary commit messages for fun or profit, I have made all the commit messages with swear words available at, e.g. [sweary-commits.scala4datascience.com/JavaScript.json](http://sweary-commits.scala4datascience.com/JavaScript.json) (just replace `Scala.json` with the language of your choice). The files are structured such that each line is a valid JSON object.

Data science is all about visualization, so let's make a library that rivals Matplotlib!