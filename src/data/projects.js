// Projects mirrored from github.com/apollo-2006. content taken from each
// repo's own README, so stacks and internals here match what's actually in
// the code. `summary` is the mini-readme shown on each project page.
const GH = 'https://github.com/apollo-2006';

export const projects = [
  {
    slug: 'oracle-of-delphi',
    tag: 'systems',
    name: 'oracle_of_delphi',
    blurb: 'a fully-local voice assistant. five rust services, a 14b model on my own gpu, nothing leaves the box.',
    summary:
      'A voice-capable desktop assistant that runs entirely on my own machine: no cloud, no API keys leaving the box, no data going anywhere. Pythia is the voice, Apollo is the seal of judgment that gates irreversible actions, and Delphi is the name you call to summon her. Under the hood it is a small fleet of Rust services, a llama.cpp server running Qwen2.5-14B on an RX 9070 XT, and a Three.js heads-up display in a native window, all behind one double-click.',
    highlights: [
      'five cooperating processes behind a single executable: a native shell owning the window, hotkey and tray; an orchestrator running the agent loop and serving the HUD; a privileged actuator daemon; a shared IPC crate; and the Three.js interface.',
      'the LLM is treated as an untrusted planner. every OS-touching action is isolated in a separate daemon, and irreversible ones (killing a process, running a shell) are gated behind an explicit sanction before they happen.',
      'the native window is bare tao and wry rather than a framework, and the orchestrator supervises llama-server and the daemon as hidden children, so one double-click brings the whole fleet up and reaps it on quit.',
      'streaming tool-call parser that accumulates fragmented function calls by index: Qwen streams the name first and dribbles arguments across many messages, so calls are only emitted once whole, pinned by a test replaying a real fragmented stream.',
      'always-on wake word: say "Delphi" and she wakes, with a matcher that tolerates how speech-to-text mangles the name without tripping on ordinary words like "delta" or "deli".',
      'a build journal documenting thirteen failures and their causes, including a daemon killed by a logging call in a non-writable working directory and a 500KB bundle truncated by a TCP reset.',
    ],
    stack: ['Rust', 'TypeScript', 'Three.js', 'llama.cpp'],
    repo: `${GH}/oracle-of-delphi`,
  },

  {
    slug: 'nexus-cluster',
    tag: 'systems',
    name: 'nexus_cluster',
    blurb: 'distributed key-value store running Raft consensus.',
    summary:
      'A distributed systems project in Python implementing the Raft consensus algorithm: terms, randomized election timeouts, and the follower/candidate/leader state machine, with the RPC payloads, a bounded TCP transport and a replicated log built alongside it. Partial by design so far — the transport is not yet wired into the node, so vote requests are still stubbed and a node elects itself.',
    highlights: [
      'raft implemented from scratch, no consensus library: RequestVote and AppendEntries built to the field layout in the paper.',
      'node lifecycle management across the Leader / Follower / Candidate states, including election timeouts.',
      'replicated state machine keeps state transitions consistent across every node in the cluster.',
      'custom asyncio TCP transport where every RPC is bounded by a timeout, because a partitioned peer neither accepts nor refuses and an unbounded await there stalls the very election timer meant to detect it.',
      'a fresh election timeout is drawn per election rather than once at startup: a fixed value means two nodes that split a vote wake in the same order every term and split it again.',
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
      'write-ahead log appends every operation to disk before the MemTable is touched, recording intent ahead of effect.',
      'MemTable freezes and flushes to an immutable SSTable via sequential write once it passes 1 MB.',
      'deletes write tombstone markers rather than removing data: SSTables are immutable, so the marker is what makes the newest-first read report a miss.',
      'SSTables are re-adopted on open and the file counter resumes past the highest index, so reopening a database does not shadow or overwrite what is already on disk.',
      'three-layer stack: C++17 engine, Python/FastAPI REST API over ctypes FFI, React/TypeScript dashboard.',
      'not yet built: WAL replay on startup, compaction, and per-file indexes. reads scan each SSTable linearly.',
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
      'characters sort on (position, siteId), not position alone: concurrent inserts into the same gap generate identical fractional positions, and without the tie-break each replica ordered them by arrival and diverged.',
      'sidesteps the failure mode of REST APIs under simultaneous edits by making operations commute instead of ordering them.',
      'prototype: insert is append-only and delete is unimplemented, so this is the merge mechanism working rather than a usable editor.',
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
      'scoped deliberately small: six opcodes, one value type, no control flow and no compiler in front of it — bytecode is hand-assembled to isolate the dispatch loop itself.',
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
    slug: 'cpu-rasterizer',
    tag: 'graphics',
    name: 'cpu_rasterizer',
    blurb: 'a 3d rendering pipeline in plain javascript, no graphics api at all.',
    summary:
      'A real-time software rasterizer that runs in the browser with no WebGL and no Three.js. Every triangle of a procedurally generated torus is transformed by hand-written matrices, culled, shaded, depth-tested and written pixel by pixel into a raw byte buffer, which is then blitted to a canvas with putImageData. A GPU does this thousands of times faster, which is not the point: after writing one, nothing in a graphics API is magic anymore.',
    highlights: [
      'full model-view-projection pipeline written from scratch: Vec3 and Mat4x4 classes, rotation and translation and perspective matrices, and the perspective divide, with no math library.',
      'barycentric coverage test per pixel inside a screen-space bounding box, with the weights divided by the signed area so the test stays correct for either winding order.',
      'z-buffer stores interpolated 1/w rather than post-divide z, because only 1/w interpolates linearly in screen space.',
      'backface culling from the cross product of two triangle edges, discarding roughly half the geometry before it costs anything to shade.',
      'flat shading from a single normal-to-light dot product per triangle, written into a Uint8ClampedArray and blitted in one putImageData call.',
      'toggles expose each stage: barycentric wireframe, culling on and off, and a greyscale render of the depth buffer itself as a correctness check.',
    ],
    stack: ['JavaScript', 'React', 'Vite', 'Canvas'],
    repo: `${GH}/cpu_rasterizer`,
    live: 'https://apollo-2006.github.io/cpu_rasterizer/',
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
      'lag compensation records each head position per server tick and interpolates between the two frames bracketing the shooter\u2019s timestamp, reconstructing where a target was on the shooter\u2019s screen rather than where it is now.',
      'deterministic recoil: a fixed per-shot offset curve makes the spray learnable, with random spread layered on top and scaled by movement speed.',
      'partial: the rewind is built and correct but not yet called from hit validation, which still applies damage to the client-reported target.',
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
      'GPU sensors are polled on their own interval and cached between frames, so a repaint never costs an HTTP round trip \u2014 or a one-second stall when LibreHardwareMonitor is closed.',
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
      'one coherent sample per tick: the CPU is polled once and threaded through the derived readings, so a single logged row cannot disagree with itself.',
      'reads package temps from coretemp/k10temp where the platform exposes them, and models a curve from load where it does not — Windows and WSL block the thermal zones.',
      'logs every sample into a local database for long-term trend analysis rather than a live-only readout.',
      'runs as a background daemon from the command line with minimal overhead.',
      'VRAM clock is modelled from system activity rather than measured; reading the real value needs PyNVML or PyAMDGPUInfo.',
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
      'A Valorant stat tracker that ranks recent high-elo matches by overall efficiency and renders the top five in the terminal. The sorting is a custom Heapsort rather than a library call — the project was as much about sort mechanics and terminal UI as about the stats it surfaces.',
    highlights: [
      'ranks on a composite impact score rather than raw K/D, so a high-kill game with a poor death count does not outrank a cleaner one.',
      'ranks matches with a hand-written Heapsort implementation instead of the standard library sort.',
      'blackout-themed terminal UI built with Rich, showing KDA, KDA ratio, utility usage, and an impact score.',
      'the data source is currently synthetic: the ValorantAPI client generates matches rather than calling the live endpoint. everything downstream of the fetch works unchanged on real data.',
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
    blurb: 'a two-player points economy for real life, live-synced between two phones.',
    summary:
      'SEASON 1: BATTLE FOR THE TOP. A competitive habit tracker my partner and I actually run our weeks on. Workouts, sleep, studying and chores are worth points, slipping costs points, and whoever is ahead holds the top of the leaderboard until the other one takes it back. The whole thing is one self-contained HTML file with no build step and no framework, sitting on Firestore so a claim tapped on one phone shows up on the other instantly.',
    highlights: [
      'one HTML file, no bundler and no framework: the only dependencies are Firebase ES modules imported straight from the CDN.',
      'all state lives in a single Firestore document streamed to both clients through onSnapshot, with an applyingRemote guard so rendering a remote update never echoes a write back into the database.',
      'full points economy: daily habits with prerequisite chains, per-person quests, achievements, penalties, and a shop where points buy real rewards.',
      'four repeating tiers of 15,000 points, so progress bars and colors fall out of arithmetic instead of a hardcoded ladder.',
      'append-only history log doubles as the undo stack: undo finds the last claim for a given key and reverses its delta.',
      'drag-and-drop sticky-note boards with sections and per-note to-do lists, positioned in percentages so a board reads the same on a laptop and a phone.',
      'email auth gates the whole app, and bets let either side stake points on an outcome and settle it later.',
    ],
    stack: ['HTML', 'JavaScript', 'Firebase', 'Firestore'],
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
