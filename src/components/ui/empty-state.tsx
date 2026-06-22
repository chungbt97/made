"use client";

interface EmptyStateProps {
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 text-4xl">🎱</div>
      <h3 className="mb-2 text-xl font-semibold text-[#0a0a0a]">{title}</h3>
      <p className="mb-6 max-w-sm text-sm text-[#6a6a6a]">{description}</p>
      {action}
    </div>
  );
}
