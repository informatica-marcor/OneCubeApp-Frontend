import { NAV_ITEMS } from "../config/navigation";
import NavItem from "../ui/NavItem";
import { useAuth } from "../context/AuthContext";
import { useGetUser} from "../hooks/users/useGetUser";
import logo from "../../assets/onecube-logo-sn.svg";


export default function Sidebar(role) {
  
  const { userId } = useAuth();
  const { user } = useGetUser(userId);

  const visibleItems = NAV_ITEMS.filter((item) =>
    item.roles.includes(user?.role)
  );

  return (
    <aside className="hidden md:flex md:w-[255px] md:flex-col md:border-r md:border-slate-200 md:bg-white">
      <div className="flex items-center justify-center px-6 py-8">
        <img
          src={logo}
          alt="One Cube"
          className="h-40 w-auto object-contain"
        />
      </div>

      <div className="px-4 pb-3">
        <p className="px-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
          Menú principal
        </p>
      </div>

      <nav className="flex flex-1 flex-col gap-2 px-3">
        {visibleItems.map((item) => (
          <NavItem
            key={item.key}
            to={item.to}
            icon={item.icon}
            label={item.label}
          />
        ))}
      </nav>
    </aside>
  );
}