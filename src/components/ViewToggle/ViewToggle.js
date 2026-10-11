import styles from "./ViewToggle.module.css";

/* ── Icon components ── */
function GridIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="1" y="1" width="6" height="6" rx="1.5" fill="currentColor" />
      <rect x="9" y="1" width="6" height="6" rx="1.5" fill="currentColor" />
      <rect x="1" y="9" width="6" height="6" rx="1.5" fill="currentColor" />
      <rect x="9" y="9" width="6" height="6" rx="1.5" fill="currentColor" />
    </svg>
  );
}

function ListIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="1" y="2" width="14" height="3" rx="1.5" fill="currentColor" />
      <rect x="1" y="6.5" width="14" height="3" rx="1.5" fill="currentColor" />
      <rect x="1" y="11" width="14" height="3" rx="1.5" fill="currentColor" />
    </svg>
  );
}

/**
 * ViewToggle
 * @param {{ view: "grid" | "list", onChange: (v: "grid" | "list") => void }} props
 */
export default function ViewToggle({ view, onChange }) {
  return (
    <div className={styles.toggle} role="group" aria-label="Switch view layout">
      <button
        id="view-toggle-grid"
        className={`${styles.btn}${view === "grid" ? ` ${styles.active}` : ""}`}
        onClick={() => onChange("grid")}
        aria-pressed={view === "grid"}
        aria-label="Grid view"
        title="Grid view"
      >
        <GridIcon />
      </button>
      <button
        id="view-toggle-list"
        className={`${styles.btn}${view === "list" ? ` ${styles.active}` : ""}`}
        onClick={() => onChange("list")}
        aria-pressed={view === "list"}
        aria-label="List view"
        title="List view"
      >
        <ListIcon />
      </button>
    </div>
  );
}
