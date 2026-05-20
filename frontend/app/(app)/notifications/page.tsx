import { Bell, Mail, MessageSquareText, Trophy } from 'lucide-react';

const notificationSettings = [
  {
    label: 'Send after completing an interview',
    description: 'Email a summary when your scorecard, feedback, and next steps are ready.',
    defaultChecked: true,
  },
  {
    label: 'Practice reminders',
    description: 'Get a gentle reminder when you have not completed a mock interview in a while.',
    defaultChecked: true,
  },
  {
    label: 'Interview plan updates',
    description: 'Notify me when MockQ refreshes questions or prep suggestions for my target role.',
    defaultChecked: false,
  },
  {
    label: 'Startup and recruiter matches',
    description: 'Send updates when my profile matches a startup, recruiter, or event opportunity.',
    defaultChecked: false,
  },
  {
    label: 'Product updates',
    description: 'Occasional updates about new MockQ interview formats and coaching features.',
    defaultChecked: false,
  },
];

export default function NotificationsPage() {
  return (
    <main className="min-h-screen bg-transparent text-white">
      <div className="mx-auto w-full max-w-[1000px] px-6 py-8 pt-20 md:pt-8 lg:px-10">
        <section className="min-w-0">
          <div className="space-y-6">
            <section className="rounded-md border border-white/12 bg-black/20 backdrop-blur-sm">
              <div className="border-b border-white/10 p-5">
                <div className="flex items-center gap-3">
                  <Bell className="h-5 w-5 text-white/80" />
                  <div>
                    <h3 className="font-semibold">Email notifications</h3>
                    <p className="text-sm text-white/55">
                      Keep the helpful stuff on, turn the noisy stuff off.
                    </p>
                  </div>
                </div>
              </div>

              <div className="divide-y divide-white/10">
                {notificationSettings.map((setting) => (
                  <ToggleRow key={setting.label} {...setting} />
                ))}
              </div>
            </section>

            <section className="grid gap-4 md:grid-cols-3">
              <InfoCard icon={Mail} title="Email" text="Interview summaries and reminders." />
              <InfoCard
                icon={MessageSquareText}
                title="In-app"
                text="Coaching prompts and setup nudges."
              />
              <InfoCard icon={Trophy} title="Events" text="Networking and opportunity matches." />
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}

function ToggleRow({
  label,
  description,
  defaultChecked,
}: {
  label: string;
  description: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex cursor-pointer items-start justify-between gap-5 p-5 transition-colors hover:bg-white/[0.04]">
      <span>
        <span className="block text-sm font-semibold text-white">{label}</span>
        <span className="mt-1 block text-sm leading-5 text-white/55">{description}</span>
      </span>
      <input
        type="checkbox"
        defaultChecked={defaultChecked}
        className="mt-1 h-4 w-4 shrink-0 accent-[#0969da]"
      />
    </label>
  );
}

function InfoCard({
  icon: Icon,
  title,
  text,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-md border border-white/12 bg-black/20 p-4 backdrop-blur-sm">
      <Icon className="mb-3 h-5 w-5 text-white/80" />
      <p className="text-sm font-semibold">{title}</p>
      <p className="mt-1 text-sm text-white/55">{text}</p>
    </div>
  );
}
