// pages/home.js
import React, { useState } from "react";
import Head from "next/head";
import Layout, { siteTitle } from "../components/layout";
import useGetFighters from "../hooks/fighters/useGetFighters";
import useInfiniteScroll from "../hooks/useInfiniteScroll";
import useHomeFeed from "../hooks/home/useHomeFeed";
import FeedCard from "../components/home/feed-card";
import topics from "../helpers/topics";

// ── Mock fetchers (replace with real API) ─────────────────────────────────────
const ISSUES = topics.map(t => t.name);
const DEFAULT_FILTERS = { issues: [], types: ["ARTICLE", "BILL", "VIDEO", "THREAD"], sort: "TOP_MATCH", myStateOnly: false, level: "ALL" };

function mockDelay(ms) { return new Promise((r) => setTimeout(r, ms)); }

async function mockFetchFeed(page, filters) {
  await mockDelay(300);
  const baseDate = new Date();
  const mkItem = (idx) => ({
    id: `mock-${page}-${idx}`,
    type: idx % 3 === 0 ? "BILL" : idx % 3 === 1 ? "ARTICLE" : "VIDEO",
    title: idx % 3 === 0 ? "AB-1234: Tenant Protections Expansion" : idx % 3 === 1 ? "Op-Ed: Breaking Up Monopolies Works" : "Town Hall Clip: Climate Jobs Now",
    summary: "A quick summary of the content with the key progressive highlights and why it matters.",
    url: "https://example.com/content",
    publishedAt: new Date(baseDate.getTime() - (idx + page) * 86400000).toISOString(),
    tags: ["Labor", "Climate", "Antitrust"].slice(0, (idx % 3) + 1),
    fighter: {
      _id: `f-${(idx % 5) + 1}`,
      name: ["Zohran Mamdani", "Sara Innamorato", "Summer Lee", "Cori Bush", "Greg Casar"][idx % 5],
      office: ["NY Assembly, D36", "Allegheny County Exec.", "U.S. House, PA-12", "U.S. House, MO-01", "U.S. House, TX-35"][idx % 5],
      photoUrl: "/images/sample-fighter.jpg",
      alignmentScore: 70 + (5 - (idx % 5)) * 5,
      tags: ["Fighter", "Labor", "DSA"].slice(0, 2 + (idx % 2)),
      following: idx % 4 === 0,
    },
    source: idx % 3 === 0 ? "State Legislature" : idx % 3 === 1 ? "The Nation" : "YouTube",
  });

  let items = Array.from({ length: 8 }, (_, i) => mkItem(i));
  if (filters.issues.length) items = items.filter((it) => it.tags.some((t) => filters.issues.includes(t)));
  if (filters.types.length) items = items.filter((it) => filters.types.includes(it.type));
  if (filters.sort === "TOP_MATCH") items.sort((a, b) => (b.fighter.alignmentScore || 0) - (a.fighter.alignmentScore || 0));
  if (filters.sort === "NEWEST") items.sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt));

  return { items, hasMore: page < 5 };
}

// ── Filters ───────────────────────────────────────────────────────────────────
function Filters({ value, onChange }) {
  const toggleIssue = (issue) => {
    const has = value.issues.includes(issue);
    onChange({ ...value, issues: has ? value.issues.filter((i) => i !== issue) : [...value.issues, issue] });
  };
  const toggleType = (t) => {
    const has = value.types.includes(t);
    onChange({ ...value, types: has ? value.types.filter((i) => i !== t) : [...value.types, t] });
  };

  return (
    <aside className="space-y-6">
      <section>
        <h4 className="text-sm font-semibold mb-2 text-slate-700 dark:text-slate-200">Sort</h4>
        <div className="flex gap-2">
          {["TOP_MATCH", "NEWEST"].map((k) => (
            <button
              key={k}
              onClick={() => onChange({ ...value, sort: k })}
              className={`text-xs px-3 py-1 rounded-full border ${value.sort === k ? "bg-slate-900 text-white border-slate-900" : "border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300"}`}
            >
              {k === "TOP_MATCH" ? "Top match" : "Newest"}
            </button>
          ))}
        </div>
      </section>

      <section>
        <h4 className="text-sm font-semibold mb-2 text-slate-700 dark:text-slate-200">Issues</h4>
        <div className="flex flex-wrap gap-2">
          {ISSUES.map((issue) => (
            <button
              key={issue}
              onClick={() => toggleIssue(issue)}
              className={`text-xs px-3 py-1 rounded-full border ${value.issues.includes(issue) ? "bg-slate-900 text-white border-slate-900" : "border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300"}`}
            >
              #{issue}
            </button>
          ))}
        </div>
      </section>

      <section className="py-2 border-t border-slate-200 dark:border-slate-800">
        <div className="mt-4 flex gap-2">
          {["ALL", "FEDERAL", "STATE"].map((lv) => (
            <button
              key={lv}
              onClick={() => onChange({ ...value, level: lv })}
              className={`text-xs px-3 py-1 rounded-full border ${value.level === lv ? "bg-slate-900 text-white border-slate-900" : "border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300"}`}
            >
              {lv}
            </button>
          ))}
        </div>
      </section>
    </aside>
  );
}

// ── Right rail ────────────────────────────────────────────────────────────────
function TopFightersPanel() {
  const { fighters = [], loading } = useGetFighters("", 1, 5); // first 5
  return (
    <aside className="space-y-3">
      <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Top Fighters for You</h4>
      {loading && <div className="text-xs text-slate-500">Loading…</div>}
      {!loading &&
        fighters.map((f) => (
          <div key={f._id} className="flex items-center gap-3 p-2 rounded-xl border border-slate-200 dark:border-slate-800">
            <img
              src={f.photoUrl}
              alt={f.name}
              width={36}
              height={36}
              className="rounded-full object-cover"
              style={{ width: 36, height: 36 }}
            />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">{f.name}</div>
              <div className="text-[11px] text-slate-500 truncate">{f.office}</div>
            </div>
            {typeof f.alignmentScore === "number" && (
              <span className="text-[11px] font-semibold px-2 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-200">
                Alignment: {f.alignmentScore}
              </span>
            )}
          </div>
        ))}
    </aside>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function HomeFeedPage() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  // feed data via hook
  const { items, hasMore, loading, error, loadMore } = useHomeFeed(filters, mockFetchFeed);

  // infinite scroll sentinel
  const sentinelRef = useInfiniteScroll({ hasMore, loading, onLoadMore: loadMore });

  return (
    <Layout>
      <Head>
        <title>{siteTitle ? `${siteTitle} — For You` : "PolitiProfile — For You"}</title>
        <meta name="description" content="Your personalized progressive feed: articles, bills, and updates from fighters who align with your values." />
      </Head>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 px-4 lg:px-0">
        <div className="hidden lg:block lg:col-span-3 pt-4">
          <Filters value={filters} onChange={setFilters} />
        </div>

        <main className="lg:col-span-6 space-y-4 pt-4">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">For You</h1>
        <p className="text-sm text-slate-500">Personalized by your alignment across labor, climate, housing, and democracy.</p>

          {items.map((it) => <FeedCard key={it.id} item={it} />)}
          {loading && <div className="text-center text-sm text-slate-500 py-4">Loading…</div>}
          {error && <div className="text-center text-sm text-red-600">{error}</div>}
          {!hasMore && !loading && <div className="text-center text-xs text-slate-400 py-6">You’re all caught up.</div>}

          {/* sentinel */}
          <div ref={sentinelRef} />
        </main>

        <div className="hidden xl:block xl:col-span-3 pt-4">
          <TopFightersPanel />
        </div>
      </div>
    </Layout>
  );
}
