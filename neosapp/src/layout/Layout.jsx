import Header from "./Header";
import Sidebar from "./Sidebar";
import "../styles/layout.css";

export default function Layout({ children }) {
  return (
    <div className="layout">
      <Sidebar />
      <div className="layout-main">
        <Header />
        <main className="layout-content">
          {children}
        </main>
      </div>
    </div>
  );
}
