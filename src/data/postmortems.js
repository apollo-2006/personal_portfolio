// The four post-mortems. Each gets its own page under /research/<slug> and its
// own sub-star in the research orbit on the homepage. The page is the summary;
// the PDF is the full writeup.
export const postmortems = [
  {
    slug: 'allocator',
    title: 'The Block That Was Too Small to Free',
    project: 'custom_mem_alloc',
    projectHref: '/projects/custom-mem-alloc',
    orbitLabel: 'the allocator bug',
    orbitDesc: 'the block too small to free',
    eyebrow: 'custom_mem_alloc · C, pthreads',
    blurb:
      'an intrusive free list stores its next pointer inside the freed block. ask it for four bytes and the pointer does not fit, so freeing corrupts the block next door.',
    topics: ['intrusive lists', 'minimum block size', 'heap corruption'],
    pages: 3,
    pdf: '/abir-deol-postmortem-allocator.pdf',
    abstract:
      'It presented as a double free, it was reported at a point in the program unrelated to the actual fault, and the root cause was that I had never asked what happens when a caller requests fewer bytes than my own bookkeeping needs to occupy. The fix is two lines. Finding it was not.',
    sections: [
      {
        heading: 'the symptom',
        body: 'A test program allocating and freeing mixed sizes in a loop would segfault, but not at the same iteration twice, and sometimes not at all. The stack trace always pointed inside my free list traversal, on the line that follows a next pointer.',
      },
      {
        heading: 'root cause',
        body: 'The free list is intrusive: a free block stores the address of the next free block inside its own payload. A caller asks for four bytes, gets four bytes, and frees them. free casts that payload to a node pointer and writes eight bytes into it. The other four land in the header of the physically adjacent block. A block never corrupts itself, it corrupts its neighbour, and the neighbour does not complain until something traverses it.',
      },
      {
        heading: 'the fix',
        body: 'Enforce a floor of sizeof(free_node) on every allocation before aligning, not after. Splitting follows the same rule: only split if the remainder is still large enough to be a legal free block. The wider lesson is that intrusive containers impose a minimum element size that belongs to the container, not to the caller.',
      },
    ],
  },

  {
    slug: 'tombstones',
    title: 'The Delete That Did Not Delete',
    project: 'nexus_db',
    projectHref: '/projects/nexus-db',
    orbitLabel: 'the tombstone bug',
    orbitDesc: 'the delete that did not delete',
    eyebrow: 'nexus_db · C++17',
    blurb:
      'the flush path dropped tombstones it judged redundant, using a definition of redundant that only looked at the memtable. delete a key that already reached disk and the deletion evaporated.',
    topics: ['LSM trees', 'tombstones', 'compaction'],
    pages: 3,
    pdf: '/abir-deol-postmortem-tombstones.pdf',
    abstract:
      'Under an entirely ordinary sequence of operations, deleted keys came back. The cause was an optimization in the flush path that discarded tombstones it judged redundant, using a definition of redundant that considered only memory and ignored every record already written to disk.',
    sections: [
      {
        heading: 'the symptom',
        body: 'Delete a key and read it back immediately and the delete held. Write the key, flush, delete it, flush again, and the old value returned. Reads served from memory were right; reads served after the second flush were wrong, which narrows the fault to the flush path without any further work.',
      },
      {
        heading: 'root cause',
        body: 'The flush loop asked whether a tombstone shadowed any live value in the memtable it was currently writing. If not, it dropped the tombstone to save space. That is a correct test of the wrong question: what matters is whether the tombstone shadows anything in the whole tree, and almost all of the tree is on disk, in files the loop never consults.',
      },
      {
        heading: 'the fix',
        body: 'Flush unconditionally. Tombstones are still collected, but only during compaction, and only when the merge consuming them also consumes every older record for that key. The rule this generalizes to: the component that deletes information must be the component that can see all of it. Flush sees one memtable and was never entitled to that decision.',
      },
    ],
  },

  {
    slug: 'order-pool',
    title: 'The Order That Was in Two Places',
    project: 'nano_match',
    projectHref: '/projects/nano-match',
    orbitLabel: 'the order book bug',
    orbitDesc: 'a use-after-free that never crashed',
    eyebrow: 'nano_match · C++',
    blurb:
      'a cancelled order went back to the pool while a price level still pointed at it. the next order reused the slot, the book crossed, and nothing crashed.',
    topics: ['object pools', 'use-after-free', 'price-time priority'],
    pages: 3,
    pdf: '/abir-deol-postmortem-order-pool.pdf',
    abstract:
      'A use-after-free that never crashed. The engine kept running and kept producing fills, at prices that were not real and in an order that violated the single guarantee a matching engine exists to provide. That it stayed silent was the problem.',
    sections: [
      {
        heading: 'the symptom',
        body: 'The book crossed: a bid resting above the best ask, which cannot survive a matching pass in a correct engine. Fills also came out of sequence within a price level. No crash, no assertion, no allocator complaint. Every pointer being followed was a legal pointer to a live order object. It was simply the wrong one.',
      },
      {
        heading: 'root cause',
        body: 'Cancellation after a partial fill released the order to the pool without unlinking it from its price level first, a step the full-fill path did do. The next inbound order acquired that same slot and linked it into a different level. One object, two intrusive lists, one set of link pointers between them. The old level now walks into an order at a price that has nothing to do with it.',
      },
      {
        heading: 'the fix',
        body: 'Unlink before release, and then stop trusting call sites to remember: the pool asserts on release that the object is linked nowhere, and a generation counter makes any future instance provable from a log. Fixing the caller fixes an instance. Enforcing at the boundary fixes the class.',
      },
    ],
  },

  {
    slug: 'election-timeouts',
    title: 'A Cluster That Could Not Keep a Leader',
    project: 'nexus_cluster',
    projectHref: '/projects/nexus-cluster',
    orbitLabel: 'the raft timeout bug',
    orbitDesc: 'when the runtime pauses too long',
    eyebrow: 'nexus_cluster · Python, Raft',
    blurb:
      'i copied the election timeout from the raft paper along with its assumption that the network is the slow part. on one machine there is no network, and gc pauses were wider than the timeout.',
    topics: ['raft', 'failure detectors', 'tail latency'],
    pages: 3,
    pdf: '/abir-deol-postmortem-election-timeouts.pdf',
    abstract:
      'A cluster that could not hold a leader, with no network, no partition and no packet loss, because every node was on one machine. The election timeouts I took from the Raft paper were shorter than the pauses my own runtime could produce, so the cluster spent its time deposing leaders that were merely busy.',
    sections: [
      {
        heading: 'the symptom',
        body: 'Leadership churned. A leader would be elected correctly and replaced seconds later with nothing having failed. Term numbers climbed steadily and throughput was poor because the cluster was always mid-election. Every node was following the protocol exactly; it was correctly responding to a false signal.',
      },
      {
        heading: 'root cause',
        body: 'The leader was not failing, it was pausing, and the timeout was smaller than the pause. Serializing a batch of log entries runs under the interpreter lock, and garbage collection stops the process, and a Raft node under write load produces a lot of short-lived garbage. With every node sharing one CPU, those pauses correlate across the cluster, which is the worst case for a failure detector.',
      },
      {
        heading: 'the fix',
        body: 'Measure the delivery gap distribution, then set the timeout above the observed tail rather than the average, keeping the randomization. Shrink the work done inline on the heartbeat path. The general form: a timeout constant carries assumptions about its environment, and copying the number without copying the environment imports a belief you have not checked.',
      },
    ],
  },
];
