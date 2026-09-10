---
title: "february 2026"
description: "🦷 i bought a waterpik and built a website 🌤️"
date: 2026-03-13
substack: "https://www.newsletter.kahvipatel.com/p/february-2026"
---

Hello and welcome 🙇

## dentist

I went to the dentist for a tooth cleaning this month and **it** **sucked**.

My gums ended up bleeding (which is why I don’t go in the first place) and after complaining to the hygienist, she said

> *This is an indication that your gums are irritated*

to which I replied

> *I think my gums are irritated because you **keep picking at them***

which led to a long and rambling lecture about how gums work. Since I had various implements in my open mouth, I mostly responded with “ahhh”.

Despite the interaction, I did learn something - plaque can actually make its way *under* your gums.

I was under the impression that my gums were *perfectly sealed* against the teeth, like a waterproof seam or something.

![](https://cdn.kahvipatel.com/newsletter-assets/190327231-missing-001.png)

This turns out not to be true.

There’s actually a V-shaped crevice between the gums and the teeth into which plaque can slide down. And apparently, brushing your teeth twice a day doesn’t prevent this from happening.

![](https://cdn.kahvipatel.com/newsletter-assets/190327231-missing-002.png)

All that to say, the hygienist scared me enough to buy a [wireless waterpik](https://www.amazon.ca/Philips-Sonicare-Irrigator-HX3826-21/dp/B0C8KJGMZL?source=ps-sl-shoppingads-lpcontext&smid=A3DWYIK6Y9EEQB&th=1) that I use in the shower. It’s actually very convenient.

And yet, as with most health-related things, it leaves me wondering:

- [How did we manage back when we were all farming and didn’t have dentists?](https://gemini.google.com/share/8d4c4f8b40bb)

## building websites

I spent a bunch of my free time in February building websites. With AI mostly. The sites so far are:

- [sunlight app](https://sunlight.kahvipatel.com/) - [src](https://github.com/iamkahvi/sunlight-app)
- [body-annotator](https://annotator.kahvipatel.com/) - [src](https://github.com/iamkahvi/body-annotator)
- [newsletter-analytics](https://newsletter-analytics.kahvipatel.com/) - [src](https://github.com/iamkahvi/newsletter-analytics)

Today’s models are smart enough to build a website pretty effectively - with a few conditions:

1. you must have a [specific enough](https://paulgraham.com/taste.html) idea. If not, the model’s going to lead you down the maximalist path.
2. it has to be reasonably simple - you're not gonna build Facebook in a day.

Also, I don’t expect to *understand* the code it produces. I just use the website and talk to it if something is wrong. It’s essentially a more [declarative way to program](https://www.newsletter.kahvipatel.com/i/123885809/how-will-ai-change-my-job).

Let me explain the sites in a bit more detail:

### sunlight app

I wanted a way to remember when it was sunny outside, so I made [this](https://sunlight.kahvipatel.com./):

![](https://cdn.kahvipatel.com/newsletter-assets/190327231-missing-003.png)

Pretty self-explanatory - it tells you how many hours of sunlight there are in each day (with a seven day forecast). I mostly use it on my phone.

It’s nice to remind myself which days were sunny in the past since I usually do something fun on those days.

And, if the week has been full of grey, then it might be why I’m *feeling* grey.

### body annotator

I talked about this idea in a [past newsletter](https://www.newsletter.kahvipatel.com/p/october-2024-extended).

> I require an app that allows you to annotate a 3D model of your body and export it. Doesn’t need to be a scan of you specifically, just a generic body will do.
> 
> Ideally, I can select a point or a specific muscle/tendon/bone on the body and say “sharp pain when I put pressure here” or something similar.

I made this (you’re welcome past Kahvi).

![](https://cdn.kahvipatel.com/newsletter-assets/190327231-missing-004.png)

After showing this to my parents (who are both doctors), I updated the logic to make sure the notes expire after a week.

Turns out that visually reminding yourself of a past injury might have a negative psychological effect (and maybe *slows healing?*).

The notes are still stored, they are just hidden by default and displayed under the “expired” status.

Anyway, it's been handy for me to:

- figure out if an injury is recurring or new
- give my physio specific dates

Disclaimer: The notes won't sync across devices (everything lives in the browser). That said, the data is easy to import/export.

### newsletter-analytics

This one was mentioned in last month’s newsletter. It's the site that supports the newsletter stats I talked about last month.

![](https://cdn.kahvipatel.com/newsletter-assets/190327231-missing-005.png)

In fact, the whole process of [scraping](https://github.com/iamkahvi/newsletter-analytics/blob/master/scripts/get_text.sh) my newsletters from the internet and [analyzing them](https://github.com/iamkahvi/newsletter-analytics/blob/master/scripts/analyze_markdown.ts) was built with AI.

This project is also a great example of where the AI can fall short. In this case, it means producing nonsensical graphs:

![](https://cdn.kahvipatel.com/newsletter-assets/190327231-missing-006.png)

This one is just completely blank:

![](https://cdn.kahvipatel.com/newsletter-assets/190327231-missing-007.png)

Anyways, I’ve had fun building.

## misc

- Victoria people - the cinnamon ice cream at [Better Acres](https://www.instagram.com/betteracresicecream/?hl=en) is *delicious*
- I’ve started wearing collared shirts more 🤵♂️
- Ashley and I are playing [It Takes Two](https://en.wikipedia.org/wiki/It_Takes_Two_\(video_game\)) (and our TV died)
- I enjoyed the announcers in this men’s ice skating clip:
	<div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;max-width:100%;margin:1rem 0;">
  <iframe src="https://www.youtube-nocookie.com/embed/hQIrlq87PsE" title="YouTube video" loading="lazy" allowfullscreen frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" style="position:absolute;top:0;left:0;width:100%;height:100%;"></iframe>
</div>
- Here’s a good complement to the AI hype cycle ([src](https://www.linkedin.com/posts/activity-7431051712653713408-f2Yt))

![](https://cdn.kahvipatel.com/newsletter-assets/190327231-missing-008.png)

- along with [this tweet](https://nitter.net/aakashgupta/status/2024701612888117372)

That’s all! See you next month!
