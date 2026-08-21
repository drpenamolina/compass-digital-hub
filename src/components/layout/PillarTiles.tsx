import Link from "next/link";
import {
  IconCompass,
  IconHeartHandshake,
  IconUsersGroup,
  IconMoodSmile,
} from "@tabler/icons-react";
import { Card } from "@/components/ui/Card";

const pillars = [
  {
    href: "/navigate",
    label: "Navigate",
    description: "Monthly resources and session materials",
    Icon: IconCompass,
  },
  {
    href: "/cope",
    label: "Cope",
    description: "ACT sessions and wellness self-checks",
    Icon: IconMoodSmile,
  },
  {
    href: "/belong",
    label: "Belong",
    description: "Travel From Home events",
    Icon: IconUsersGroup,
  },
  {
    href: "/restore",
    label: "Restore",
    description: "Your buddy group and rapid-response protocol",
    Icon: IconHeartHandshake,
  },
];

export function PillarTiles() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {pillars.map(({ href, label, description, Icon }) => (
        <Link key={href} href={href}>
          <Card className="flex h-full flex-col gap-2 p-4 transition-colors hover:border-accent/40">
            <Icon size={20} className="text-muted" stroke={1.5} />
            <span className="text-sm font-medium text-foreground">{label}</span>
            <span className="text-xs text-muted">{description}</span>
          </Card>
        </Link>
      ))}
    </div>
  );
}
