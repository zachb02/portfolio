import { GraduationCap, MapPin, Clock } from "@phosphor-icons/react/dist/ssr";
import { profile } from "@/lib/resume-data";

const items = [
  {
    icon: GraduationCap,
    label: "Education",
    value: `${profile.education.degree}, ${profile.education.school}`,
    detail: profile.education.timeframe,
  },
  {
    icon: MapPin,
    label: "Location",
    value: profile.location,
    detail: "Open to remote and on-site",
  },
  {
    icon: Clock,
    label: "Availability",
    value: profile.availability,
    detail: "Contract, part-time, or internship",
  },
];

export function NowStrip() {
  return (
    <section className="border-y border-border px-6 py-16">
      <div className="mx-auto grid max-w-6xl gap-10 sm:grid-cols-3">
        {items.map(({ icon: Icon, label, value, detail }) => (
          <div key={label} className="flex items-start gap-4">
            <Icon size={22} weight="light" className="mt-1 shrink-0 text-accent" />
            <div>
              <p className="font-mono-label text-xs text-foreground-muted">
                {label}
              </p>
              <p className="mt-1.5 text-base text-foreground">{value}</p>
              <p className="mt-0.5 text-sm text-foreground-muted">{detail}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
