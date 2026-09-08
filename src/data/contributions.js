// Upstream open-source work, pulled from the live GitHub state rather than
// written from memory. `state` is the real PR/issue state, merged included, so
// the page can never claim more than GitHub does.
//
// `pairs` are the issue -> PR loops: a bug found and reported, then fixed by
// the same person. Those are the strongest items and lead the page.

export const contributions = [
  {
    id: 'whisper-backend-dl-tests',
    project: 'whisper.cpp',
    org: 'ggml-org',
    kind: 'issue → pr',
    lead: true,
    merged: true,
    issue: { number: 4030, url: 'https://github.com/ggml-org/whisper.cpp/issues/4030', state: 'closed' },
    pr: { number: 4031, url: 'https://github.com/ggml-org/whisper.cpp/pull/4031', state: 'merged' },
    date: '2026-09',
    diff: '+8 / -0',
    title: 'tests abort on a GGML_BACKEND_DL build',
    summary:
      'found the test suite aborting on a valid build configuration, traced it to the real cause, and fixed it in four lines of call sites. merged into master.',
    detail: [
      'with GGML_BACKEND_DL=ON no backend registers until something asks for one, so whisper_init_* ran with devices = 0 and tripped GGML_ASSERT(device) inside ggml_backend_dev_backend_reg.',
      'every example already called ggml_backend_load_all() first; the tests were the only callers that did not. the fix adds that call, with no new includes needed.',
      'corrected my own scope in a follow-up comment: three tests, not two. test-vad aborts identically but is labelled unit rather than gh, so ctest -L gh never reached it.',
      'landed as 79f2d92, closing the issue. ctest -L gh goes from 2 of 4 to 4 of 4 on such a build; a normal build is unaffected.',
    ],
    stack: ['C++', 'CMake', 'ctest'],
  },

  {
    id: 'whisper-macos-release',
    project: 'whisper.cpp',
    org: 'ggml-org',
    kind: 'issue → pr',
    lead: true,
    issue: { number: 4026, url: 'https://github.com/ggml-org/whisper.cpp/issues/4026', state: 'open' },
    pr: { number: 4029, url: 'https://github.com/ggml-org/whisper.cpp/pull/4029', state: 'open' },
    date: '2026-09',
    diff: '+251 / -1',
    title: 'macOS CLI release binaries',
    summary:
      'proposed that releases ship prebuilt macOS binaries, discussed the shape with another contributor in the issue, then wrote the workflow that does it.',
    detail: [
      'two jobs added to release.yml: arm64 on macos-26 and x86_64 on macos-15-intel, then a lipo pass fusing both into a universal tree.',
      'one archive runs on every Mac. GGML_BACKEND_DL=ON with GGML_CPU_ALL_VARIANTS=ON makes backends loadable modules picked at load time, so an M1 and an M4 share a build without either giving up its instructions.',
      'each archive is smoke-tested from an extracted copy rather than from build/bin, so the test exercises what actually ships and catches @loader_path failing to resolve dylibs once the tree leaves the machine that built it.',
    ],
    stack: ['GitHub Actions', 'CMake', 'macOS', 'lipo'],
  },

  {
    id: 'llama-streaming-tool-calls',
    project: 'llama.cpp',
    org: 'ggml-org',
    kind: 'pr',
    pr: { number: 28261, url: 'https://github.com/ggml-org/llama.cpp/pull/28261', state: 'open' },
    date: '2026-09',
    diff: '+33 / -0',
    title: 'document streaming tool calls and the Jinja requirement',
    summary:
      'documented two behaviours that are easy to get wrong and were not written down anywhere, with every claim checked against the source.',
    detail: [
      'streaming tool calls arrive as deltas keyed by index, not as one object. name and id come once on the first chunk; later chunks carry raw JSON argument fragments that must be concatenated per index, so a client parsing any single fragment gets invalid JSON.',
      'with the Jinja path off or a template that is not tool-aware, tool calls come back as plain assistant text and nothing reports an error, which reads like the model ignoring the tools.',
      'claims cite file and line (server-chat.cpp, server-task.cpp, common/chat.cpp), and the example accumulation loop was executed against a simulated interleaved stream before being added.',
    ],
    stack: ['C++', 'OpenAI API', 'technical writing'],
    note: 'this is the reworked version of an earlier PR of mine (#27778) that I closed and resubmitted after tightening it.',
  },

  {
    id: 'whisper-vad-docs',
    project: 'whisper.cpp',
    org: 'ggml-org',
    kind: 'pr',
    pr: { number: 4019, url: 'https://github.com/ggml-org/whisper.cpp/pull/4019', state: 'open' },
    date: '2026-08',
    diff: '+30 / -0',
    title: 'clarify VAD-mode timestamps and model-path errors',
    summary:
      'hit two confusing behaviours in the stream example while building against the library, and wrote them down.',
    detail: [
      'asked the maintainer who wrote the original VAD support a direct question about where the timestamps came from, since I could not settle it from the source alone.',
      'I had it wrong. the answer pointed at vad_simple in the stream example rather than where I was looking, so the documentation went in corrected.',
    ],
    stack: ['C', 'technical writing'],
  },

  {
    id: 'wry-permissionkind-docs',
    project: 'wry',
    org: 'tauri-apps',
    kind: 'issue',
    issue: { number: 1825, url: 'https://github.com/tauri-apps/wry/issues/1825', state: 'open' },
    date: '2026-08',
    title: "PermissionKind's media-capture variants lack the platform-specific block",
    summary:
      'found the gap while building the native shell for oracle_of_delphi: every other PermissionKind variant documents its platform behaviour, the media-capture ones do not.',
    detail: [
      'reported it as platform behaviour rather than API design, and took it to the maintainer closest to that layer.',
    ],
    stack: ['Rust', 'wry'],
  },
];

// counts used in the page intro, derived rather than hardcoded so they cannot
// drift out of step with the list above.
export const contributionStats = {
  repos: new Set(contributions.map((c) => `${c.org}/${c.project}`)).size,
  prs: contributions.filter((c) => c.pr).length,
  issues: contributions.filter((c) => c.issue).length,
  merged: contributions.filter((c) => c.pr && c.pr.state === 'merged').length,
};
