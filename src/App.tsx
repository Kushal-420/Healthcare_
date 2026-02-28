import Home from "./pages/Home";
import { TopNav } from "./components/TopNav";

export default function App() {
  return (
    <div className="min-h-dvh bg-gradient-to-b from-sky-50 via-white to-emerald-50">
      <TopNav />
      <Home />
    </div>
  );
}
