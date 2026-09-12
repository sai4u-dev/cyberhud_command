import { Link } from "react-router-dom";

export default function Unauthorized() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 text-center">
      <span className="material-symbols-outlined text-error text-6xl">lock</span>
      <h2 className="font-display text-4xl font-bold uppercase mt-4">ACCESS_DENIED</h2>
      <p className="text-slate-400 mt-2 max-w-md">Your clearance level is insufficient for this sector. Contact an admin to upgrade your role.</p>
      <Link to="/" className="mt-6 px-8 py-3 bg-primary text-black font-bold uppercase tracking-widest">Return to Grid</Link>
    </div>
  );
}
