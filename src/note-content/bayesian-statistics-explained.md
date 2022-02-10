---
contentTitle: "How to be less wrong: an intuitive introduction to Bayesian statistics"
slug: /notes/bayesian-statistics-explained
createdDate: 2022-02-08
lastUpdatedDate: 2022-02-08
onTOC: yes
hasLatex: true
---

Statistics tends to evoke painful memories of retrieving coloured balls from a bag, or throwing dice, or flipping coins. Like much of mathematical education, these problems are all very artificial: it's not obvious how they help us day-to-day. Because they are so artificial, they miss the point.

Statistics is really the study of decision-making under uncertainty. When our brain evaluates questions like "should I take an umbrella with me?" or "given that I have a fever, am I likely to have Covid?", it intuitively knows how to handle uncertainty to make sensible decisions. Statistics takes this intuition, gives it a firm logical footing, makes it more quantitative, and turns it into concrete algorithms (or at least, formulae) that we can put into software.

Bayesian statistics, in particular, gives us a framework for understanding how much to update our beliefs when we are presented with a new piece of evidence. For instance, let's say I wake up this morning with a fever. My brain will naturally think about Covid. But how much should I update whether I believe I have Covid based on my fever? Bayesian statistics is a framework for updating our belief (do I have Covid?) based on new evidence (I have a fever).

TODO diagram

## Prior information

Unlike the statistics taught in school, Bayesian statistics assumes I already have some knowledge about whether I have Covid or not, before observing that I have a fever. For instance, if I spent yesterday evening hanging out with a friend who later tested positive, I might think there's a decent chance I have Covid. On the other hand, if I recovered two weeks ago, my natural immunity would make it unlikely I'd catch Covid again.

In Bayesian statistics, the degree of confidence we have in our belief before having observed the new data is called the prior. When we make decisions about the world, we use this prior information and combine it with the new evidence to create an updated belief.

## The weight of evidence

Bayesian statistics provides a framework for combining a prior belief with new evidence to create an updated belief. In particular, it tells us how much weight to ascribe to the new evidence.

So how much weight should we ascribe to my having a fever when deciding whether I have Covid? Of course, Covid causes fevers. But I wouldn't automatically conclude that I therefore have Covid, since I might have a fever for lots of other reasons. The amount of weight to give to this piece of evidence is the answer to "how much more likely is it that I have a fever *if I have Covid* than by random chance?"

If I have Covid, I will almost certainly have a fever. However, on any given day, it's unlikely, but not impossible that I might have a fever (regardless of whether I have Covid). Thus, the amount of weight I should lend to observing I have a fever is a lot, but not enough to be conclusive by itself.

Thus, the observation that I have a fever will strongly reinforce any prior belief I have Covid, but probably not enough to overwhelm that prior belief. For instance, if I hung out with a Covid-positive person yesterday, and now I have a fever, I'll conclude I almost certainly have Covid. However, if I recovered two weeks ago, I'd certainly think there was a chance I'd caught Covid again, but I wouldn't be 100% sure.

## What does this look like as an equation?

Bayesian statistics combines a prior belief with some piece of evidence to give an updated belief. The amount of weight given to the evidence is "how much more likely is it that I observe this evidence if my belief is true, compared to observing it by random chance?".

Mathematically, we typically express confidence in a belief as probabilities. Thus, the probability $P(\textrm{I have Covid})$ just means the degree of confidence I have in the belief "I have Covid". Quantitatively, the amount that I should update my belief in having Covid after observing that I have a fever is:

$$
\begin{aligned}
& \hspace{-2 em} P(\textrm{I have Covid after observing I have a fever}) = \\ & \quad \textrm{weight of evidence} \times P(\textrm{I have Covid prior to observing I have a fever})
\end{aligned}
$$


And $\textrm{strength of evidence}$ is how much more likely am I to have a fever given I have Covid than by random chance.
$$
  \textrm{weight of evidence} = \frac{P(\textrm{I have a fever given I have Covid})}{P(\textrm{I have a fever in general})}
$$

The more general version is:
$$
P(\textrm{updated belief}) = \textrm{weight of evidence} \times P(\textrm{prior belief})
$$

with:

$$
  \textrm{weight of evidence} = \frac{P(\textrm{seeing this evidence if my belief is true})}{P(\textrm{seeing this evidence in general})}
  $$

## Why is this useful?
Automation is removing much of the drudge work. Since computers can process information much faster than humans, pushing decision-making into software allows making decisions at a much greater level of granularity. But getting computers to make decisions on our behalf is only useful if they are able to make the right decision.

Bayesian statistics, by algorithmising the human decision-making process, allows the development of machine learning techniques that are closer to how we make decisions, and that make it easier to blend human and machine intelligence.
