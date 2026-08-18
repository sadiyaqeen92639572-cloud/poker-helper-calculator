interface FormulaConstant {
  name: string;
  value: string;
  source: string;
}

interface FormulaLine {
  text: string;
  comment?: boolean;
  heading?: boolean;
}

interface FormulaBlockProps {
  title?: string;
  sourceLine: string;
  constants?: FormulaConstant[];
  lines: FormulaLine[];
  footerNote: string;
}

export function FormulaBlock({
  title = "How this calculator works — formulas & method",
  sourceLine,
  constants,
  lines,
  footerNote,
}: FormulaBlockProps) {
  return (
    <section className="mt-12 rounded-xl border border-slate-200 bg-slate-50 p-6 sm:p-7">
      <h2 className="text-xl font-bold text-slate-900">{title}</h2>
      <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
        {sourceLine}
      </p>

      {constants && constants.length > 0 && (
        <div className="mt-5 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-500">
                <th className="py-2 pr-4">Constant</th>
                <th className="py-2 pr-4">Value</th>
                <th className="py-2">Source</th>
              </tr>
            </thead>
            <tbody>
              {constants.map((c) => (
                <tr key={c.name} className="border-b border-slate-100 last:border-0">
                  <td className="py-2 pr-4 font-mono text-slate-700">{c.name}</td>
                  <td className="py-2 pr-4 font-mono text-emerald-600">{c.value}</td>
                  <td className="py-2 text-slate-500">{c.source}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <pre className="mt-5 overflow-x-auto whitespace-pre-wrap break-words rounded-lg bg-slate-900 px-5 py-4 font-mono text-[13px] leading-loose text-slate-200">
        <code>
          {lines.map((line, idx) => (
            <span
              key={idx}
              className={
                "block " +
                (line.heading
                  ? "text-emerald-400"
                  : line.comment
                    ? "text-slate-400"
                    : "text-sky-300")
              }
            >
              {line.text || " "}
            </span>
          ))}
        </code>
      </pre>

      <p className="mt-4 text-xs text-slate-500">{footerNote}</p>
    </section>
  );
}
