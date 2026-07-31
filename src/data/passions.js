// Each passion gets its own sub-page, the same way the apollo story does.
// Rendered by /passions/[slug].astro; listed on /passions.
export const passions = [
  {
    slug: 'lifting',
    name: 'lifting',
    eyebrow: 'six days a week',
    blurb: 'the first thing that taught me what showing up actually costs.',
    sections: [
      {
        heading: 'how it started',
        body: [
          "I was the smallest kid in the room and got tired of that being the first thing anyone noticed about me. That is the whole origin story. It was not discipline or some plan, it was just being annoyed enough to do something about it.",
          "The first few months were awful. I had no idea what I was doing. I copied whatever the guy next to me did, changed my program every two weeks because I read something new, and nothing moved. I nearly quit twice, both times for the same reason: I could not see progress, so I assumed there was none.",
        ],
      },
      {
        heading: 'what changed',
        body: [
          "The shift came when I stopped chasing how it looked and started chasing the number on the bar. Appearance is a lagging indicator and a terrible feedback signal. The weight is not. It either went up or it did not, and there is no interpreting your way out of that.",
          "Progressive overload is version control for your body. Small commits, every session, nothing dramatic. You do not notice the difference day to day, and then you look at the log six months back and the diff is enormous. The compounding is invisible right up until it is obvious.",
        ],
      },
      {
        heading: 'now',
        body: [
          "Push, pull, legs, six days a week. I track every set, which is exactly why I built cal_cli: logging a meal should take one command, not five taps through an app that wants my email address first.",
          "The part that transferred furthest is not physical. It is knowing what a real plateau feels like versus a week of feeling sorry for myself, and knowing that the answer to both is usually the same: go back tomorrow.",
        ],
      },
    ],
    links: [{ label: 'cal_cli', href: '/projects/cal-cli' }],
  },

  {
    slug: 'mma',
    name: 'mma',
    eyebrow: 'two-time national champion, 2020 to 2024',
    blurb: 'four years of feedback you cannot argue with.',
    sections: [
      {
        heading: 'why fighting',
        body: [
          "The gym gives you numbers. Fighting gives you something better: a person across from you who knows exactly how the round went. There is no version of talking yourself into believing you did well when you did not, because someone was there, and they know too.",
          "I competed from 2020 to 2024 and took two national titles in that span. What I remember more clearly than either of them is the losses, which I think is how it works for most people who stayed in it long enough to be any good.",
        ],
      },
      {
        heading: 'what it actually teaches',
        body: [
          "You do not rise to the occasion. You fall to the level of your preparation. Everybody has heard that; very few people have had it demonstrated on them in front of a crowd. Once it has been, you stop negotiating with your own preparation.",
          "It also taught me to be calm in a bad position, which sounds like a fighting skill and is really a general one. Something is going wrong, you did not plan for it, and panicking makes it worse. The answer is to work the problem from where you actually are, not from where you wish you were.",
        ],
      },
      {
        heading: 'the overlap with engineering',
        body: [
          "This is the part people do not expect. It is 2am, something is segfaulting, and the only thing saving you is that you actually understand the memory model instead of hoping. That is the same skill. Preparation you did weeks ago, cashed in at the exact moment you cannot fake it.",
          "Debugging low-level code and fighting have the same shape: no amount of confidence substitutes for having done the work, and the system does not care how you feel about it.",
        ],
      },
    ],
    links: [],
  },

  {
    slug: 'basketball',
    name: 'basketball',
    eyebrow: 'no stakes, no tracking',
    blurb: 'the least serious thing here, and the one I would miss most.',
    sections: [
      {
        heading: 'the counterweight',
        body: [
          "Everything else on this list is deliberate practice. Structured, tracked, aimed at something. Basketball is the one place I am not trying to optimize an outcome.",
          "Pickup with friends, no stakes, nobody logging anything. I am outside, running, losing an argument about whether that was a foul. Nothing is being measured and that is precisely the point.",
        ],
      },
      {
        heading: 'why it matters anyway',
        body: [
          "I got fairly good at turning things into projects. Lifting became a tracker. Gaming became two repos. Learning became a paper. There is a real risk in that pattern: if everything becomes a system to improve, nothing is left that you just enjoy.",
          "Basketball is the thing I have deliberately not instrumented. No app, no stats, no goals. It is also the only one of these I do purely because the people are there, which is probably the actual reason it works.",
        ],
      },
    ],
    links: [],
  },

  {
    slug: 'gaming',
    name: 'competitive gaming',
    eyebrow: 'apex and valorant',
    blurb: 'the cleanest feedback loop I have found outside a gym.',
    sections: [
      {
        heading: 'the games',
        body: [
          "Apex Legends is the main one. I peaked platinum, main Wattson and Alter, and yes, I have the Karambit. Valorant is the other, diamond across somewhere around 3,000 hours, which is an alarming number to write down and also the reason I understand hit registration better than I have any right to.",
          "I built the PC I play on. That started as a practical decision and turned into its own interest; knowing what every part does changes how you think about the software sitting on top of it.",
        ],
      },
      {
        heading: 'why ranked',
        body: [
          "You cannot argue with elo. It does not care how you felt about the game. It takes your input and returns a number, and the only way that number moves is if you actually got better. That is rarer than it sounds. Most feedback in life is delayed, noisy, or polite. Ranked is none of those things.",
          "The failure mode is obvious and I have lived it: you can grind for hours and improve nothing, because volume is not practice. The players who climb are the ones reviewing why a round was lost, not the ones queueing again immediately. That lesson generalizes uncomfortably well.",
        ],
      },
      {
        heading: 'where it fed the code',
        body: [
          "Both games ended up producing projects. valo_scout came from wanting stats the client would not give me, and from wanting an excuse to write a sorting algorithm by hand instead of calling one.",
          "radiant_slice came from a longer-running itch: I had spent years complaining about netcode without understanding it. Building a shooter with hitscan weapons and a lag compensation component was the fastest way to find out that the problem is genuinely hard and most of my complaints were uninformed.",
        ],
      },
    ],
    links: [
      { label: 'valo_scout', href: '/projects/valo-scout' },
      { label: 'radiant_slice', href: '/projects/radiant-slice' },
    ],
  },

  {
    slug: 'reading',
    name: 'reading',
    eyebrow: 'mostly non-fiction, mostly physical',
    blurb: 'the slowest way to learn something, and the one that sticks.',
    sections: [
      {
        heading: 'what I read',
        body: [
          "Mostly non-fiction, and mostly the kind that explains how something works rather than how to feel about it. Systems, history, the occasional biography of someone who was insufferable but correct.",
          "Almost entirely physical books. A screen is where I work, and I do not want the two to blur. There is also no notification that can reach me inside a paperback, which is most of the value.",
        ],
      },
      {
        heading: 'why not videos',
        body: [
          "A video gives you the illusion of understanding at the speed of the video. You follow along, everything makes sense while it is happening, and then you cannot reproduce any of it. I have lost real time to that.",
          "A book makes you sit in the part you did not get. That is the only part that mattered. The friction is not a flaw in the format, it is the format working.",
        ],
      },
      {
        heading: 'how it connects',
        body: [
          "This is why the computer vision work became a written paper instead of a tutorial playlist. Writing it down forced me to find the places where I only thought I understood something, which turned out to be most of the places.",
        ],
      },
    ],
    links: [{ label: 'the cv paper', href: '/research' }],
  },

  {
    slug: 'building',
    name: 'building things',
    eyebrow: 'mostly low-level',
    blurb: 'I do not like being told to trust something.',
    sections: [
      {
        heading: 'the pattern',
        body: [
          "An allocator instead of malloc. A virtual machine instead of an interpreter. A raytracer and a rasterizer instead of a graphics API. Raft instead of a database that already handles consensus.",
          "None of it is better than the real thing. That was never the point. The point is that after you write one, the real one stops being magic. You know roughly what is behind the call, so when it behaves strangely you have somewhere to start.",
        ],
      },
      {
        heading: 'why low-level',
        body: [
          "Abstractions are good and I use them constantly. But an abstraction you have never looked underneath is a thing you are trusting on faith, and faith is a bad debugging strategy at 2am.",
          "Writing the memory allocator changed how I read every C program afterward. Writing Raft changed what I assume a database is doing when it says a write succeeded. The projects were not the deliverable; the change in how I read other people's systems was.",
        ],
      },
      {
        heading: 'the one that matters most',
        body: [
          "A habit-tracking app I built with a friend of fifteen years is still in use. It is by far the least technically interesting thing I have made, and it is the only one with users who did not have to be convinced.",
          "That is a better metric than anything on my GitHub, and I try to remember it when I am tempted to measure a project by how hard it was.",
        ],
      },
    ],
    links: [
      { label: 'custom_mem_alloc', href: '/projects/custom-mem-alloc' },
      { label: 'neon_vm', href: '/projects/neon-vm' },
      { label: 'nexus_cluster', href: '/projects/nexus-cluster' },
    ],
  },
];
