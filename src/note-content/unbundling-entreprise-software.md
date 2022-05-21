---
contentTitle: The bundling of entreprise software
slug: /notes/unbundling-entreprise-software
createdDate: 2022-05-21
lastUpdatedDate: 2022-05-21
summary: For software bundling to be effective, it requires a barrier to the introduction of niche players that compete on a part of the bundle.
onTOC: yes
---

The bundling or unbundling of products, organisations, or tools is a recurring theme in the tech analyst and product part of the internet<Sidenote>Everything is getting bundled, unbundled, or re-bundled: from [Airflow](https://blog.fal.ai/the-unbundling-of-airflow-2/), to [media](https://stratechery.com/2017/the-great-unbundling/), via [the corporation](https://www.mckinsey.com/business-functions/strategy-and-corporate-finance/our-insights/unbundling-the-corporation).</Sidenote>. Bundling means selling related products together, rather than separately. For instance, a cloud provider bundles all sorts of different services together, from compute, to storage to databases etc. Similarly, a supermarket offers a single place where consumers can purchase many different items.

For bundling to be an effective proposition, it requires some barrier that makes it hard for niche players to create products that address just a small part of the bundle<Sidenote>This is well-described in [this Stratechery post](https://stratechery.com/2017/the-great-unbundling/).</Sidenote>. Without a barrier, hyper-specialised players will win over bloated behemoths that try to do everything, since they are able to better focus to provide a delightful experience in their niche<Sidenote>For instance, in the Stratechery post linked above, niche bloggers can provide a more targeted experience than newspapers, leading to the unbundling of the provision of news once the internet brought the cost of distribution to 0.</Sidenote>.

For supermarkets, the barrier is physical distance and the cost of real estate: it's nicer for the customer to get everything in one place, and relatively close to their home. But as the online purchasing of groceries increases, this barrier weakens. It's much easier for niche players to distribute their goods. This explain the introduction of lots of specialised providers of items that have, traditionally, been the purview of supermarkets, like [Gousto](https://www.gousto.co.uk/).

![Photo by Konstantin Kleine on Unsplash](./images/unbundling-entreprise-software-1.jpg)

## What does this have to do with entreprise software?

Bundling is often talked about in the context of consumer products. But bundling or unbundling products is just as relevant in entreprise software.

For entreprise software, the main barrier to unbundling is integration in the entreprise's existing ecosystem. Each piece of software that an organisation purchases requires integration with the rest of the software that organisation uses. The cost of that integration means organisations are wary of fragmentation.

The integration cost has three components:
- the fixed cost of purchase for any new software: this includes billing, integration with single sign-on systems and user management
- the cost associated with retraining individuals: this scales with the number of people affected, and the degree to which they're affected
- the cost associated with integration with existing software: this scales with the number of assets and touchpoints with other parts of the stack

For instance, introducing a new spreadsheet solution (like [Airtable](https://www.airtable.com/solutions/product)) requires integration with the underlying file storage, all the other documents the company uses, and all the processes that rely on spreadsheets.

Similarly, video-conferencing software aimed at businesses needs to integrate with existing calendars and meeting invitations, but also with hybrid meeting rooms. The cost is therefore relatively high.

Introducing a niche type of cloud service, such as [hosted log storage](https://www.elastic.co/cloud/), requires thinking about the integration of every other elements of the cloud stack with that service, such as how to inject secrets, how to provide access to dashboards, how to integrate with existing alerting systems etc.

## So what?

Providers of bundled software have, in general, no incentive to encourage unbundling. They are therefore not incentivized to facilitate inter-operability. This therefore discourages the introduction of standard interfaces that might facilitate unbundling. 

For instance, cloud object storage lends itself well to a standardised interface<Sidenote>Amazon S3, Google Cloud Storage and Azure Blob storage effectively provide identical functionality.</Sidenote>, but the three cloud providers have subtly different APIs that increase the barrier to entry for new players<Sidenote>When [Cloudflare introduced R2](https://blog.cloudflare.com/introducing-r2-object-storage/), their own object storage solution, they sensibly chose to emulate the Amazon S3 API. But since this isn't a standardized API, they are completely dependent on Amazon's whims. This introduces risk for Cloudflare that, presumably, discourages smaller players.</Sidenote>. Similarly, file formats across office suite are largely incompatible, both to increase switching cost and to prevent start-ups from gradually eating up the existing office suite monopolies.

Thus, while standardization of stable interfaces used in entreprise software would be beneficial, it is unlikely to happen.
