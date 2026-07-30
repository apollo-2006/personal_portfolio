// Projects mirrored from github.com/apollo-2006.
// `summary` is the mini-readme shown on each project page.
// Anything in [ square brackets ] is a placeholder — only you know those
// numbers, and made-up benchmarks are the kind of thing an interviewer
// will ask you to defend.
const GH = 'https://github.com/apollo-2006';

export const projects = [
  {
    slug: 'nexus-cluster',
    tag: 'systems',
    name: 'nexus_cluster',
    blurb: 'fault-tolerant distributed key-value store running Raft.',
    summary:
      'A distributed key-value store built in Python on asyncio. It implements the Raft consensus algorithm from scratch to keep a strongly consistent, replicated log across a decentralized cluster — leader election, log replication, and failover all handled by hand rather than pulled off the shelf. Nodes can drop and rejoin without the cluster losing consistency.',
    highlights: [
      'raft implemented from scratch — leader election, log replication, and failover, no consensus library.',
      'asyncio-based, so a node handles peer heartbeats and client traffic concurrently.',
      'nodes can drop and rejoin without losing consistency.',
      '[ add cluster size + throughput you tested with ]',
    ],
    stack: ['Python', 'asyncio', 'Raft'],
    repo: `${GH}/nexus_cluster`,
  },
  {
    slug: 'nexus-db',
    tag: 'systems',
    name: 'nexus_db',
    blurb: 'key-value store with a live dashboard over the storage engine.',
    summary:
      'A key-value store paired with a web dashboard that exposes what the engine is doing while it runs — reads, writes, and the state of the store visible live instead of guessed at from logs.',
    highlights: [
      'storage engine exposed through a dashboard for inspecting reads/writes as they happen.',
      '[ add the indexing / persistence strategy — hash index? LSM? append-only log? ]',
      '[ add what the dashboard surfaces that a plain CLI would not ]',
    ],
    stack: ['TypeScript'],
    repo: `${GH}/nexus_db`,
  },
  {
    slug: 'nexus-editor',
    tag: 'systems',
    name: 'nexus_editor',
    blurb: 'real-time collaborative editor built on CRDTs.',
    summary:
      'A collaborative text editor where several people edit the same document at once with no central lock. Conflicts resolve automatically through CRDTs, so two edits to the same region converge to the same result on every client instead of one overwriting the other.',
    highlights: [
      'CRDT-based merge — concurrent edits converge without a central lock or operational transform server.',
      'changes sync over websockets so remote edits land live.',
      '[ add latency / how many concurrent editors you tested ]',
    ],
    stack: ['TypeScript'],
    repo: `${GH}/nexus_editor`,
  },
  {
    slug: 'nano-match',
    tag: 'systems',
    name: 'nano_match',
    blurb: 'ultra-low-latency HFT limit order book and matching engine.',
    summary:
      'A limit order book and matching engine in C++, built for the latency constraints real high-frequency trading systems work under. Orders are matched by price-time priority, with the data structures chosen so the hot path stays predictable rather than merely fast on average.',
    highlights: [
      'price-time priority matching across the full order lifecycle — add, cancel, fill.',
      'built around keeping the hot path allocation-free and cache-friendly.',
      '[ add measured latency per order — ns/µs — and how you measured it ]',
    ],
    stack: ['C++'],
    repo: `${GH}/nano_match`,
  },
  {
    slug: 'custom-mem-alloc',
    tag: 'systems',
    name: 'custom_mem_alloc',
    blurb: 'a memory allocator, built to understand what malloc actually does.',
    summary:
      'A replacement for malloc written in C. It requests one large contiguous region of virtual memory from the OS up front via mmap, then hands slices of that region to the program itself — maintaining its own free list and splitting blocks on demand, with the bookkeeping overhead kept deliberately small.',
    highlights: [
      'grabs memory from the OS once with mmap instead of calling the system allocator per request.',
      'own free-list and block-splitting; reuses freed blocks rather than growing forever.',
      '[ add how you handle fragmentation — coalescing adjacent free blocks? ]',
      '[ add a benchmark against system malloc ]',
    ],
    stack: ['C'],
    repo: `${GH}/custom_mem_alloc`,
  },
  {
    slug: 'neon-vm',
    tag: 'systems',
    name: 'neon_vm',
    blurb: 'a small stack-based virtual machine — bytecode in, execution out.',
    summary:
      'A virtual machine written in native C that executes densely packed binary opcodes through a stack-based execution pipeline, echoing how real CPU architectures fetch, decode, and execute. It defines its own instruction set and runs compiled bytecode against it.',
    highlights: [
      'custom instruction set, executed on a stack machine with its own fetch/decode/execute loop.',
      'opcodes packed densely to keep the dispatch loop tight.',
      '[ add what you run on it — a toy language? a hand-written assembler? ]',
    ],
    stack: ['C'],
    repo: `${GH}/neon_vm`,
  },
  {
    slug: 'photon-tracer',
    tag: 'graphics',
    name: 'photon_tracer',
    blurb: 'multithreaded C++ raytracer.',
    summary:
      'A raytracer written from scratch in C++. It traces light per-pixel to produce reflection, refraction, and soft shadows, and splits the frame across cores so rendering scales with the machine instead of pinning one thread.',
    highlights: [
      'reflection, refraction, and soft shadows traced per-pixel.',
      'frame split across cores rather than rendered single-threaded.',
      '[ add a render time + sample count you are proud of ]',
    ],
    stack: ['C++'],
    repo: `${GH}/photon_tracer`,
  },
  {
    slug: 'rasterizer-engine',
    tag: 'graphics',
    name: 'rasterizer_engine',
    blurb: 'software rasterizer — 3D points to lit pixels, no GPU.',
    summary:
      'A rasterizer that takes 3D points, multiplies them through a 4x4 perspective matrix to flatten them onto a 2D screen, then fills in the pixels between them. The whole pipeline a GPU normally hides — projection, triangle filling — done explicitly in software.',
    highlights: [
      '4x4 perspective projection applied by hand to flatten 3D geometry to screen space.',
      'triangle filling done in software, pixel by pixel.',
      '[ add whether you handle depth buffering / backface culling ]',
    ],
    stack: ['C++'],
    repo: `${GH}/rasterizer_engine`,
  },
  {
    slug: 'radiant-slice',
    tag: 'graphics',
    name: 'radiant_slice',
    blurb: 'a barebones valorant-style fps.',
    summary:
      'A stripped-down first-person shooter in C++, built in the spirit of Valorant — movement, aiming, and shooting implemented directly rather than assembled in a game engine.',
    highlights: [
      'first-person movement and shooting built from the ground up.',
      '[ add what renders it — your own rasterizer? a library? ]',
      '[ add whether hit detection is raycast-based ]',
    ],
    stack: ['C++'],
    repo: `${GH}/radiant_slice`,
  },
  {
    slug: 'thermal-monitor',
    tag: 'tools',
    name: 'thermal_monitor',
    blurb: 'terminal daemon tracking CPU load, thermals, and VRAM clocks.',
    summary:
      'A terminal-based daemon that runs in the background watching the machine: CPU load, thermal curves over time, and VRAM clock speeds, all logged into a local database so the history is queryable rather than a snapshot.',
    highlights: [
      'runs as a daemon — samples continuously instead of on demand.',
      'logs to a local database, so thermal behaviour can be reviewed over time.',
      '[ add sample interval + what you learned from your own curves ]',
    ],
    stack: ['Python'],
    repo: `${GH}/thermal_monitor`,
  },
  {
    slug: 'terminal-dashboard',
    tag: 'tools',
    name: 'terminal_dashboard',
    blurb: 'a dashboard that lives in the terminal.',
    summary:
      '[ one-paragraph summary — this repo has no description on GitHub yet, so write what it pulls together and who it is for. ]',
    highlights: [
      '[ what does it display? ]',
      '[ what does it pull from — system stats, APIs, your other tools? ]',
    ],
    stack: ['Python'],
    repo: `${GH}/terminal_dashboard`,
  },
  {
    slug: 'valo-scout',
    tag: 'tools',
    name: 'valo_scout',
    blurb: 'a valorant stat tracker.',
    summary:
      'A stat tracker for Valorant — pulls match data and turns it into something readable, so performance over a session is visible rather than remembered.',
    highlights: [
      '[ add where the data comes from — riot API? scraped? ]',
      '[ add what it surfaces that the in-game screen does not ]',
    ],
    stack: ['Python'],
    repo: `${GH}/valo_scout`,
  },
  {
    slug: 'cal-cli',
    tag: 'tools',
    name: 'cal_cli',
    blurb: 'a calorie counter that lives on the command line.',
    summary:
      'A calorie tracker built as a CLI — logging a meal is a single command instead of five taps through an app, which is the only version of food tracking that survives contact with a real training week.',
    highlights: [
      '[ add how entries are stored — flat file? sqlite? ]',
      '[ add whether it tracks macros or just calories ]',
    ],
    stack: ['Python'],
    repo: `${GH}/cal-cli`,
  },
  {
    slug: 'points-sys',
    tag: 'tools',
    name: 'points_sys',
    blurb: '[ one-line description — what does points-sys do? ]',
    summary:
      '[ this repo has no description on GitHub yet — add a short paragraph on what it is and why you built it, or drop it from this list. ]',
    highlights: ['[ what problem does it solve? ]'],
    stack: ['HTML'],
    repo: `${GH}/points-sys`,
  },
  {
    slug: 'personal-portfolio',
    tag: 'tools',
    name: 'personal_portfolio',
    blurb: 'this site — a constellation you navigate instead of a nav bar.',
    summary:
      'The site you are on. Built in Astro with no UI framework: the homepage is a constellation where each star is a section, lines are drawn and animated in real pixel space, and clicking a star expands it into orbiting sub-stars rather than cutting to a new page. Cursor gravity, parallax depth, and the two-theme system are all hand-rolled.',
    highlights: [
      'constellation homepage — stars pull toward the cursor, connecting lines light up and stretch with them.',
      'click-to-zoom expansion: a star becomes the center and its contents orbit it, no page load.',
      'positioned by uniform-scale letterbox math, so the layout holds its shape on any aspect ratio.',
    ],
    stack: ['Astro', 'JavaScript', 'CSS'],
    repo: `${GH}/personal_portfolio`,
  },
];
