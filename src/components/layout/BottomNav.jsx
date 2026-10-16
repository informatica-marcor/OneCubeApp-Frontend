import { NAV_ITEMS } from "../config/navigation";
import NavItem from "../ui/NavItem";
import { useAuth } from "../context/AuthContext";
import { useGetUser} from "../hooks/users/useGetUser";

export default function BottomNav(role) {

  const { userId } = useAuth();
  const { user } = useGetUser(userId);

  const visibleItems = NAV_ITEMS.filter((item) =>
    item.roles.includes(user?.role)
  );

  const gridCols = visibleItems.length;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white md:hidden">
      {/* Usamos un objeto de mapeo para que Tailwind detecte las clases correctamente */}
      <div 
        className={`grid px-1 py-1 ${
          gridCols === 3 ? "grid-cols-3" : "grid-cols-4"
        }`}
      >
        {visibleItems.map((item) => (
          <NavItem
            key={item.key}
            to={item.to}
            icon={item.icon}
            label={item.label}
            mobile={true}
          />
        ))}
      </div>
    </nav>
  );
}