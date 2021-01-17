---
contentTitle: "Editor hacking: how I learnt to stop worrying and love my emacs configuration"
pageTitle: "Data diversions | Editor hacking"
slug: /blog/editor-hacking
createdDate: 2020-01-05
lastUpdatedDate: 2020-01-05
summary: Spending time mastering your text editor and customizing it to fit your needs is time well spent. It can reduce sources of friction in your workflow and generally increase your enjoyment of programming.
---

I'll start with a confession: I can't really sit still. I am filled with an insatiable need to be doing *something*, to feel like I'm moving in some direction. 

When this need drives me to my desk on a Saturday, I have to choose what to do. I can work on something sensible, like one of my [open source projects](/code.html). Or I can indulge in one of my guilty pleasures, such as customising my text editor. So while normal people sometimes feel guilty about playing computer games, or drinking or having too much chocolate or skipping the gym, I feel guilty about migrating from Mac Mail to managing email in Emacs.

But in this post, I'll argue that improving how you use your text editor is actually a reasonable use of your time.

Before diving into this, let me dispel an argument I've often seen used to justify mastering your text editor. People would have you believe that the time spent upfront memorizing keybindings will be worth it in increased productivity. It won't. The hours I have spend mastering Vi keybindings far outweigh the time savings I get from knowing what `gqip` does. No.

The value of making your text editor suit your needs is not in the time saved. It's in the greater enjoyment you derive from using it. Tools that are configured to your preference will be better because they will feel comfortable and familiar, even if they are not faster.

A programmer's life is full of frustrations:

- “I have just waited ten minutes for this Docker image to build, only to find out that I had a trailing comma in the JSON configuration”
- “We spent two days re-writing our test suite because of a breaking change in Selenium”
- “This Google font my website depends on just disappeared and now my website looks like it was made by an eight year old on acid”
- “I was making really good progress solving that bug when this guy interrupted me because his question just couldn't wait”

Beyond these obvious frustrations, there are so many more tiny papercuts that are small enough to escape notice:

- having to switch between your editor and your terminal to view the tests
- having to refresh the page because you don't trust Webpack's hot reload button

By contrast, programmers idealize the state of flow. You feel like you are making real progress. Your mind is entirely devoted, uninterrupted, to the problem you are trying to solve. Typically, your tools disappear in the background: you stop thinking about them to concentrate on the problem. This is only possible if there is minimal friction in your tooling: any rough edges and you are jarred back to reality by your broken text editor.

This is where editor customisation comes in: by spending time tweaking your vim, Emacs, VSCode or Atom configuration, you reduce friction in your workflow. This makes it more likely that you can remain focussed on the problem you are trying to solve.

So spend time making your editor be the best it can be for you. If you spend an hour creating an Emacs hook that makes the system clock appear on your status bar when the window is maximized, that's an hour you will never get back. It will never be compensated by the time that you save by not using the mouse to make the time appear. But if it can save you a tiny papercut and keep you in a state of flow, that is time well spent.

All the time I have spent mastering using and customizing Emacs means less friction in my workflow. I then enjoy programming more. Sure, it's time I won't get back. But it's what draws me back to my desk on Saturday mornings.

*Acknowledgements:* Thanks to my colleague [Scott Stevenson](https://scott.stevenson.io/) for feedback on this post, and more generally for shaping my thoughts on editor customisation.
