import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Users, Trophy, School, MapPin, Users2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string;
    title: string;
    icon: keyof typeof icons;
  }[];
}

const icons = {
  users: Users,
  trophy: Trophy,
  school: School,
  track: MapPin,
  pairs: Users2,
};

export function SidebarNav({ className, items, ...props }: SidebarNavProps) {
  const searchParams = useSearchParams();
  const currentView = searchParams.get("view") || "usuarios";

  return (
    <nav
      className={cn(
        "flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1",
        className
      )}
      {...props}
    >
      {items.map((item) => {
        const Icon = icons[item.icon];
        const isActive = item.href.includes(`view=${currentView}`);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-[#F4F4F5] hover:text-[#6366F1]",
              isActive && "bg-[#F4F4F5] text-[#6366F1]"
            )}
          >
            {Icon && <Icon className="h-4 w-4" />}
            {item.title}
          </Link>
        );
      })}
    </nav>
  );
}
