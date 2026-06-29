"use client";

/** Company / school name that swaps to its @handle on hover and links to the profile. */
export default function CompanyLink({ name, handle, link }: { name: string; handle?: string; link?: string }) {
  if (!link) return <>{name}</>;
  return (
    <a href={link} target="_blank" rel="noopener noreferrer" className="company-link">
      <span className="co-name">{name}</span>
      <span className="co-handle">{handle ?? name}</span>
    </a>
  );
}
