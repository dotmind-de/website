/**
 * Templates remount on every navigation, so the CSS `page-enter` animation
 * replays as a short, non-blocking page transition (removed under reduced motion).
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
