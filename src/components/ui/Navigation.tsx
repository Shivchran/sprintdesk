import { NavLink } from "react-router-dom";

const links = [
  {
    to: "/dashboard",
    label: "Dashboard",
  },
  {
    to: "/analytics",
    label: "Analytics",
  },
];

function Navigation() {
  return (
    <nav
      aria-label="Main navigation"
      className="flex items-center gap-2"
    >
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          className={({ isActive }) =>
            [
              "rounded-lg px-3 py-2 text-sm font-medium transition",
              isActive
                ? "bg-blue-600 text-white"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
            ].join(" ")
          }
        >
          {link.label}
        </NavLink>
      ))}
    </nav>
  );
}

export default Navigation;