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
    id: 'whisper-backend-dl-ci',
    project: 'whisper.cpp',
    org: 'ggml-org',
    kind: 'pr',
    pr: { number: 4047, url: 'https://github.com/ggml-org/whisper.cpp/pull/4047', state: 'open' },
    date: '2026-09',
    diff: '+3 / -1',
    title: 'cover GGML_BACKEND_DL in CI',
    summary:
      'the follow-up to the merged fix above: a CI leg that would have caught the bug before it shipped, so it cannot quietly come back.',
    detail: [
      '#4030 shipped because no workflow paired the two. build-clang, build-gcc and build-sanitize run ctest -L gh without GGML_BACKEND_DL; release.yml sets it but runs no tests.',
      'adds a backend_dl OFF/ON axis to ubuntu-22-clang-arm64, a native arm64 runner that already runs ctest on every PR. two legs become four.',
      'checked that the guard actually guards: with #4031 reverted the ON legs fail at 2 of 4, on master they pass 4 of 4. all four legs green on a fork run.',
      'the ccache key gains the axis too, since ccache is auto-detected even with no launcher set and the OFF and ON legs would otherwise race to save one entry on master.',
    ],
    stack: ['GitHub Actions', 'CMake', 'ctest'],
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
    id: 'espeak-voice-oob',
    project: 'espeak-ng',
    org: 'espeak-ng',
    kind: 'pr',
    pr: { number: 2530, url: 'https://github.com/espeak-ng/espeak-ng/pull/2530', state: 'open' },
    date: '2026-09',
    diff: '+3 / -1',
    title: 'out-of-bounds read on ordinary voice selection',
    summary:
      'a size_t subtraction in SelectVoiceByName wraps for two-character voice identifiers, so selecting a voice reads one byte before a heap string, on essentially every run. found under UBSan.',
    detail: [
      'three voices sit at the top level of espeak-ng-data/voices, so their identifiers are two characters. strlen(id) - last_part_len is evaluated as unsigned, wraps, and strcasecmp reads id[-1].',
      'CI never saw it: the ubsan leg runs with halt_on_error=1 but its clang does not apply the pointer-overflow check, and valgrind reports zero errors because id[-1] still lands inside the same heap block.',
      'the fix hoists the length into an int and skips identifiers too short to match. phoneme output is byte-identical across all 151 voices, and the clang UBSan suite goes from 15 failures to 19 of 19.',
    ],
    stack: ['C', 'UBSan', 'valgrind'],
  },

  {
    id: 'whisper-vad-layers',
    project: 'whisper.cpp',
    org: 'ggml-org',
    kind: 'pr',
    pr: { number: 4064, url: 'https://github.com/ggml-org/whisper.cpp/pull/4064', state: 'open' },
    date: '2026-09',
    diff: '+8 / -0',
    title: 'heap out-of-bounds read from a VAD model header',
    summary:
      'a VAD model that declares any number of encoder layers other than four overruns three heap arrays at load, reachable from whisper-cli --vad on a user-supplied model.',
    detail: [
      'n_encoder_layers comes from the file and sizes three arrays, but the encoder graph is hardcoded to four layers and indexes them [0..3] whatever the file said.',
      'a crafted three-layer model aborts, and ASan reports a heap-buffer-overflow. the fix rejects the value right after it is read, matching the existing n_dims guard.',
      'a real silero v6.2.0 model still transcribes, and test-vad and test-vad-full pass.',
    ],
    stack: ['C++', 'AddressSanitizer'],
  },

  {
    id: 'candle-ggml-slice',
    project: 'candle',
    org: 'huggingface',
    kind: 'pr',
    pr: { number: 3963, url: 'https://github.com/huggingface/candle/pull/3963', state: 'open' },
    date: '2026-09',
    diff: '+99 / -3',
    title: 'undefined behaviour loading quantized GGML tensors',
    summary:
      'a public, safe loader reinterpreted a byte slice as quantized blocks with no length or alignment check. Miri reports a dangling reference, and a debug build aborts on an unaligned buffer.',
    detail: [
      'the length was never compared against the buffer, which the issue had missed: a short buffer produced a slice past the end of its allocation. that is now an error.',
      'the issue proposed asserting alignment. under Miri that rejects an ordinary well-formed tensor, because a byte buffer\'s alignment is the allocator\'s choice, so the fix borrows when aligned and copies when not.',
      'tests assert on loaded contents rather than on which branch ran, so they hold under any allocator. candle-core: 232 passed, and Miri reports no undefined behaviour.',
    ],
    stack: ['Rust', 'Miri', 'unsafe'],
  },

  {
    id: 'candle-safetensors-copy',
    project: 'candle',
    org: 'huggingface',
    kind: 'pr',
    pr: { number: 3965, url: 'https://github.com/huggingface/candle/pull/3965', state: 'open' },
    date: '2026-09',
    diff: '+91 / -2',
    title: 'heap overflow in Tensor::from_raw_buffer',
    summary:
      'on the unaligned path the copy moved every byte of the input into a buffer sized for whole elements only, so a seven-byte f32 buffer wrote past its allocation and still returned Ok.',
    detail: [
      'a write, not a read, and reachable from safe public API. Miri pins it to the copy in convert_slice.',
      'the copy now matches the allocation, which is what the aligned branch already did. the PR names the wider question, whether a non-multiple length should be an error, as the maintainers\' call.',
      'separate from an existing shape-mismatch issue: the failing case has shape [1] and one element, so the shapes agree and that fix would not reach it.',
    ],
    stack: ['Rust', 'Miri', 'unsafe'],
  },

  {
    id: 'tokenizers-bpe-prefix',
    project: 'tokenizers',
    org: 'huggingface',
    kind: 'pr',
    pr: { number: 2398, url: 'https://github.com/huggingface/tokenizers/pull/2398', state: 'open' },
    date: '2026-09',
    diff: '+68 / -15',
    title: 'invalid UTF-8 and panics from a malformed BPE merge list',
    summary:
      'building a BPE model stripped the continuing-subword prefix by byte offset without checking the token had it, then built a str with from_utf8_unchecked. a malformed tokenizer file, not even a malicious one, reaches three failures.',
    detail: [
      'the offset can land inside a multi-byte character, producing a str that is not valid UTF-8; the subtraction can underflow; and the scratch buffer can be too small for the merged token.',
      'str::strip_prefix removes the prefix only when present, so it always cuts on a character boundary, and the unsafe block is gone. well-formed vocabularies produce byte-identical tokens.',
      'three regression tests, one per failure, each failing with its own error before the fix. 258 passed including the real GPT-2 vocabulary.',
    ],
    stack: ['Rust', 'unsafe', 'UTF-8'],
  },

  {
    id: 'espeak-truncated-data',
    project: 'espeak-ng',
    org: 'espeak-ng',
    kind: 'pr',
    pr: { number: 2537, url: 'https://github.com/espeak-ng/espeak-ng/pull/2537', state: 'open' },
    date: '2026-09',
    diff: '+61 / -2',
    title: 'crash on a zero-length phoneme data file',
    summary:
      'ReadPhFile treated an empty file as success and returned a NULL buffer that none of its callers checked, so a zero-byte phontab from a truncated download or full disk segfaults the process.',
    detail: [
      'all four files it loads reproduce it. the same branch also leaked the file handle, which cppcheck flags independently.',
      'the load now fails with a message that names the file, and the unexpected-end-of-file status finally has text instead of printing as an unspecified error.',
      'the new test checks for that message, not just the absence of a signal: a sanitizer build turns the crash into exit status 1, so a signal check alone passes against the unfixed code.',
    ],
    stack: ['C', 'AddressSanitizer', 'cppcheck'],
  },

  {
    id: 'llama-build-info',
    project: 'llama.cpp',
    org: 'ggml-org',
    kind: 'pr',
    pr: { number: 28462, url: 'https://github.com/ggml-org/llama.cpp/pull/28462', state: 'open' },
    date: '2026-09',
    diff: '+33 / -3',
    title: 'build info taken from the wrong git repository',
    summary:
      'the build asked git for the commit and build number without checking the answer came from llama.cpp itself. a release tarball unpacked inside any other repository stamped that repository\'s HEAD into --version.',
    detail: [
      'git searches parent directories, so both values came from whatever repository sat above the tree: a well-formed hash that resolves to nothing.',
      'found a second path the issue did not report: the script-mode run the web UI build uses resolves against the working directory, so it takes the wrong repository too.',
      'checked across four placements before and after; a tree that is its own checkout is unchanged, and a tarball inside another repository now reports unknown.',
    ],
    stack: ['CMake', 'git'],
  },

  {
    id: 'espeak-fallthrough',
    project: 'espeak-ng',
    org: 'espeak-ng',
    kind: 'pr',
    pr: { number: 2529, url: 'https://github.com/espeak-ng/espeak-ng/pull/2529', state: 'open' },
    date: '2026-09',
    diff: '+34 / -11',
    title: 'catch a missing break in the language table at compile time',
    summary:
      'a missing break in the thousand-line language switch silently gives one language another\'s settings, and the audio-hash tests invite pasting in the new hash. -Wimplicit-fallthrough now catches it.',
    detail: [
      'reintroducing the exact bug from the issue is flagged by both CI compilers, gcc 16 and clang 22, at the line numbers quoted in the PR.',
      'the existing intentional fall-throughs are annotated, and the warning is scoped to the library target so the vendored ucd-tools stays untouched.',
    ],
    stack: ['C', 'CMake', 'compiler warnings'],
  },

  {
    id: 'pdf-rs-robustness',
    project: 'pdf',
    org: 'pdf-rs',
    kind: 'pr',
    pr: { number: 296, url: 'https://github.com/pdf-rs/pdf/pull/296', state: 'open' },
    // a second, smaller PR to the same repository, described in the detail below
    companion: { number: 295, url: 'https://github.com/pdf-rs/pdf/pull/295', state: 'open' },
    date: '2026-09',
    diff: '+31 / -2',
    title: 'panic on a sampled function with an inverted domain',
    summary:
      'f32::clamp panics when its bounds are reversed, and a PDF can declare a function domain written backwards, so evaluating it crashed the parser. bounds are now ordered first, as the stitching function already did.',
    detail: [
      'a companion PR, #295, reads a /P permissions value written as an unsigned 32-bit integer, which made encrypted files from some producers impossible to open with any password.',
    ],
    stack: ['Rust', 'PDF'],
  },

  {
    id: 'whisper-vad-docs',
    project: 'whisper.cpp',
    org: 'ggml-org',
    kind: 'pr',
    pr: { number: 4019, url: 'https://github.com/ggml-org/whisper.cpp/pull/4019', state: 'open', review: 'approved' },
    date: '2026-08',
    diff: '+30 / -0',
    title: 'clarify VAD-mode timestamps and model-path errors',
    summary:
      'hit two confusing behaviours in the stream example while building against the library, and wrote them down.',
    detail: [
      'asked the maintainer who wrote the original VAD support a direct question about where the timestamps came from, since I could not settle it from the source alone.',
      'I had it wrong. the answer pointed at vad_simple in the stream example rather than where I was looking, so the documentation went in corrected.',
      'approved by a maintainer on 2026-09-11, waiting on merge.',
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
  prs: contributions.filter((c) => c.pr).length + contributions.filter((c) => c.companion).length,
  issues: contributions.filter((c) => c.issue).length,
  merged: contributions.filter((c) => c.pr && c.pr.state === 'merged').length +
    contributions.filter((c) => c.companion && c.companion.state === 'merged').length,
  // approved but not yet merged. `review` is GitHub's review decision, kept
  // separate from `state` because an approved PR is still open.
  approved: contributions.filter((c) => c.pr && c.pr.state === 'open' && c.pr.review === 'approved').length,
};
