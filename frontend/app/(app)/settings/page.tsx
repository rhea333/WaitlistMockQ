'use client';

import { type ComponentType, type ReactNode, useMemo, useState } from 'react';
import Image from 'next/image';
import { CheckCircle2, Github, Link2, Linkedin, Pencil, Target, Upload } from 'lucide-react';

const skills = ['React', 'System Design', 'Python', 'Product Sense', 'Data Analysis', 'Leadership'];
const skillOptions = [
  'JavaScript',
  'TypeScript',
  'Next.js',
  'Node.js',
  'SQL',
  'Machine Learning',
  'Figma',
  'Product Strategy',
  'User Research',
  'Financial Modeling',
  'Public Speaking',
  'Case Interviews',
];
export default function SettingsPage() {
  return (
    <main className="settings-future min-h-screen bg-[#f6f8fa] text-[#1f2328]">
      <div className="mx-auto flex w-full max-w-[1280px] gap-10 px-6 py-8 pt-20 md:pt-8 lg:px-10">
        <section className="min-w-0 flex-1">
          <div className="grid gap-10 xl:grid-cols-[minmax(0,680px)_300px]">
            <form className="space-y-8">
              <Section
                title="Identity"
                description="Basic context MockQ uses to personalize your interview room."
              >
                <Field label="Name" defaultValue="Rhea" />
                <Field
                  label="Headline / target role"
                  defaultValue="Aspiring Product Manager Intern"
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Location" placeholder="Optional" />
                  <SelectField
                    label="Pronouns"
                    options={["Don't specify", 'she/her', 'he/him', 'they/them']}
                  />
                </div>
              </Section>

              <Section
                title="Professional profile"
                description="Keep it short. This is for better interview prompts, not a resume rewrite."
              >
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#1f2328]" htmlFor="bio">
                    Short bio
                  </label>
                  <textarea
                    id="bio"
                    className="min-h-24 w-full rounded-md border border-[#d0d7de] bg-[#f6f8fa] px-3 py-2 text-sm shadow-inner outline-none placeholder:text-[#6e7781] focus:border-[#0969da] focus:ring-2 focus:ring-[#0969da]/20"
                    placeholder="Tell us about your background, goals, or interview focus"
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <SelectField
                    label="Experience level"
                    options={['Student', 'New Grad', 'Early Career', 'Mid-Level', 'Senior']}
                  />
                  <Field
                    label="Target roles"
                    defaultValue="Product Management, Software Engineering"
                  />
                </div>
                <TagGroup label="Skills" items={skills} extraOptions={skillOptions} />
              </Section>

              <Section
                title="Career links"
                description="Optional links for recruiter matching and event discovery."
              >
                <button
                  type="button"
                  className="flex w-full items-center justify-center gap-2 rounded-md border-2 border-dashed border-[#d0d7de] bg-white px-4 py-6 text-sm font-medium text-[#57606a] hover:border-[#0969da] hover:text-[#0969da]"
                >
                  <Upload className="h-4 w-4" />
                  Upload resume (optional)
                </button>
                <SocialField
                  icon={Linkedin}
                  label="LinkedIn"
                  placeholder="https://linkedin.com/in/..."
                />
                <SocialField icon={Github} label="GitHub" placeholder="https://github.com/..." />
                <SocialField icon={Link2} label="Portfolio website" placeholder="https://..." />
              </Section>

              <Section title="Opportunities" description="Control how MockQ can match you later.">
                <ToggleRow label="Open to startup opportunities" />
                <ToggleRow label="Open to recruiter outreach" />
                <ToggleRow label="Open to networking events" />
              </Section>

              <div className="border-t border-[#d8dee4] pt-5">
                <button
                  type="button"
                  className="rounded-md bg-[#1f883d] px-4 py-1.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#1a7f37]"
                >
                  Save profile
                </button>
              </div>
            </form>

            <aside className="space-y-6 xl:pt-5">
              <div>
                <p className="mb-4 text-sm font-semibold text-[#1f2328]">Profile picture</p>
                <div className="relative w-fit">
                  <Image
                    src="/user-femi.png"
                    alt="Profile picture"
                    width={256}
                    height={256}
                    className="h-48 w-48 rounded-full border border-[#d0d7de] object-cover sm:h-56 sm:w-56"
                  />
                  <button className="absolute bottom-4 left-3 inline-flex items-center gap-2 rounded-md border border-[#d0d7de] bg-white px-3 py-1.5 text-sm font-medium text-[#24292f] shadow-sm hover:bg-[#f6f8fa]">
                    <Pencil className="h-4 w-4" />
                    Edit
                  </button>
                </div>
              </div>

              <div className="rounded-md border border-[#d0d7de] bg-white p-4">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-sm font-semibold">Profile Strength</p>
                  <span className="text-sm font-semibold text-[#0969da]">55%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-[#eaeef2]">
                  <div className="h-full w-[55%] rounded-full bg-[#2da44e]" />
                </div>
                <div className="mt-4 space-y-2 text-sm text-[#57606a]">
                  <StrengthItem label="Add resume" points="+15%" />
                  <StrengthItem label="Add skills" points="+10%" complete />
                  <StrengthItem label="Add LinkedIn" points="+10%" />
                  <StrengthItem label="Complete first interview" points="+20%" />
                </div>
              </div>

              <div className="rounded-md border border-[#d0d7de] bg-white p-4">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
                  <Target className="h-4 w-4 text-[#0969da]" />
                  Next best action
                </div>
                <p className="text-sm leading-5 text-[#57606a]">
                  Run one personalized mock interview to unlock better feedback and matching
                  recommendations.
                </p>
              </div>
            </aside>
          </div>
        </section>
      </div>
    </main>
  );
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-4 border-b border-[#d8dee4] pb-7 last:border-b-0">
      <div>
        <h3 className="text-lg font-semibold text-[#1f2328]">{title}</h3>
        <p className="mt-1 text-sm leading-5 text-[#57606a]">{description}</p>
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function Field({
  label,
  defaultValue,
  placeholder,
}: {
  label: string;
  defaultValue?: string;
  placeholder?: string;
}) {
  const id = label.toLowerCase().replaceAll(' ', '-').replaceAll('/', '');
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-[#1f2328]" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="h-9 w-full rounded-md border border-[#d0d7de] bg-[#f6f8fa] px-3 text-sm shadow-inner outline-none placeholder:text-[#6e7781] focus:border-[#0969da] focus:ring-2 focus:ring-[#0969da]/20"
      />
    </div>
  );
}

function SelectField({ label, options }: { label: string; options: string[] }) {
  const id = label.toLowerCase().replaceAll(' ', '-');
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-[#1f2328]" htmlFor={id}>
        {label}
      </label>
      <select
        id={id}
        className="h-9 w-full rounded-md border border-[#d0d7de] bg-[#f6f8fa] px-3 text-sm shadow-inner outline-none focus:border-[#0969da] focus:ring-2 focus:ring-[#0969da]/20"
      >
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </div>
  );
}

function TagGroup({
  label,
  items,
  extraOptions = [],
}: {
  label: string;
  items: string[];
  extraOptions?: string[];
}) {
  const [visibleItems, setVisibleItems] = useState(items);
  const [selectedItems, setSelectedItems] = useState(() => items.slice(0, 3));

  const availableOptions = useMemo(
    () => extraOptions.filter((option) => !visibleItems.includes(option)),
    [extraOptions, visibleItems]
  );

  const toggleItem = (item: string) => {
    setSelectedItems((current) =>
      current.includes(item) ? current.filter((selected) => selected !== item) : [...current, item]
    );
  };

  const addItem = (item: string) => {
    if (!item) return;
    setVisibleItems((current) => [...current, item]);
    setSelectedItems((current) => [...current, item]);
  };

  return (
    <div>
      <p className="mb-2 text-sm font-semibold text-[#1f2328]">{label}</p>
      <div className="flex flex-wrap gap-2">
        {visibleItems.map((item) => {
          const selected = selectedItems.includes(item);
          return (
            <button
              key={item}
              type="button"
              aria-pressed={selected}
              onClick={() => toggleItem(item)}
              className={`rounded-full border px-3 py-1 text-sm font-medium transition-colors ${
                selected
                  ? 'border-[#0969da] bg-[#ddf4ff] text-[#0969da]'
                  : 'border-[#d0d7de] bg-white text-[#57606a] hover:bg-[#f6f8fa]'
              }`}
            >
              {item}
            </button>
          );
        })}
        {availableOptions.length > 0 ? (
          <select
            aria-label={`Add ${label.toLowerCase()}`}
            defaultValue=""
            onChange={(event) => {
              addItem(event.target.value);
              event.target.value = '';
            }}
            className="h-8 rounded-full border border-[#d0d7de] bg-white px-3 text-sm font-medium text-[#57606a] outline-none hover:bg-[#f6f8fa] focus:border-[#0969da] focus:ring-2 focus:ring-[#0969da]/20"
          >
            <option value="">+ Add skill</option>
            {availableOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        ) : null}
      </div>
    </div>
  );
}

function SocialField({
  icon: Icon,
  label,
  placeholder,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  placeholder: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-[#1f2328]">{label}</label>
      <div className="flex items-center gap-3">
        <Icon className="h-4 w-4 shrink-0 text-[#57606a]" />
        <input
          placeholder={placeholder}
          className="h-9 w-full rounded-md border border-[#d0d7de] bg-[#f6f8fa] px-3 text-sm shadow-inner outline-none placeholder:text-[#57606a] focus:border-[#0969da] focus:ring-2 focus:ring-[#0969da]/20"
        />
      </div>
    </div>
  );
}

function ToggleRow({ label }: { label: string }) {
  return (
    <label className="flex items-center justify-between rounded-md border border-[#d0d7de] bg-white px-3 py-3 text-sm font-medium">
      {label}
      <input type="checkbox" className="h-4 w-4 accent-[#0969da]" />
    </label>
  );
}

function StrengthItem({
  label,
  points,
  complete,
}: {
  label: string;
  points: string;
  complete?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="flex items-center gap-2">
        {complete ? (
          <CheckCircle2 className="h-4 w-4 text-[#1f883d]" />
        ) : (
          <span className="h-4 w-4 rounded-full border border-[#d0d7de]" />
        )}
        {label}
      </span>
      <span className="font-medium text-[#57606a]">{points}</span>
    </div>
  );
}
