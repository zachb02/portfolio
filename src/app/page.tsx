import { Nav } from "@/components/nav";
import { Hero } from "@/components/hero";
import { FlagshipWork } from "@/components/flagship-work";
import { StoryTimeline } from "@/components/story-timeline";
import { NowStrip } from "@/components/now-strip";
import { SkillsGrid } from "@/components/skills-grid";
import { SiteFooter } from "@/components/site-footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <FlagshipWork />
        <StoryTimeline />
        <NowStrip />
        <SkillsGrid />
      </main>
      <SiteFooter />
    </>
  );
}
