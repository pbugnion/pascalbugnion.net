---
contentTitle: Managing multiple AWS credentials with pass
pageTitle: "Data diversions | Managing AWS credentials with pass"
slug: /notes/managing-aws-credentials-with-pass
createdDate: 2020-01-21
lastUpdatedDate: 2020-01-22
summary: Unix pass offers a lightweight way to easily and securely manage multiple sets of AWS credentials.
onTOC: yes
---

A significant part of my day job at [Faculty](https://faculty.ai/) involves the administration of cloud resources, predominantly on AWS.

We have many AWS accounts: for development, for isolating
parts of our infrastructure for specific customers or business
lines etc. We also have restricted access to some of our
customers' accounts. A lot of my life is therefore spent switching
between different AWS credentials across different accounts.

I want to impose some order on the complex world of my AWS profiles. In particular, I want a system that:

- Clearly shows what credentials I am currently using. Many of our development accounts are set to mirror our production infrastructure. I often have to run `make clean` in a development account. Running the same command against production infrastructure would be less fun.
- Stores credentials in an encrypted manner. The threat model here is accidentally running a malicious program that sends the contents of my `~/.aws` directory to some remote server.
- Allows switching and deactivating profiles easily.
- I really understand. I have enough trouble managing infrastructure. I don't want to introduce another layer of complexity to manage credentials.
- Uses [pass](https://www.passwordstore.org/) to store credentials. I have been using pass to store all my passwords since time immemorial. Some of my worst nightmares revolve around losing the key that it uses to decrypt credentials.

I spent a bit of time looking at existing solutions, in particular at [aws-vault](https://github.com/99designs/aws-vault), but eventually decided on just writing custom tooling myself. I talk about why *aws-vault* wasn't quite the right fit for me in the last section.

## Simple AWS credentials management

For each AWS profile, I create an entry in pass under `aws-profiles/PROFILE_NAME`. The entry contains a tiny shell script designed to be sourced in a shell:

```bash
export AWS_PROFILE=my-profile
export AWS_ACCESS_KEY_ID=...
export AWS_SECRET_ACCESS_KEY=...
```

To then enter that environment, I can run the following command in the [fish shell](https://fishshell.com/):

```none
pass aws-profiles/my-profile | source
```

The equivalent for Bash-like shells is:

```bash
eval $(pass aws-profiles/my-profile)
```

## Automation with shell functions

To avoid having to remember this command, I created a shell function called `aws-activate` that injects the credentials into my environment and a counterpart `aws-deactivate` to remove them.

Skipping argument validation, these look like the following snippets for Fish. The full source code, and corresponding examples for Bash are available in [this gist](https://gist.github.com/pbugnion/8e0e2b40ef3160b1eadaea2f4b901def):

```none
# ~/.config/fish/functions/aws-activate.fish
function aws-activate -d 'Activate an AWS profile stored in pass' --argument profile
  # Skip argument validation
  pass aws-profiles/$profile | source
end

# ~/.config/fish/functions/aws-deactivate.fish
function aws-deactivate -d 'De-activate an AWS profile'
  set -e AWS_PROFILE
  set -e AWS_ACCESS_KEY_ID
  set -e AWS_SECRET_ACCESS_KEY
end
```

With these functions defined, I can run `aws-activate my-profile` to inject the environment variables for a profile into my shell, and `aws-deactivate` to clear them.

## Profile visibility

I need to know which AWS account I am currently running commands against. I live in constant terror of running a destructive command [against a production environment instead of a development one](https://about.gitlab.com/blog/2017/02/10/postmortem-of-database-outage-of-january-31/).

I therefore include the current value of the `AWS_PROFILE` variable in my prompt. For fish users, this looks like having the following lines in [`fish_prompt.fish`](https://fishshell.com/docs/current/commands.html#fish_prompt):

```none
# ~/.config/fish/functions/fish_prompt.fish

function fish_prompt --description 'Write out the prompt'
    if set -q AWS_PROFILE
        echo -n -s (set_color blue) "[" $AWS_PROFILE "]" (set_color normal) " "
    else if set -q AWS_ACCESS_KEY_ID
         # We are in the context of an AWS profile, but we don't know which
         # one. Show a red warning.
         echo -n -s (set_color red) "[ ??? ]" (set_color normal)
    end
    
    # other prompt fragments related to Python virtual environments,
    # the git status etc.
end
```

My prompt now contains information about the profile:

<div class="gatsby-highlight"><pre class="language-fish"><span class="token deleted">[my-profile]</span> ~ $</pre></div>

![](./images/aws-vault-1.jpg)

## A comparison with AWS vault

Several of my colleagues use [aws-vault](https://github.com/99designs/aws-vault). *aws-vault* stores credentials in pass or in some other secret backend. However, instead of injecting the credentials directly into the shell environment, it generates *temporary* credentials using the [session token mechanism](https://docs.aws.amazon.com/cli/latest/reference/sts/get-session-token.html). It then opens a new shell with those credentials in the environment. Effectively, you have an AWS access key and secret key in your environment, but these are only valid for an hour.

The main advantage of this is that if you run a malicious command that steals environment variables, the attacker has at most an hour to take advantage of them.

There are two downsides:

- The time-boundedness of credentials introduces complexity. I need to keep in mind that the credentials eventually expire.
- I find infrastructure development complex enough as it is, without introducing tooling that I only partly understand at such a low level.
- as outlined above, aws-vault injects credentials in the environment of a new subshell. This does not play well with [eshell](https://www.masteringemacs.org/article/complete-guide-mastering-eshell), which I use a lot. Generally, being able to inject credentials into your current shell seems useful and probably relatively straightforward to add into aws-vault, so I suspect this will be implemented at some point.

This is not to say that I don't think aws-vault is a great tool. In fact, at Faculty, we recommend it to new joiners as a way to manage credentials. It just isn't the right fit for me right now but that may, of course, change in the future.

## Parting words

Using pass and a little bit of shell scripting, we can store AWS credentials (or any secret used as an environment variable) in an encrypted form.
