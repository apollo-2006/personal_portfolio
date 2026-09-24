// Upstream open-source work, pulled from the live GitHub state rather than
// written from memory. `state` is the real PR/issue state, merged included, so
// the page can never claim more than GitHub does.
//
// `pairs` are the issue -> PR loops: a bug found and reported, then fixed by
// the same person. Those are the strongest items and lead the page.

export const contributions = [
  {
    id: 'vvl-coopmat-stride',
    project: 'Vulkan-ValidationLayers',
    org: 'KhronosGroup',
    kind: 'issue → pr',
    lead: true,
    merged: true,
    issue: { number: 13098, url: 'https://github.com/KhronosGroup/Vulkan-ValidationLayers/issues/13098', state: 'closed' },
    pr: { number: 13104, url: 'https://github.com/KhronosGroup/Vulkan-ValidationLayers/pull/13104', state: 'merged' },
    date: '2026-09',
    diff: '+82 / -3',
    title: 'GPU-AV crashed instrumenting a runtime cooperative-matrix stride',
    short: 'GPU-AV segfaulted on any cooperative-matrix load with a runtime stride. reported it, then fixed the pass.',
    summary:
      'with GPU-AV on, vkCreateComputePipelines segfaulted on any compute shader whose coopMatLoad or coopMatStore used a stride computed at runtime. reported it with a minimal shader, then wrote the fix. merged into the validation layers.',
    detail: [
      'SharedMemoryDataRacePass read the Stride operand as if it were always a constant, so GetConstantUInt32FromId dereferenced null and took the whole pipeline call down. SPIR-V only requires MemoryLayout to be constant; Stride can be any integer.',
      'constants still take the existing path. a runtime value is now passed straight to the instrumentation call, converted to uint32 with OpBitcast or OpUConvert exactly the way DebugPrintfPass already handles integer arguments.',
      'two regression tests, copies of the existing coopmat positive tests with the stride made runtime. both crash without the change. the rest of the shared-memory data race suite is untouched: 71 passed, 6 skipped, 0 failed on RADV.',
      'found it while chasing something else: it is the validation-layer bug that forced GGML_VK_DISABLE_COOPMAT=1 in the llama.cpp work below.',
    ],
    stack: ['C++', 'SPIR-V', 'Vulkan', 'GPU-AV'],
  },

  {
    id: 'vvl-instruction-boundary',
    project: 'Vulkan-ValidationLayers',
    org: 'KhronosGroup',
    kind: 'issue → pr',
    lead: true,
    merged: true,
    issue: { number: 13134, url: 'https://github.com/KhronosGroup/Vulkan-ValidationLayers/issues/13134', state: 'closed' },
    pr: { number: 13150, url: 'https://github.com/KhronosGroup/Vulkan-ValidationLayers/pull/13150', state: 'merged' },
    date: '2026-09',
    diff: '+59 / -7',
    title: 'GPU-AV decoded a shader offset that never named an instruction',
    short: 'GPU-AV decoded garbage after an out-of-bounds shared memory access. found under llama.cpp, fixed over five review rounds.',
    summary:
      'when an application indexed its shared memory out of bounds, GPU-AV read back a word that was never a packed instruction offset and decoded it anyway, walking off an empty operand list. found it under a real llama.cpp workload, reported it, and wrote the fix. merged into the validation layers.',
    detail: [
      'the shared memory data race check recovers the conflicting offset from the previous contents of a shadow slot. an out-of-bounds index makes that slot out of range too, so the word read back is arbitrary. it can still land inside the module without sitting on an instruction boundary, which underflows remaining_words in Instruction::Describe() and indexes an empty vector.',
      'the maintainer and I settled the shape on the issue first: validate in spirv_logging.cpp, and let Describe() assert the invariant rather than defend against it. the FindOpStructFromBDA path was left alone, because its offset comes from the error record header, which was a real instruction boundary in 2826 of 2826 reports I measured.',
      'reviewed over five rounds by the GPU-AV maintainer, from changes-requested to approved. it took four follow-up commits: report why the source could not be found, return the lookup as one struct, stop assuming every opcode has operands.',
      'verified by forcing a mid-instruction offset on a build with -D_GLIBCXX_ASSERTIONS: abort with exit 134 before, exit 0 and a readable message after, 5292 of 5292 backend tests passing.',
    ],
    stack: ['C++', 'SPIR-V', 'Vulkan', 'GPU-AV'],
  },

  {
    id: 'vvl-gpl-independent-sets',
    project: 'Vulkan-ValidationLayers',
    org: 'KhronosGroup',
    kind: 'pr',
    lead: true,
    merged: true,
    pr: { number: 13208, url: 'https://github.com/KhronosGroup/Vulkan-ValidationLayers/pull/13208', state: 'merged' },
    date: '2026-09',
    diff: '+138 / -62',
    title: 'graphics pipeline libraries with independent sets were never compared',
    short: 'mismatched set layouts in linked pipeline libraries went unreported. found because lavapipe asserted on a test.',
    summary:
      'when a pipeline layout uses independent sets, linked libraries may leave a set null on one side, but two non-null set layouts at the same index must still match (06616/06617). the comparison only ran without independent sets, so a mismatch went unreported. found it because lavapipe asserted on a test that did exactly that.',
    detail: [
      'ran the whole validation layer suite on lavapipe, the CPU Vulkan driver, at the maintainer\'s suggestion. a GPU-AV test linked a storage buffer set against an unused sampler set at the same index, and lavapipe\'s merge_layouts asserted on it in a debug build.',
      'the fix runs the existing set-layout comparison for independent sets too, choosing the 06616 or 06617 VUID by how the pipeline is built. the error text is only picked when an error is actually reported, and the test\'s unused set is now null, as it intended.',
      'two new tests, one per VUID, as asked in review. the maintainer cross-checked it the next morning and merged it.',
    ],
    stack: ['C++', 'Vulkan', 'GPL'],
  },

  {
    id: 'vvl-unorm-tolerance',
    project: 'Vulkan-ValidationLayers',
    org: 'KhronosGroup',
    kind: 'pr',
    merged: true,
    pr: { number: 13209, url: 'https://github.com/KhronosGroup/Vulkan-ValidationLayers/pull/13209', state: 'merged' },
    date: '2026-09',
    diff: '+11 / -11',
    title: 'eleven descriptor heap tests compared a sampled UNORM value exactly',
    short: 'eleven tests compared a sampled float exactly, and lavapipe was one ulp off. now they allow for rounding.',
    summary:
      'the tests sampled 0.2 from an 8-bit UNORM image and compared the float with ==. lavapipe returns 51/255, one ulp off, which the spec allows. they now compare with a tolerance. approved within the hour.',
    detail: [
      'part of the same lavapipe run: a test suite that only ever ran on GPUs had quietly assumed their rounding.',
    ],
    stack: ['C++', 'Vulkan'],
  },

  {
    id: 'vvl-plane-view-format',
    project: 'Vulkan-ValidationLayers',
    org: 'KhronosGroup',
    kind: 'pr',
    pr: { number: 13207, url: 'https://github.com/KhronosGroup/Vulkan-ValidationLayers/pull/13207', state: 'open' },
    date: '2026-09',
    diff: '+79 / -17',
    title: 'a plane view that kept the multi-planar format was never reported',
    short: 'a YCbCr plane view with the wrong format slipped past validation. in review, working through the spec together.',
    summary:
      'VUID 01586 says a single-plane view of a YCbCr image must use a format compatible with that plane. the check only ran when the view format differed from the image format, so a PLANE_0 view that kept the whole multi-planar format slipped through, and lavapipe asserted on it.',
    detail: [
      'moved the check so every single-plane view goes through one place, and added a test that fails on main.',
      'two existing tests created exactly that view. fixing them meant reading 01586, 06658 and 01564 together: a view with a YCbCr conversion must use the conversion\'s multi-planar format, so it cannot be a single-plane view.',
      'still in review. YCbCr is a deep corner of the spec, and the maintainer and I are working through it together.',
    ],
    stack: ['C++', 'Vulkan', 'YCbCr'],
  },

  {
    id: 'vvl-test-portability',
    project: 'Vulkan-ValidationLayers',
    org: 'KhronosGroup',
    kind: 'pr',
    merged: true,
    pr: { number: 13217, url: 'https://github.com/KhronosGroup/Vulkan-ValidationLayers/pull/13217', state: 'merged' },
    date: '2026-09',
    diff: '+38 / -17',
    title: 'tests that only passed on one kind of driver',
    short: 'four tests rewritten to ask the driver for its limits instead of assuming them. merged after two review rounds.',
    summary:
      'the rest of the lavapipe run, in one commit as the maintainer suggested. each test leaned on one implementation\'s limits or had a bug another driver happened to hide.',
    detail: [
      'the one the maintainer asked for: a descriptor alignment test placed its second buffer inside the first, so on drivers with 4-byte alignment spirv-val reported the overlap instead of the alignment error. sizing both members bufferDescriptorSize + 2 puts it just past the first and off the alignment grid on every conformant driver, checked across nine faked size and alignment profiles.',
      'the others: cooperative-matrix tests that assumed 16x16 support, a capture-data size that can be 0, and a sampler descriptor overwritten by the UBO next to it.',
      'a fifth fix, for an access chain with no index, turned into a SPIR-V spec question. the answer confirmed it pointed at heap offset 0 rather than the struct member, and the maintainer took it on in #13219.',
    ],
    stack: ['C++', 'SPIR-V', 'Vulkan'],
  },


  {
    id: 'mesa-heap-data-loads',
    project: 'mesa',
    org: 'mesa',
    kind: 'issue',
    issue: { number: 16396, url: 'https://gitlab.freedesktop.org/mesa/mesa/-/issues/16396', state: 'open' },
    date: '2026-09',
    title: 'descriptor heap data loads lowered as acceleration structure loads',
    short: 'plain descriptor heap reads came back wrong on two drivers. traced into Mesa\'s shared runtime and bisected.',
    summary:
      'a shader reading four plain uints from the descriptor heap got back the wrong values on both lavapipe and RADV. traced it past both drivers to Mesa\'s shared Vulkan runtime, which treated every direct heap load as an acceleration structure load, and bisected it to one commit.',
    detail: [
      'spirv_to_nir output was correct. try_lower_heaps_load_accel_struct in vk_nir_lower_descriptor_heaps.c matched any load rooted at the heap, and each driver then broke differently: lavapipe read shifted values, RADV failed NIR validation in a debug build.',
      'wrote a fix that keeps the acceleration structure path only for the one load shape that can be one, with the descriptor_heap CTS group unchanged on both drivers. the commit\'s author picked the issue up the next morning.',
    ],
    stack: ['C', 'NIR', 'Mesa', 'Vulkan'],
  },

  {
    id: 'mesa-radv-queue-flags',
    project: 'mesa',
    org: 'mesa',
    kind: 'issue',
    issue: { number: 16378, url: 'https://gitlab.freedesktop.org/mesa/mesa/-/issues/16378', state: 'open' },
    date: '2026-09',
    title: 'RADV asserted on destroy with two queues of one family',
    short: 'RADV asserted on a valid queue setup. fixed by a RADV developer the next day, now a CTS ticket.',
    summary:
      'two queue create infos sharing a family index but differing in flags, which the spec allows, left one queue never torn down, so vkDestroyDevice asserted. a RADV developer had a fix up the next day, and it became a Vulkan CTS ticket.',
    detail: [
      'the issue showed why the usage is valid: VUID 02802 requires the family and flags combination to be unique, not the family alone.',
    ],
    stack: ['C', 'RADV', 'Vulkan'],
  },

  {
    id: 'mesa-radv-query-pool',
    project: 'mesa',
    org: 'mesa',
    kind: 'issue',
    issue: { number: 16379, url: 'https://gitlab.freedesktop.org/mesa/mesa/-/issues/16379', state: 'open' },
    date: '2026-09',
    title: 'RADV segfaulted on a result-status-only query pool with no video profile',
    short: 'RADV segfaulted on a valid video query pool. picked up the same day, now a CTS ticket.',
    summary:
      'radv_create_query_pool dereferenced a video profile the spec does not require for this query type. a RADV developer picked it up the same day with a fix now landing, and it became a Vulkan CTS ticket too.',
    detail: [
      'one of four RADV and Mesa bugs found running the validation layer suite on an RX 9070 XT, each reported with the exact test, the crash site and the VUID that shows the application is valid.',
    ],
    stack: ['C', 'RADV', 'Vulkan Video'],
  },

  {
    id: 'llama-vulkan-im2col-align',
    project: 'llama.cpp',
    org: 'ggml-org',
    kind: 'issue → pr',
    lead: true,
    merged: true,
    issue: { number: 28960, url: 'https://github.com/ggml-org/llama.cpp/issues/28960', state: 'closed' },
    pr: { number: 28996, url: 'https://github.com/ggml-org/llama.cpp/pull/28996', state: 'merged' },
    date: '2026-09',
    diff: '+2 / -2',
    title: 'Vulkan im2col shaders wrote through an under-aligned buffer reference',
    short: 'two Vulkan shaders declared the wrong pointer alignment. a one-word fix each, 40 validation errors to zero.',
    summary:
      'two shaders declared a buffer_reference with no alignment, so glslang emitted every write as Aligned 16 while the pointer actually advanced 2 or 4 bytes at a time. a one-word fix in each shader, found by running the validation layers over the Vulkan backend.',
    detail: [
      'VUID-RuntimeSpirv-PhysicalStorageBuffer64-06315 fired 20 times each in im2col.comp and im2col_3d.comp. D_SIZE is 4 for float and 2 for float16_t, so most write addresses were never 16-byte aligned; declaring buffer_reference_align = D_SIZE makes the declared alignment match the real stride.',
      'it is a validation error rather than a wrong answer, so the pass rates do not move: 92 of 92 and 2051 of 2051 before and after. what changes is 40 VUID hits going to zero.',
      'the maintainer asked for the PR on the issue and cleared opening it while another of mine was still active, so it went up alongside rather than behind.',
      'introduced in #16135. tested on an RX 9070 XT on RADV, with coopmat disabled to route around the validation-layer crash I fixed above.',
    ],
    stack: ['GLSL', 'Vulkan', 'SPIR-V'],
  },

  {
    id: 'lemonade-gpu-name',
    project: 'lemonade',
    org: 'lemonade-sdk',
    kind: 'issue → pr',
    lead: true,
    merged: true,
    issue: { number: 3592, url: 'https://github.com/lemonade-sdk/lemonade/issues/3592', state: 'closed' },
    pr: { number: 3601, url: 'https://github.com/lemonade-sdk/lemonade/pull/3601', state: 'merged' },
    date: '2026-09',
    diff: '+69 / -9',
    title: 'AMD GPUs reported by KFD version number instead of their name',
    short: 'an RX 9070 XT reported itself as "120001". added a readable name without breaking ROCm backend selection.',
    summary:
      'on Linux the system-info endpoint named an AMD GPU "120001", the raw gfx_target_version. the obvious fix breaks ROCm backend selection, because that same field is the arch lookup key, so the fix had to add a name rather than replace one.',
    detail: [
      'name doubles as the key select_rocm_arch() looks up, so overwriting it with something readable would have silently changed which backends the machine thinks it can run.',
      'added a separate display_name built from libdrm amdgpu_get_marketing_name(), preferred by the device JSON and falling back to the old value when libdrm returns nothing. family is still derived from the ISA, so backend selection is bit for bit what it was.',
      'the HSA path in the same file already formatted a name this way, so that logic moved into one shared gpu_display_name() helper instead of being written twice.',
      '"120001" now reads "AMD Radeon RX 9070 XT (gfx1201)". ctest -L cpp-ci at 72 of 72, including five new cases for the helper covering either half missing and a driver that reports the ISA as its own marketing name. Windows and macOS untouched.',
    ],
    stack: ['C++', 'libdrm', 'ROCm', 'ctest'],
  },

  {
    id: 'lemonade-embedding-batch',
    project: 'lemonade',
    org: 'lemonade-sdk',
    kind: 'issue → pr',
    lead: true,
    issue: { number: 3591, url: 'https://github.com/lemonade-sdk/lemonade/issues/3591', state: 'open' },
    pr: { number: 3611, url: 'https://github.com/lemonade-sdk/lemonade/pull/3611', state: 'open' },
    date: '2026-09',
    diff: '+6 / -0',
    title: 'embedding requests over 512 tokens failed with a 500 on an 8192-token context',
    short: 'embedding requests over 512 tokens failed on an 8192-token context. the batch size was the real limit.',
    summary:
      'the limit users were told about and the limit they actually hit did not match. the context was raised to 8192 for embedding models but the micro batch was left at llama.cpp\'s default 512, and for a non-causal model the micro batch is the real ceiling.',
    detail: [
      'embedding models have to fit the whole input into one micro batch, so --ubatch-size bounded the request, not --ctx-size. anything past 512 tokens came back as a 500 from llama-server.',
      'both --batch-size and --ubatch-size now follow the context size, inside the existing supports_embeddings branch, so only embedding models change and chat models still accept the flags themselves.',
      'traced it to a regression rather than an oversight: #510 added the two flags for embedding models and #592 later removed them while keeping the context bump.',
      'a 992-token input goes from 500 to 200 with 768 dims, and a 2972-token input now returns a 400 naming the model\'s own trained context instead of a 500. ctest -L cpp-ci at 72 of 72.',
    ],
    stack: ['Python', 'llama.cpp', 'REST'],
  },

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
    short: 'the tests aborted on a valid build configuration. fixed in four call sites.',
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
    merged: true,
    pr: { number: 4047, url: 'https://github.com/ggml-org/whisper.cpp/pull/4047', state: 'merged' },
    date: '2026-09',
    diff: '+3 / -1',
    title: 'cover GGML_BACKEND_DL in CI',
    short: 'a CI leg that would have caught the bug above before it shipped.',
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
    short: 'prebuilt macOS binaries, including one universal archive that picks its CPU backend at load time.',
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
    short: 'an out-of-bounds read on nearly every run, found under UBSan.',
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
    merged: true,
    pr: { number: 4064, url: 'https://github.com/ggml-org/whisper.cpp/pull/4064', state: 'merged' },
    date: '2026-09',
    diff: '+8 / -0',
    title: 'heap out-of-bounds read from a VAD model header',
    short: 'a VAD model header could make whisper read past three heap arrays.',
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
    short: 'undefined behaviour loading quantized tensors, reachable from safe Rust.',
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
    short: 'a heap overflow reachable from safe code that still returned Ok.',
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
    short: 'a malformed merge list produced invalid UTF-8 through an unsafe block, now removed.',
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
    short: 'an empty data file crashed the process through a NULL nobody checked.',
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
    short: 'a release unpacked inside another git repository stamped that repository\'s commit into --version.',
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
    short: 'turn on a compiler warning that catches a missing break in a thousand-line table.',
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
    short: 'a PDF with a backwards function domain panicked the parser.',
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
    merged: true,
    pr: { number: 4019, url: 'https://github.com/ggml-org/whisper.cpp/pull/4019', state: 'merged' },
    date: '2026-08',
    diff: '+30 / -0',
    title: 'clarify VAD-mode timestamps and model-path errors',
    short: 'documented the stream example\'s output formats and a confusing model path error.',
    summary:
      'hit two confusing behaviours in the stream example while building against the library, and wrote them down.',
    detail: [
      'asked the maintainer who wrote the original VAD support a direct question about where the timestamps came from, since I could not settle it from the source alone.',
      'I had it wrong. the answer pointed at vad_simple in the stream example rather than where I was looking, so the documentation went in corrected.',
      'approved by a maintainer on 2026-09-11, merged on 2026-09-18.',
    ],
    stack: ['C', 'technical writing'],
  },

  {
    id: 'lemonade-gui3-favicon',
    project: 'lemonade',
    org: 'lemonade-sdk',
    kind: 'pr',
    pr: { number: 3652, url: 'https://github.com/lemonade-sdk/lemonade/pull/3652', state: 'open' },
    date: '2026-09',
    diff: '+11 / -1',
    title: 'the GUI3 web app had no tab icon and two 404s on every load',
    short: 'the web app had no tab icon and two 404s on every page load.',
    summary:
      'nothing in the web-app build emitted favicon.ico, and the logo path was rewritten in the app CSS but not in the critical CSS inlined into index.html. one webpack plugin now handles both.',
    detail: [],
    stack: ['webpack', 'JavaScript'],
  },

  {
    id: 'llamacpp-rocm-build-number',
    project: 'llamacpp-rocm',
    org: 'lemonade-sdk',
    kind: 'pr',
    pr: { number: 145, url: 'https://github.com/lemonade-sdk/llamacpp-rocm/pull/145', state: 'open' },
    date: '2026-09',
    diff: '+10 / -10',
    title: 'nightly ROCm builds of llama-server all reported build 1',
    short: 'every nightly ROCm build of llama-server reported build 1, because of a shallow clone.',
    summary:
      'llama.cpp takes its build number from git rev-list --count, and the workflow cloned with --depth 1, so the count was always 1. a blobless clone keeps the full history without the download.',
    detail: [],
    stack: ['GitHub Actions', 'git'],
  },

  {
    id: 'therock-rocm-sdk-test-path',
    project: 'TheRock',
    org: 'ROCm',
    kind: 'issue',
    issue: { number: 8219, url: 'https://github.com/ROCm/TheRock/issues/8219', state: 'open' },
    date: '2026-09',
    title: 'rocm_sdk test fails unless the virtual environment is activated',
    short: 'a ROCm SDK test only passed with the virtual environment activated.',
    summary:
      'one test in the ROCm SDK suite runs rocm_sdk through sys.executable but then calls hipconfig by bare name, so it resolves through PATH instead of through the interpreter under test and fails on an unactivated venv.',
    detail: [
      'the other tests in the same file already invoke [sys.executable, "-m", "rocm_sdk", ...]; line 82 is the only bare executable left, and hipDNN\'s own build docs tell people to use exactly the invocation that breaks it.',
      'reported with the traceback, the proof that the install is fine (hipconfig is right there in the venv bin), and two concrete fixes. separated it from #4040, which is the same test failing for a different reason and was fixed in March.',
    ],
    stack: ['Python', 'ROCm', 'unittest'],
  },

  {
    id: 'wry-permissionkind-docs',
    project: 'wry',
    org: 'tauri-apps',
    kind: 'issue',
    issue: { number: 1825, url: 'https://github.com/tauri-apps/wry/issues/1825', state: 'open' },
    date: '2026-08',
    title: "PermissionKind's media-capture variants lack the platform-specific block",
    short: 'media-capture permissions were missing their platform notes in the docs.',
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
