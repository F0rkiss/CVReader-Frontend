import type { ReactNode } from "react";

interface ResultWorkspaceLayoutProps {
  title: string;
  description: string;
  leftLabel: string;
  leftTitle: string;
  leftHeaderAside?: ReactNode;
  leftContent: ReactNode;
  rightLabel: string;
  rightTitle: string;
  rightContent: ReactNode;
}

const panelClassName =
  "rounded-2xl border border-gray-200 bg-[#fafafa] p-4 lg:h-full lg:min-h-0 lg:overflow-y-auto";

const ResultWorkspaceLayout = ({
  title,
  description,
  leftLabel,
  leftTitle,
  leftHeaderAside,
  leftContent,
  rightLabel,
  rightTitle,
  rightContent,
}: ResultWorkspaceLayoutProps) => {
  return (
    <div className="bg-[#f5f6f8] lg:h-full lg:overflow-hidden">
      <div className="mx-auto flex w-full flex-col px-2 py-2 sm:px-4 sm:py-3 lg:h-full lg:overflow-hidden lg:px-6 lg:py-4">
        <div className="shrink-0">
          <h1 className="mb-1 text-2xl font-bold text-gray-900">{title}</h1>
          <p className="mb-4 text-sm text-gray-500">{description}</p>
        </div>

        <div className="rounded-3xl border border-gray-200 bg-white p-2 shadow-sm sm:p-3 lg:flex-1 lg:min-h-0 lg:overflow-hidden lg:p-4">
          <div className="grid gap-3 lg:h-full lg:min-h-0 lg:grid-cols-2">
            <section className={panelClassName}>
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    {leftLabel}
                  </p>
                  <h2 className="text-xl font-bold text-gray-900">
                    {leftTitle}
                  </h2>
                </div>
                {leftHeaderAside}
              </div>

              {leftContent}
            </section>

            <section className={panelClassName}>
              <div className="mb-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  {rightLabel}
                </p>
                <h2 className="text-xl font-bold text-gray-900">
                  {rightTitle}
                </h2>
              </div>

              {rightContent}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultWorkspaceLayout;
