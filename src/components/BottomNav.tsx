import { Link, useLocation } from "react-router-dom";
import { Shirt, ShoppingBag, Bell, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useUnreadCountQuery } from "../hooks/notifications/useUnreadCountQuery";
import "../styles/bottom-nav.css";

function isActiveRoute(pathname: string, route: string): boolean {
  return pathname === route || pathname.startsWith(route + "/");
}

export function BottomNav() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const unreadCountQuery = useUnreadCountQuery(isAuthenticated);
  const unreadCount = unreadCountQuery.data?.unread_count ?? 0;

  if (!isAuthenticated) return null;

  return (
    <nav className="bottom-nav">
      <Link to="/pickup" className={`bottom-nav-item ${isActiveRoute(location.pathname, "/pickup") ? "active" : ""}`} title="Pesan Laundry">
        <Shirt className="w-6 h-6" />
        <span className="bottom-nav-label">Pesan</span>
      </Link>

      <Link to="/orders" className={`bottom-nav-item ${isActiveRoute(location.pathname, "/orders") ? "active" : ""}`} title="Pesanan">
        <ShoppingBag className="w-6 h-6" />
        <span className="bottom-nav-label">Pesanan</span>
      </Link>

      <Link to="/notifications" className={`bottom-nav-item ${isActiveRoute(location.pathname, "/notifications") ? "active" : ""}`} title="Notifikasi">
        <div className="relative">
          <Bell className="w-6 h-6" />
          {unreadCount > 0 && (
            <span className="bottom-nav-badge">{unreadCount > 9 ? "9+" : unreadCount}</span>
          )}
        </div>
        <span className="bottom-nav-label">Notifikasi</span>
      </Link>

      <Link to="/profile" className={`bottom-nav-item ${isActiveRoute(location.pathname, "/profile") ? "active" : ""}`} title="Profil">
        <User className="w-6 h-6" />
        <span className="bottom-nav-label">Profil</span>
      </Link>
    </nav>
  );
}
