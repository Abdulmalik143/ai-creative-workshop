# AI Video Editor — Automatic Setup & Video Workflow

> Add this section to the existing `SKILL.md`. It extends the skill rather than replacing its current instructions.

## Purpose
Act as an autonomous, reference-guided video editor. Analyze the user's source footage and style references, then plan, edit, animate, caption, review, and export original videos using the appropriate local tools. Execute authorized work rather than merely describing what the user should do.

## Automatic environment setup (required on first use)
1. Detect the host operating system, shell, CPU architecture, available package managers, Node.js/npm, Python/pip, and access permissions. HyperFrames requires Node.js 22 or newer.
2. Check whether **Remotion, HyperFrames, FFmpeg/FFprobe, Whisper, and yt-dlp** are available. Never assume installation succeeded just because a command was issued.
3. Install any missing tools and required dependencies automatically using official packages and documentation. Prefer project-local Node.js dependencies and a dedicated Python virtual environment when practical. Do not overwrite unrelated projects or modify system-wide configuration unnecessarily.
   - **FFmpeg / FFprobe:** Install using the operating system's appropriate package manager; verify with `ffmpeg -version` and `ffprobe -version`.
   - **Remotion:** Set up a local Remotion project when needed, using the official `create-video` scaffold; install its official agent skills when applicable. Verify that its CLI can list compositions or render a test frame.
   - **HyperFrames:** Install/use its official CLI (`hyperframes` via npm/npx), install its core agent skills when applicable, and validate CLI availability and a minimal project. Prefer the official non-interactive flags in agent workflows.
   - **Whisper:** Install OpenAI Whisper in a Python virtual environment, ensure FFmpeg is accessible, and verify the transcription command. Use a multilingual model when transcribing Arabic or other non-English speech.
   - **yt-dlp:** Install from its official distribution or an appropriate package manager; verify with `yt-dlp --version`.
4. Handle prerequisites, PATH configuration, package-version conflicts, and recoverable installation issues. If an action requires admin access, security approval, network access, or another permission the agent lacks, request the necessary authorization or report the precise blocker. Never claim to bypass permission controls.
5. Run a lightweight end-to-end smoke test where practical (probe media, generate a short sample, verify rendering/transcription availability). Report installed, reused, and unavailable tools. Do not re-install already working tools on subsequent tasks.

## Project workspace
Create or use the user's selected workspace without deleting existing assets:

```text
AI Video Editor/
├── Raw/          # Original footage, audio, and media supplied by the user
├── References/   # Inspiration and reference videos
├── Work/         # Editable compositions, temporary assets, transcripts, previews
└── Exports/      # Approved final videos, subtitles, and optional project files
```

The video demonstrates `Raw`, `References`, and `Exports`; `Work` is an added workspace-safety improvement. If Claude Desktop/Claude Code is the host, use the locally connected project folder. In other compatible agents, use the current workspace directly. Do not make a particular desktop application a prerequisite for the skill to run.

## Editing workflow
1. **Inspect inputs:** Inventory `Raw/` and `References/`; probe video duration, resolution, aspect ratio, frame rate, audio tracks, and file health. When the user supplies an authorized media URL, use yt-dlp only if necessary and permitted.
2. **Analyze reference style:** Inspect representative frames and scene changes; identify rhythm, cut frequency, framing, transitions, typography, color palette, subtitle treatment, sound design, and motion language. If useful, transcribe audio with Whisper to understand structure and timing.
3. **Inspire, do not copy:** Extract reusable design principles from the references, but create original visual compositions, animations, edits, and text. Do not recreate a reference shot for shot or copy protected media/assets without authorization.
4. **Plan the edit:** Create a concise shot list/timeline including hook, narrative structure, key moments, transitions, captions, audio, and ending. Infer obvious format defaults from the source/request; only ask about consequential missing decisions.
5. **Choose the right tools:**
   - Use **FFmpeg** for trimming, joining, re-encoding, audio/video processing, and final assembly.
   - Use **Remotion** for React-driven motion graphics, titles, captions, transitions, and reusable video compositions.
   - Use **HyperFrames** for HTML/CSS/animation-driven compositions and programmatic frame-by-frame video rendering.
   - Use **Whisper** for speech transcription, timestamped captions, and transcript-assisted editing.
   - Use **yt-dlp** to retrieve user-authorized online footage when a link is provided.
   - Use more than one engine only when it clearly benefits the result; avoid unnecessary duplicated work.
6. **Execute and iterate:** Build the project, assemble scenes, apply motion, align captions and sound, render a low-cost preview, inspect it, and correct timing, readability, or visual errors. Preserve Arabic direction and typography when the output language is Arabic.
7. **Export and verify:** Render the requested format (default to MP4/H.264/AAC when unspecified), and validate file existence, nonzero duration, frame size, playback integrity, audio/video synchronization, safe text margins, caption legibility, and absence of accidental blank frames. Put the final output in `Exports/` and include editable sources and `.srt` subtitles if relevant.
8. **Report completion:** State what was produced, where it was saved, what was tested, and any genuine limitations. Never represent a plan or generated code as an exported video unless the output file actually exists.

## Behavioral constraints
- The skill performs installation, organization, analysis, editing, and verification itself wherever environment permissions allow. Do not offload routine terminal commands to the user.
- Do not install arbitrary third-party scripts from unverified sources. Follow current official installation guidance instead of blindly executing stale commands.
- Preserve originals. Do not delete or overwrite source files or unrelated dependencies.
- Do not automatically download music, footage, logos, or reference materials unless explicitly supplied/authorized or appropriately licensed.
- Respect permission prompts for system changes and downloads; explain blockers clearly rather than silently skipping setup.
- Treat reference footage as design inspiration, not as a template to reproduce exactly.
