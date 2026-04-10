<script lang="ts">
  import { goto } from "$app/navigation";
  import { base } from "$app/paths";
  import Option from "$lib/components/Option.svelte";
  import { fade } from "svelte/transition";
  import type { OptionValue } from "$lib/types";
  import { onMount } from "svelte";
  import { Howl } from "howler";
  import { animate } from "animejs";

  import Control from "$lib/components/Control.svelte";
  import SettingsOption from "$lib/components/SettingsOption.svelte";

  const profileTitleLine1 = "WEB";
  const profileTitleLine2 = "PROFILE";
  const profileTagline =
    "Tugb — UI & digital experience · Svelte, design systems, and crisp details";
  const credit = { label: "GitHub", href: "https://github.com" };

  /** Bump if the browser caches an old video file. */
  const BACKGROUND_VIDEO_CACHE = "2";
  /** Place the asset at static/background.webm */
  const backgroundVideoSrc = `${base}/background.webm?v=${BACKGROUND_VIDEO_CACHE}`;

  const options: OptionValue[] = [
    {
      name: "ABOUT",
      description: "Short intro",
      rotation: -25,
      zIndex: 1,
      offsetX: -60,
      offsetY: 55,
      detail:
        "I focus on fast, accessible, pleasant frontends. This site is a Persona 3 Reload–style profile — keyboard navigation, optional audio, and consistent type.\n\nEdit the name, bio, and links at the top of +page.svelte to match your identity.",
      link: { label: "Email", href: "mailto:hello@example.com" }
    },
    {
      name: "PROJECTS",
      description: "Work & portfolio",
      rotation: -15,
      zIndex: 0,
      offsetX: 0,
      offsetY: 30,
      detail:
        "Screenshot gallery (no live URLs — many builds ran on client servers only). Open the dedicated page via the link below.",
      link: { label: "View project gallery", href: `${base}/projects` }
    },
    {
      name: "SKILLS",
      description: "Stack & tools",
      rotation: -20,
      zIndex: 1,
      offsetX: -50,
      offsetY: 35,
      detail:
        "Frontend: SvelteKit, TypeScript, Tailwind CSS v4\nMotion: anime.js · Audio: Howler\nTooling: Vite, Git · Design: Figma (components & color tokens)\n\nAdd backend or DevOps if it applies to you."
    },
    {
      name: "EXPERIENCE",
      description: "Work history",
      rotation: -15,
      zIndex: 2,
      offsetX: -80,
      offsetY: 40,
      detail:
        "2024 — present · Your role — team, product, and measurable impact.\n2022 — 2024 · Previous role — stack and responsibilities.\n\nReplace years and titles with your CV."
    },
    {
      name: "STUDY",
      description: "Education",
      rotation: 0,
      zIndex: 0,
      offsetX: 0,
      offsetY: 15,
      detail:
        "Degree / major — university — graduation year\nShort courses: certificates or bootcamps (optional)\n\nFill in real degrees and institutions."
    },
    {
      name: "CONTACT",
      description: "Get in touch",
      rotation: -14,
      zIndex: 1,
      offsetX: -40,
      offsetY: 20,
      detail:
        "Open to collaboration, freelance, or technical chat. Replies within about 1–2 business days. Please use a clear email subject.",
      link: { label: "Email", href: "mailto:hello@example.com" }
    },
    {
      name: "SOCIAL",
      description: "Social profiles",
      rotation: -8,
      zIndex: 2,
      offsetX: -20,
      offsetY: 20,
      detail:
        "LinkedIn for work history · GitHub for code · X or Bluesky for short notes (optional).\n\nPoint to the accounts you care about.",
      link: { label: "LinkedIn", href: "https://linkedin.com" }
    },
    {
      name: "BLOG",
      description: "Writing & notes",
      rotation: -5,
      zIndex: 1,
      offsetX: -60,
      offsetY: 10,
      detail:
        "Topics you might write about: frontend architecture, accessibility, or weekly learning notes.\n\nUpdate the link below when you have a blog or newsletter.",
      link: { label: "Blog / writing", href: "https://example.com/blog" }
    },
    {
      name: "RESUME",
      description: "Download CV",
      rotation: 8,
      zIndex: 0,
      offsetX: 0,
      offsetY: 0,
      detail:
        "Put your PDF at static/cv.pdf (or change the href on this item). A one-pager plus selected projects is often easier to read than a long file.",
      link: { label: "Download CV (PDF)", href: "/cv.pdf" }
    }
  ];

  const musicTracks = [
    "Changing Seasons -Reload-.mp3",
    "Color Your Night.mp3",
    "Full Moon Full Life.mp3",
    "It's Going Down Now.mp3",
    "Mass Destruction -Reload-.mp3",
    "When The Moon's Reaching Out Stars -Reload-.mp3",
    "キミの記憶 -Reload-.mp3",
    "全ての人の魂の戦い.mp3",
    "巌戸台分寮 -Reload-.mp3"
  ];

  let backgroundVideo: HTMLVideoElement;
  /** Unsupported codec / bad file / zero dimensions — not a layering issue */
  let videoPlaybackIssue = $state(false);
  let isStarted = $state(false);
  let isMusicEnabled = $state(true);
  let isSFXEnabled = $state(true);
  let selectedIndex = $state(0);
  let settingsOptionElement = $state<HTMLDivElement>();
  let currentSettingIndex = $state(0);

  const navigationSound = new Howl({
    src: ["/sfx/navigation.wav"],
    volume: 0.5,
  });

  function setIndex(index: number) {
    if (index === selectedIndex) return;
    selectedIndex = index;
    playSound();
  }

  function setSettingsIndex(index: number) {
    if (index === currentSettingIndex) return;
    currentSettingIndex = index;
    animate(settingsOptionElement!, {
      translateY: index * 56,
      duration: 100,
      easing: "easeOutQuad"
    });
  }

  function openActiveLink() {
    const href = options[selectedIndex]?.link?.href;
    if (!href) return;
    if (href.startsWith("mailto:") || href.startsWith("tel:")) {
      window.location.href = href;
      return;
    }
    if (href.startsWith("http://") || href.startsWith("https://")) {
      try {
        const u = new URL(href);
        if (u.origin === window.location.origin) {
          void goto(u.pathname + u.search + u.hash);
          return;
        }
      } catch {
        /* fall through */
      }
      window.open(href, "_blank", "noopener,noreferrer");
      return;
    }
    void goto(href);
  }

  function onBackgroundVideoMeta(e: Event & { currentTarget: HTMLVideoElement }) {
    const v = e.currentTarget;
    if (v.videoWidth < 2 || v.videoHeight < 2) videoPlaybackIssue = true;
  }

  function onBackgroundVideoError() {
    videoPlaybackIssue = true;
  }

  function start() {
    isStarted = true;
    queueMicrotask(() => {
      const v = backgroundVideo;
      if (!v) return;
      void v.play().catch(() => {
        videoPlaybackIssue = true;
      });
    });

    if (isMusicEnabled) {
      const randomIndex = Math.floor(Math.random() * musicTracks.length);
      new Howl({
        src: `/music/${musicTracks[randomIndex]}`,
        loop: true,
        autoplay: true,
        volume: 0.5,
      });
    }
  }

  function playSound() {
    if (isSFXEnabled) {
      navigationSound.play();
    }
  }

  onMount(() => {
    setIndex(0);

    document.addEventListener("keydown", (e) => {
      if (!isStarted) return;

      if (e.key === "ArrowDown" || e.key === "s") {
        setIndex((selectedIndex + 1) % options.length);
      } else if (e.key === "ArrowUp" || e.key === "w") {
        setIndex((selectedIndex - 1 + options.length) % options.length);
      } else if (e.key === "Enter") {
        openActiveLink();
      }
    });
  });
</script>

<main
  class="relative isolate min-h-[100dvh] w-full overflow-x-hidden overflow-y-auto lg:min-h-screen lg:overflow-x-auto lg:overflow-y-hidden"
>
  <div class="pointer-events-none absolute inset-0 z-0 bg-bg-dark" aria-hidden="true"></div>
  <!-- svelte-ignore a11y_media_has_caption -->
  <video
    bind:this={backgroundVideo}
    loop
    muted
    playsinline
    preload="auto"
    onloadedmetadata={onBackgroundVideoMeta}
    onerror={onBackgroundVideoError}
    class="pointer-events-none absolute inset-0 z-[1] h-full min-h-screen w-full object-cover object-left [transform:translateZ(0)]"
  >
    <source src={backgroundVideoSrc} type="video/webm" />
  </video>

  {#if videoPlaybackIssue}
    <p
      class="fixed bottom-4 left-4 z-[100] max-w-lg rounded bg-black/70 px-3 py-2 font-sans text-xs leading-snug text-fg/90"
    >
      Video failed to decode (HTTP 304 is normal). Try: export to WebM VP9/VP8 + Opus/Vorbis, ensure
      static/background.webm exists, bump BACKGROUND_VIDEO_CACHE, or hard refresh (Ctrl+Shift+R). Older Safari has
      limited WebM — test in Chrome/Edge/Firefox.
    </p>
  {/if}

  <div
    class="relative z-10 w-full min-w-0 min-h-[100dvh] overflow-hidden pb-36 lg:min-w-[1200px] lg:h-screen lg:pb-0"
  >
    {#if !isStarted}
      <div
        class="fixed inset-0 z-20 flex flex-col items-center justify-center gap-16 bg-bg/90 px-4 py-8 lg:gap-32"
        transition:fade
      >
        <div class="max-w-full rotate-3 space-y-3 text-center lg:space-y-2 lg:text-left">
          <h1
            class="bg-fg px-4 py-3 text-4xl tracking-[-0.08em] text-bg sm:px-6 sm:py-4 sm:text-5xl lg:text-6xl"
          >
            {profileTitleLine1}<br>
            {profileTitleLine2}
          </h1>
          <h2
            class="mx-auto flex max-w-2xl flex-col items-stretch gap-3 text-base italic sm:flex-row sm:items-center sm:gap-2 sm:text-lg lg:text-xl font-new-rodin text-shadow-under"
          >
            <span class="text-pretty">{profileTagline}</span>
            <hr class="hidden border border-fg shadow-under sm:block sm:grow sm:shrink-0">
            <a href={credit.href} class="shrink-0 sm:whitespace-nowrap" rel="noopener noreferrer">
              {credit.label}
            </a>
          </h2>
        </div>

        <div class="relative flex w-full max-w-[32rem] flex-col gap-2 px-2">
          <SettingsOption onSelect={() => setSettingsIndex(0)} isSelected={currentSettingIndex === 0} bind:value={isMusicEnabled}>
            Toggle Music
          </SettingsOption>
          <SettingsOption onSelect={() => setSettingsIndex(1)} isSelected={currentSettingIndex === 1} bind:value={isSFXEnabled}>
            Toggle SFX
          </SettingsOption>

          <div
            bind:this={settingsOptionElement}
            class="absolute -top-2 -right-1 -z-1 h-12 w-full max-w-[32rem] rounded-md bg-red"
          ></div>
        </div>

        <button onclick={start} class="flex cursor-pointer items-center gap-3 text-4xl sm:gap-4 sm:text-5xl lg:text-6xl">
          <span class="tracking-[-0.05em]">ENTER</span>
          <iconify-icon icon="mdi:arrow-right-bold" class="text-4xl sm:text-5xl lg:text-6xl"></iconify-icon>
        </button>
      </div>
    {/if}

    <!-- Mobile: strip menu -->
    {#if isStarted}
      <nav
        class="fixed left-0 right-0 top-0 z-[38] border-b border-fg/25 bg-bg-dark/90 pt-[max(0.5rem,env(safe-area-inset-top))] backdrop-blur-md lg:hidden"
        aria-label="Choose section"
      >
        <div
          class="flex gap-2 overflow-x-auto px-3 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {#each options as opt, i}
            <button
              type="button"
              class="shrink-0 rounded border-2 px-3 py-1.5 font-skip text-xs font-bold tracking-tight transition-all active:scale-[0.98] sm:text-sm {selectedIndex ===
              i
                ? 'border-fg bg-fg text-bg'
                : opt.name === 'PROJECTS'
                  ? 'border-pink/70 bg-bg/40 text-button-2 ring-1 ring-pink/30 hover:border-pink hover:bg-bg/55 hover:ring-pink/50'
                  : 'border-border/80 bg-bg/40 text-button-3 hover:border-button-2 hover:bg-bg/55'}"
              onclick={() => setIndex(i)}
            >
              {opt.name}
            </button>
          {/each}
        </div>
      </nav>
    {/if}

    <!-- Detail panel: right on desktop, bottom sheet on mobile -->
    {#if isStarted}
      <div
        class="pointer-events-auto fixed bottom-[8.75rem] left-3 right-3 z-40 max-h-[42vh] overflow-y-auto rounded-md border border-border/50 bg-bg-dark/85 p-3 text-left font-new-rodin text-shadow-under backdrop-blur-sm lg:absolute lg:bottom-auto lg:left-auto lg:top-24 lg:right-6 lg:max-h-none lg:max-w-[min(26rem,calc(100vw-3rem))] lg:overflow-visible lg:border-0 lg:bg-transparent lg:p-0 lg:text-right lg:backdrop-blur-none"
      >
        <p
          class="border-l-4 border-pink py-1 pl-3 text-base italic leading-snug text-fg/90 lg:border-l-0 lg:border-r-4 lg:pr-4 lg:pl-0 lg:text-lg"
        >
          {options[selectedIndex].description}
        </p>
        {#if options[selectedIndex].detail}
          <p
            class="mt-2 border-l border-border/60 pl-3 text-sm leading-relaxed whitespace-pre-line text-fg/85 lg:mt-3 lg:border-l-0 lg:border-r lg:pr-4 lg:pl-0 lg:text-base"
          >
            {options[selectedIndex].detail}
          </p>
        {/if}
        {#if options[selectedIndex].link}
          <p
            class="mt-2 flex flex-row flex-wrap items-baseline gap-2 pl-3 text-sm text-button-3 italic lg:justify-end lg:pr-4 lg:pl-0"
          >
            <button
              type="button"
              onclick={openActiveLink}
              class="cursor-pointer border-0 bg-transparent p-0 font-inherit underline hover:text-fg"
            >
              {options[selectedIndex].link!.label} →
            </button>
            <span class="text-muted not-italic">(Enter)</span>
          </p>
        {/if}
      </div>
    {/if}

    <!-- options (desktop) -->
    <div
      class="relative hidden h-full flex-col items-start justify-center -space-y-32 lg:flex 3xl:left-[55rem] left-[42rem]"
    >
      {#each options as option, i}
        <Option
          index={i}
          isSelected={selectedIndex === i}
          onSelect={() => setIndex(i)}
          {option}
        />
      {/each}
    </div>

    <!-- controls -->
    {#if isStarted}
      <div
        class="fixed bottom-0 left-0 right-0 z-30 flex flex-col items-stretch border-t border-fg/20 bg-bg-dark/90 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-2 font-new-rodin backdrop-blur-md lg:absolute lg:left-auto lg:right-0 lg:border-t-0 lg:bg-transparent lg:px-0 lg:pb-6 lg:pt-0 lg:backdrop-blur-none"
      >
        <p
          class="mb-1 line-clamp-2 text-right text-base italic text-shadow-under sm:text-lg lg:mb-0 lg:line-clamp-none lg:max-w-xl lg:pr-20 lg:text-3xl"
        >
          {options[selectedIndex].description}
        </p>

        <div class="flex w-full items-center gap-1">
          <span class="text-xs text-shadow-under sm:text-sm lg:text-base">Command</span>
          <hr class="grow border border-fg shadow-under">
        </div>

        <div
          class="mt-2 flex flex-wrap items-center justify-end gap-3 text-shadow-under sm:gap-4 lg:mt-4 lg:pr-20"
        >
          <Control key="↑↓">Navigate</Control>
          <Control key="↵">{options[selectedIndex].link ? "Open link" : "Select"}</Control>
        </div>
      </div>
    {/if}

    <!-- side text -->
    {#if isStarted}
      <div
        class="pointer-events-none absolute hidden rotate-90 tracking-[-0.2em] text-muted italic lg:block"
        style="left: -4.5rem; top: -18rem; font-size: 37vh;"
      >
        <span class="z-1">0{selectedIndex + 1}</span>
      </div>
    {/if}
  </div>
</main>
