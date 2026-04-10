<script lang="ts">
  import { onMount } from "svelte";
  import { base } from "$app/paths";

  const BACKGROUND_VIDEO_CACHE = "2";
  const backgroundVideoSrc = `${base}/background.webm?v=${BACKGROUND_VIDEO_CACHE}`;

  type ProjectItem = {
    title: string;
    caption: string;
    /** File inside static/projects/ */
    file: string;
  };

  const projects: ProjectItem[] = [
    {
      title: "Client — dashboard",
      caption: "Internal environment capture (no public URL).",
      file: "dashboard-1.png"
    },
    {
      title: "Client — landing",
      caption: "Campaign page; deployed on the client’s local server only.",
      file: "landing-1.png"
    },
    {
      title: "P3R web profile",
      caption: "This pause-menu–style site.",
      file: "web-profile.png"
    }
  ];

  let broken = $state<Record<number, boolean>>({});
  let bgVideo: HTMLVideoElement | undefined = $state();

  onMount(() => {
    queueMicrotask(() => {
      const v = bgVideo;
      if (!v) return;
      void v.play().catch(() => {});
    });
  });
</script>

<svelte:head>
  <title>Projects — Web Profile</title>
</svelte:head>

<main class="relative isolate min-h-screen w-full overflow-x-auto bg-bg-dark pb-28 font-new-rodin text-fg">
  <div class="pointer-events-none absolute inset-0 z-0 bg-bg-dark" aria-hidden="true"></div>

  <div class="pointer-events-none absolute inset-0 z-[1] overflow-hidden" aria-hidden="true">
    <!-- svelte-ignore a11y_media_has_caption -->
    <video
      bind:this={bgVideo}
      class="absolute left-1/2 top-1/2 min-h-[120%] min-w-[120%] -translate-x-1/2 -translate-y-1/2 scale-105 object-cover object-left opacity-[0.42] blur-md contrast-90 saturate-75 md:blur-lg"
      loop
      muted
      playsinline
      preload="metadata"
    >
      <source src={backgroundVideoSrc} type="video/webm" />
    </video>
  </div>

  <div
    class="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-b from-bg-dark/88 via-bg-dark/82 to-bg/78"
    aria-hidden="true"
  ></div>

  <div class="relative z-10 mx-auto min-w-[min(100%,20rem)] max-w-3xl px-6 py-10 md:px-8 md:py-12">
    <header class="mb-12 -rotate-1 space-y-4 md:mb-14">
      <div class="inline-block rounded-md bg-fg px-5 py-3 shadow-under">
        <p class="font-skip text-xs tracking-[0.15em] text-bg/80">PORTFOLIO</p>
        <h1 class="font-skip text-3xl tracking-[-0.08em] text-bg md:text-4xl">PROJECTS</h1>
      </div>
      <p class="max-w-md text-pretty text-lg italic leading-snug text-shadow-under md:text-xl">
        Screenshots only — many sites ran on client servers or localhost only.
      </p>
      <h2 class="flex flex-wrap items-center gap-2 text-base italic text-shadow-under">
        <a href={`${base}/`} class="shrink-0 text-button-3 hover:text-fg">← Home</a>
        <hr class="h-px min-w-[4rem] grow border-0 bg-fg/60 shadow-under" />
        <span class="text-muted">Web profile</span>
      </h2>
    </header>

    <div class="mx-auto grid max-w-2xl grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10">
      {#each projects as p, i}
        <figure
          class="mx-auto w-full max-w-[15.5rem] overflow-hidden rounded-md border-2 border-border bg-bg-dark/90 shadow-under ring-1 ring-fg/10 sm:mx-0 sm:max-w-[14.5rem]"
        >
          <div class="relative h-32 w-full overflow-hidden bg-black/25 sm:h-36 md:h-[9.5rem]">
            {#if !broken[i]}
              <img
                src={`${base}/projects/${p.file}`}
                alt=""
                class="relative z-10 h-full w-full object-cover object-top"
                onerror={() => {
                  broken = { ...broken, [i]: true };
                }}
              />
            {:else}
              <div
                class="absolute inset-0 z-0 flex flex-col items-center justify-center gap-1.5 bg-bg-dark p-3 text-center text-[11px] leading-tight text-muted"
              >
                <span>No image yet</span>
                <code class="break-all text-[10px] text-button-3">projects/{p.file}</code>
              </div>
            {/if}
          </div>
          <figcaption class="border-t border-border bg-bg/20 px-3 py-3">
            <div class="border-l-4 border-pink pl-3">
              <h2 class="font-rodin text-base tracking-tight text-shadow-under md:text-lg">{p.title}</h2>
              <p class="mt-1 text-pretty text-xs leading-relaxed text-fg/80 italic md:text-sm">
                {p.caption}
              </p>
            </div>
          </figcaption>
        </figure>
      {/each}
    </div>

    <footer class="mx-auto mt-14 max-w-2xl font-new-rodin">
      <div class="mb-3 flex items-center gap-2">
        <span class="text-sm italic text-shadow-under">Command</span>
        <hr class="h-px grow border-0 bg-fg/50 shadow-under" />
      </div>
      <div class="flex items-center gap-2">
        <span
          class="flex size-8 shrink-0 items-center justify-center rounded-full border-3 border-fg bg-bg-dark/80 font-sans text-lg font-bold shadow-under outline-3 outline-border"
        >←</span>
        <a
          href={`${base}/`}
          class="text-shadow-border text-xl font-sans italic tracking-tight text-fg no-underline hover:underline"
        >Back</a>
      </div>
    </footer>
  </div>
</main>
