// Projects mirrored from github.com/apollo-2006. content taken from each
// repo's own README, so stacks and internals here match what's actually in
// the code. `summary` is the mini-readme shown on each project page.
const GH = 'https://github.com/apollo-2006';

export const projects = [
  {
    slug: 'nexus-cluster',
    tag: 'systems',
    name: 'nexus_cluster',
    blurb: 'distributed key-value store running Raft consensus.',
    summary:
      'A distributed systems project in Python implementing the Raft consensus algorithm end to end. Nodes elect a leader, replicate a log, and hold a consistent replicated state machine across the cluster even as members fail and rejoin, with a custom TCP transport layer underneath and a CLI to spin up nodes and watch the cluster behave.',
    highlights: [
      'raft implemented from scratch: RPCs for leader election and log replication, no consensus library.',
      'node lifecycle management across the Leader / Follower / Candidate states, including election timeouts.',
      'replicated state machine keeps state transitions consistent across every node in the cluster.',
      'custom TCP transport module for continuous inter-node communication.',
      'cluster CLI to launch nodes, monitor health, and talk to the consensus engine directly.',
    ],
    stack: ['Python', 'Raft', 'TCP'],
    repo: `${GH}/nexus_cluster`,
  },
  {
    slug: 'nexus-db',
    tag: 'systems',
    name: 'nexus_db',
    blurb: 'embedded LSM key-value store in C++17, with a live telemetry dashboard.',
    summary:
      'An embedded key-value store written in C++17, taking its architecture from LevelDB and RocksDB: writes land in an in-memory skip list, get durability from a write-ahead log, and are flushed to immutable SSTables on disk. On top of the engine sits a FastAPI layer talking to the C++ core over a ctypes FFI, and a React dashboard showing live telemetry.',
    highlights: [
      'MemTable is a probabilistic skip list, giving O(log n) insert and point lookup with no tree-rebalancing overhead.',
      'write-ahead log appends every operation to disk before the MemTable is touched, so the store survives a crash.',
      'MemTable freezes and flushes to an immutable SSTable via sequential write once it passes 1 MB.',
      'deletes write tombstone markers, masked at read time and reclaimed later during background compaction.',
      'three-layer stack: C++17 engine, Python/FastAPI REST API over ctypes FFI, React/TypeScript dashboard.',
    ],
    stack: ['C++17', 'Python', 'FastAPI', 'React', 'TypeScript'],
    repo: `${GH}/nexus_db`,
  },
  {
    slug: 'nexus-editor',
    tag: 'systems',
    name: 'nexus_editor',
    blurb: 'real-time collaborative editor with CRDTs over websockets, no locking.',
    summary:
      'A collaborative code editor that resolves concurrent typing conflicts without any centralized database locking. It uses a fractional-indexing CRDT: every character gets a universally unique, mathematically sortable identifier, so divergent client states merge without corrupting the document. The server never asks who typed first; it blindly routes CRDT objects and eventual consistency falls out of the math.',
    highlights: [
      'fractional-indexing CRDT: typing between index 1.0 and 2.0 generates 1.5, so concurrent edits merge cleanly.',
      'Go websocket router using native concurrency: an isolated goroutine per client for non-blocking broadcast.',
      'React 18 + TypeScript frontend on Vite, mutating local state instantly while syncing remote payloads behind it.',
      'sidesteps the failure mode of REST APIs under simultaneous edits by guaranteeing eventual consistency instead of ordering.',
    ],
    stack: ['Go', 'React', 'TypeScript', 'WebSockets'],
    repo: `${GH}/nexus_editor`,
  },
  {
    slug: 'nano-match',
    tag: 'systems',
    name: 'nano_match',
    blurb: 'low-latency limit order book and matching engine.',
    summary:
      'A high-performance order matching engine in C++, built to understand how financial exchanges actually work: price-time priority matching across a limit order book, with the low-level optimizations that low-latency trading systems depend on. The core design decision is refusing to touch the heap on the hot path.',
    highlights: [
      'limit order book handling the full order lifecycle: processing, queuing, and executing buys and sells.',
      'price-time priority matching, the same ordering discipline real exchanges use.',
      'custom memory pool (memory_pool.hpp) eliminates dynamic heap allocation during matching.',
      'built with strict memory control and the C++ optimization techniques standard in low-latency finance.',
    ],
    stack: ['C++'],
    repo: `${GH}/nano_match`,
  },
  {
    slug: 'custom-mem-alloc',
    tag: 'systems',
    name: 'custom_mem_alloc',
    blurb: 'thread-safe memory allocator talking straight to the OS via mmap.',
    summary:
      'A replacement for malloc written in C that interfaces directly with the operating system. It requests one large contiguous region of virtual memory up front through mmap, then slices that region for the program itself with minimal overhead, managing its own free list, aligning every allocation, and staying safe under threads.',
    highlights: [
      'mmap-backed: grabs a large contiguous region from the OS once rather than per allocation.',
      'thread-safe via mutex locks, so it holds up under concurrent allocation.',
      'free-list management recycles freed blocks instead of growing the pool forever.',
      'all allocations aligned to 8-byte boundaries for correct CPU access.',
      'drop-in my_malloc / my_calloc / my_free, plus print_heap_metadata to visualize block addresses, sizes, and status.',
    ],
    stack: ['C', 'pthreads'],
    repo: `${GH}/custom_mem_alloc`,
  },
  {
    slug: 'neon-vm',
    tag: 'systems',
    name: 'neon_vm',
    blurb: 'stack-based virtual machine executing packed bytecode.',
    summary:
      'A lightweight virtual machine in native C that executes densely packed binary opcodes through a stack-based pipeline, emulating the architecture behind runtimes like the JVM and LuaJIT. Written to understand instruction dispatch and how a compiler target actually consumes bytecode.',
    highlights: [
      'stack-based execution loop that decodes instructions and manipulates a virtual stack.',
      'bytecode chunking: data structures for storing and decoding densely packed opcodes and their constants.',
      'written in native C to keep dispatch overhead minimal.',
    ],
    stack: ['C'],
    repo: `${GH}/neon_vm`,
  },
  {
    slug: 'photon-tracer',
    tag: 'graphics',
    name: 'photon_tracer',
    blurb: 'CPU raytracer built with no graphics libraries at all.',
    summary:
      'A raytracer written from scratch in C++ that computes where light rays intersect 3D geometry and generates images from nothing but math. No graphics library is involved anywhere. the vector algebra, the camera, the intersection tests, and the image file format are all hand-written.',
    highlights: [
      'foundational rendering math built by hand: 3D vector operations, ray generation, and camera positioning.',
      'modular hittable interface for ray-object intersection, currently rendering spheres accurately.',
      'writes the finished scene straight to a PPM image, handling raw pixel data without an image library.',
      'configurable anti-aliasing and sampling (around 50 rays per pixel) to trade render time against fidelity.',
    ],
    stack: ['C++'],
    repo: `${GH}/photon_tracer`,
  },
  {
    slug: 'rasterizer-engine',
    tag: 'graphics',
    name: 'rasterizer_engine',
    blurb: 'software rasterizer: 3D geometry to lit pixels, no GPU.',
    summary:
      'A rasterizer in C++ that takes 3D points, multiplies them through a 4x4 perspective matrix to flatten them onto a 2D screen, and fills in the pixels between them. It is the pipeline a GPU normally hides, written out explicitly, the counterpart to photon_tracer, approaching the same problem from the opposite direction.',
    highlights: [
      '4x4 perspective projection applied by hand to flatten 3D coordinates onto the screen plane.',
      'triangle rasterization fills pixels between projected points to render solid geometry.',
      'SDL2 backend for windowing, pixel output, and event handling.',
      'C++17, compiled at -O3, because the whole point is that it has to be fast without a GPU.',
    ],
    stack: ['C++17', 'SDL2'],
    repo: `${GH}/rasterizer_engine`,
  },
  {
    slug: 'radiant-slice',
    tag: 'games',
    name: 'radiant_slice',
    blurb: 'tactical valorant-style FPS with lag compensation.',
    summary:
      'A tactical shooter built from scratch in C++ to explore what competitive FPS games actually have to solve: crisp hit registration across a network, a modular ability system, and movement precise enough to feel fair. Built from the player side of ~3,000 hours in the genre, aimed at the parts players feel but rarely see.',
    highlights: [
      'hitscan weapons paired with a dedicated lag compensation component for accurate hit registration over the network.',
      'modular ability system (RadiantAbilityBase) with controller-style utility: Dark Cover smokes and NearSight blinds.',
      'custom TacticalMovementComponent for precise competitive character control.',
      'full game framework: GameMode, GameState, and PlayerController handling round logic and match flow.',
    ],
    stack: ['C++'],
    repo: `${GH}/radiant_slice`,
  },
  {
    slug: 'terminal-dashboard',
    tag: 'tools',
    name: 'terminal_dashboard',
    blurb: 'real-time system monitor that lives in your terminal.',
    summary:
      'A live system monitoring dashboard that runs in the terminal instead of a browser tab or a bloated GUI: CPU, memory, network, GPU, and processes at a glance. Getting real AMD GPU sensor data required going around Windows entirely, since the standard APIs report no live temps or load and cap VRAM at 4GB.',
    highlights: [
      'per-core CPU usage with color-coded load bars, plus live memory and swap counters.',
      'real-time network I/O: up/down speed and session totals.',
      'AMD GPU monitoring by reading LibreHardwareMonitor\u2019s web server, since Windows APIs do not expose real sensor data; falls back to WMI automatically.',
      '60-second sparkline trends for CPU and RAM, and the top 5 processes by memory.',
      'metrics persisted to SQLite so history outlives the session; ships as a standalone PyInstaller executable.',
    ],
    stack: ['Python', 'Rich', 'SQLite'],
    repo: `${GH}/terminal_dashboard`,
  },
  {
    slug: 'thermal-monitor',
    tag: 'tools',
    name: 'thermal_monitor',
    blurb: 'background daemon logging thermal curves to a local database.',
    summary:
      'A terminal daemon that runs in the background watching the machine: CPU load, thermal curves over time, and VRAM clock speeds, all written to a local database. Built to keep a water-cooled 5900XT and an air-cooled 9070XT honest, because a snapshot tells you nothing about thermals, a history does.',
    highlights: [
      'polls real-time CPU load, thermal curves, and VRAM clocks through dedicated sensor logic.',
      'logs every sample into a local database for long-term trend analysis rather than a live-only readout.',
      'runs as a background daemon from the command line with minimal overhead.',
    ],
    stack: ['Python', 'SQLite'],
    repo: `${GH}/thermal_monitor`,
  },
  {
    slug: 'valo-scout',
    tag: 'tools',
    name: 'valo_scout',
    blurb: 'valorant match analyzer with a hand-written heapsort.',
    summary:
      'A Valorant stat tracker that pulls recent high-elo match data and ranks it by overall efficiency. The sorting is a custom Heapsort rather than a library call. the project was as much about REST API handling and sort efficiency as about the stats it surfaces.',
    highlights: [
      'pulls recent Ascendant/Diamond match data through a custom ValorantAPI client.',
      'ranks matches with a hand-written Heapsort implementation instead of the standard library sort.',
      'blackout-themed terminal UI built with Rich, showing KDA, KDA ratio, utility usage, and an impact score.',
      'credentials handled through python-dotenv rather than hardcoded.',
    ],
    stack: ['Python', 'Rich', 'REST'],
    repo: `${GH}/valo_scout`,
  },
  {
    slug: 'cal-cli',
    tag: 'tools',
    name: 'cal_cli',
    blurb: 'macro tracking that never leaves the command line.',
    summary:
      'A calorie and macro tracker built as a CLI. Logging a meal is one command instead of five taps through an app, which is the only version of nutrition tracking that survives contact with a real training week.',
    highlights: [
      'command-line entry for logging meals and tracking macros natively in the terminal.',
      'daily logs persisted to a local JSON file: structured, parsable, and yours.',
      'progress functions to visualize daily macro adherence against targets.',
    ],
    stack: ['Python', 'JSON'],
    repo: `${GH}/cal-cli`,
  },
  {
    slug: 'points-sys',
    tag: 'tools',
    name: 'points_sys',
    blurb: '[ one-line description: what does points-sys do? ]',
    summary:
      '[ this repo has no README yet. add a short paragraph on what it is and why you built it, or drop it from this list. ]',
    highlights: ['[ what problem does it solve? ]'],
    stack: ['HTML'],
    repo: `${GH}/points-sys`,
  },
  {
    slug: 'personal-portfolio',
    tag: 'tools',
    name: 'personal_portfolio',
    blurb: 'this site: a constellation you navigate instead of a nav bar.',
    summary:
      'The site you are on. Built in Astro with no UI framework: the homepage is Apollo\u2019s bow drawn in stars, where each star is a section, the lines are computed and animated in real pixel space, and clicking a star expands it into orbiting sub-stars rather than loading a new page.',
    highlights: [
      'five stars trace the bow\u2019s limb; the bowstring is the wrap-around segment, so it costs no extra stars.',
      'stars pull toward the cursor and the connecting lines stretch and light up with them.',
      'click-to-zoom: a star becomes the center and its contents orbit it, no page load.',
      'uniform-scale letterbox positioning keeps the constellation\u2019s exact shape on any aspect ratio, phone to ultrawide.',
    ],
    stack: ['Astro', 'JavaScript', 'CSS'],
    repo: `${GH}/personal_portfolio`,
  },
];
