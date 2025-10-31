// components/feed/FeedCard.jsx
import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import LoginModal from "../login-register/login-modal";
import useFollowFighter from "../../hooks/fighters/useFollowFighter";

function Tag({ label }) {
  return (
    <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 px-2 py-1 rounded-full">
      #{label}
    </span>
  );
}

function FighterAvatar({ fighter, size = 40 }) {
  return (
    <img
      src={fighter.photoUrl}
      alt={fighter.name}
      width={size}
      height={size}
      className="rounded-full object-cover"
      style={{ width: size, height: size }}
    />
  );
}

function ScorePill({ score }) {
  if (typeof score !== "number") return null;
  return (
    <span className="text-[11px] font-semibold px-2 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-200">
      Align {score}
    </span>
  );
}

// ── Login-gated follow button (no guest follow) ───────────────────────────────
function FollowButton({ fighter }) {
  const { user } = useAuth();
  const [showLoginModal, setShowLoginModal] = React.useState(false);
  const { isFollowing, loading, followFighter, unfollowFighter } = useFollowFighter(
    !!fighter.following
  );

  const onClick = async () => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    if (isFollowing) await unfollowFighter(fighter._id);
    else await followFighter(fighter._id);
  };

  return (
    <>
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
      <button
        onClick={onClick}
        disabled={loading}
        className={`text-xs px-3 py-1 rounded-full transition text-white ${
          isFollowing ? "bg-green-600 hover:bg-green-700" : "bg-primary hover:bg-primary/90"
        }`}
        aria-label={isFollowing ? "Unfollow fighter" : "Follow fighter"}
      >
        {loading ? "…" : isFollowing ? "✓ Following" : "Follow"}
      </button>
    </>
  );
}

// ── Main card ─────────────────────────────────────────────────────────────────
/**
 * @param {{ item: {
 *   id: string, type: "ARTICLE"|"BILL"|"VIDEO"|"THREAD",
 *   title: string, summary: string, url: string, publishedAt: string,
 *   tags: string[], source: string, fighter: any
 * },
 *  onShare?: (item) => void,
 *  onSave?: (item) => void
 * }} props
 */
export default function FeedCard({ item, onShare, onSave }) {
  return (
    <article className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-4 sm:p-5">
      {/* Header */}
      <div className="flex items-start gap-3">
        <FighterAvatar fighter={item.fighter} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 truncate">
              {item.fighter.name}
            </h3>
            <span className="text-xs text-slate-500">{item.fighter.office}</span>
            <ScorePill score={item.fighter.alignmentScore} />
            <span className="ml-auto text-[11px] inline-flex items-center px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              {item.type}
            </span>
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            {item.source} · {new Date(item.publishedAt).toLocaleDateString()}
          </div>
        </div>
        <FollowButton fighter={item.fighter} />
      </div>

      {/* Body */}
      <div className="mt-3">
        <a href={item.url} target="_blank" rel="noreferrer" className="group">
          <h4 className="text-slate-900 dark:text-slate-100 font-semibold group-hover:underline">
            {item.title}
          </h4>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{item.summary}</p>
        </a>
        <div className="mt-3 flex flex-wrap gap-2">
          {item.tags.map((t) => (
            <Tag key={t} label={t} />
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="mt-4 flex items-center gap-4 text-slate-500">
        <button
          className="text-xs hover:text-slate-700 dark:hover:text-slate-200"
          onClick={() => onShare?.(item)}
        >
          Share
        </button>
        <button
          className="text-xs hover:text-slate-700 dark:hover:text-slate-200"
          onClick={() => onSave?.(item)}
        >
          Save
        </button>
        <a
          className="text-xs hover:text-slate-700 dark:hover:text-slate-200"
          href={item.url}
          target="_blank"
          rel="noreferrer"
        >
          Open
        </a>
      </div>
    </article>
  );
}
