import Hero from "@/components/Hero";
import PinnedCommits from "@/components/PinnedCommits";
import CommitLog from "@/components/CommitLog";
import Contributions from "@/components/Contributions";
import Dependencies from "@/components/Dependencies";
import Changelog from "@/components/Changelog";
import Contact from "@/components/Contact";
import Nav from "@/components/Nav";

/**
 * Home page — seven sections in order, per the design spec:
 *  1. Hero (HEAD → main)
 *  2. Pinned commits
 *  3. The log (commit graph)
 *  4. Contributions (heatmap + merged PRs)
 *  5. Dependencies (skills as package.json)
 *  6. Changelog / now
 *  7. Contact (git push origin hire-jak)
 */
export default function Home() {
  return (
    <>
      <Nav />
      <main className="mx-auto max-w-5xl">
        <Hero />
        <PinnedCommits />
        <CommitLog />
        <Contributions />
        <Dependencies />
        <Changelog />
        <Contact />
      </main>
    </>
  );
}
