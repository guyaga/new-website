import { useState } from 'react';
import { Github, FileText, Copy, Check, ExternalLink, Sparkles, Terminal } from 'lucide-react';
import { useLanguage } from '../../i18n';

function CopyBlock({ text, label, accent }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`relative border rounded-xl p-4 mt-3 ${accent ? 'bg-signal-red/5 border-signal-red/20' : 'bg-white/5 border-white/10'}`}>
      {label && (
        <p className={`font-mono text-[10px] uppercase tracking-widest mb-2 ${accent ? 'text-signal-red/60' : 'text-white/30'}`}>{label}</p>
      )}
      <pre className="font-mono text-sm text-paper whitespace-pre-wrap" dir="ltr">{text}</pre>
      <button
        onClick={handleCopy}
        className="absolute top-3 right-3 p-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
      >
        {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} className="text-white/30" />}
      </button>
    </div>
  );
}

function StructuredSteps({ steps, isHe }) {
  return (
    <div className="space-y-4">
      {steps.map((step) => {
        const title = isHe ? step.title_he : step.title_en;
        const desc = isHe ? step.desc_he : step.desc_en;
        const linkLabel = isHe ? step.link_label_he : step.link_label_en;
        const copyLabel = isHe ? step.copy_label_he : step.copy_label_en;

        return (
          <div key={step.n} className="bg-white/[0.03] border border-white/10 rounded-xl p-5">
            <div className="flex items-start gap-3 mb-2">
              <span className="shrink-0 w-7 h-7 rounded-full bg-signal-red text-white font-mono text-xs font-bold flex items-center justify-center mt-0.5">
                {step.n}
              </span>
              <div className="flex-1 min-w-0">
                <h4 className="font-sans font-semibold text-base text-white mb-1">{title}</h4>
                <p className="font-sans text-sm text-white/50 leading-relaxed">{desc}</p>
              </div>
            </div>

            {step.link && (
              <div className="ms-10 mt-3">
                <a
                  href={step.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-signal-red/10 border border-signal-red/30 text-signal-red font-sans text-sm font-semibold hover:bg-signal-red/20 transition-colors"
                >
                  {linkLabel || step.link}
                  <ExternalLink size={14} />
                </a>
              </div>
            )}

            {step.copy_text && (
              <div className="ms-10">
                <CopyBlock text={step.copy_text} label={copyLabel} accent />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function LessonExpanded({ session }) {
  const [showManual, setShowManual] = useState(false);
  const { lang } = useLanguage();
  const isHe = lang === 'he';

  const desc = isHe ? session.desc_he : session.desc_en;
  const examples = session.examples || [];
  const installSteps = session.install_steps || null;

  // Build the easy prompt from install_prompt or github_url (used only when no install_steps)
  const easyPrompt = session.install_prompt
    ? session.install_prompt.split('\n')[0]
    : session.github_url
      ? `Install the skill from ${session.github_url} and set up everything needed to use it`
      : '';

  return (
    <div className="space-y-6 pt-4">
      {/* Description */}
      {desc && (
        <div>
          <p className="font-mono text-[10px] text-white/30 uppercase tracking-widest mb-2">
            {isHe ? 'תיאור' : 'Description'}
          </p>
          <p className="font-sans text-sm text-white/60 leading-relaxed">{desc}</p>
        </div>
      )}

      {/* Install section */}
      {(session.install_prompt || session.github_url || installSteps) && (
        <div>
          <p className="font-mono text-[10px] text-white/30 uppercase tracking-widest mb-3">
            {isHe ? 'התקנה' : 'Installation'}
          </p>

          {installSteps && installSteps.length > 0 ? (
            /* Structured multi-step install (e.g. Day 4 fal MCP) */
            <>
              <StructuredSteps steps={installSteps} isHe={isHe} />

              {/* Power-user fallback: raw install_prompt */}
              {session.install_prompt && (
                <>
                  <button
                    onClick={() => setShowManual(!showManual)}
                    className="mt-4 flex items-center gap-2 font-mono text-[10px] text-white/20 hover:text-white/40 transition-colors uppercase tracking-widest"
                  >
                    <Terminal size={12} />
                    {isHe ? 'התקנה ידנית (מתקדמים)' : 'Manual Setup (Advanced)'}
                    <span className={`transition-transform ${showManual ? 'rotate-180' : ''}`}>▾</span>
                  </button>
                  {showManual && (
                    <CopyBlock text={session.install_prompt} label={isHe ? 'פקודות Terminal' : 'Terminal Commands'} />
                  )}
                </>
              )}
            </>
          ) : (
            <>
              {/* Standard single-prompt install (Days 1-3, 5-10) */}
              <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5 mb-3">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles size={14} className="text-signal-red" />
                  <p className="font-sans text-sm font-semibold text-white">
                    {isHe ? 'הדרך הקלה — העתיקו ושלחו ל-Claude Code' : 'Easy Way — Copy & paste into Claude Code'}
                  </p>
                  <span className="font-mono text-[9px] bg-signal-red/20 text-signal-red px-2 py-0.5 rounded-full uppercase tracking-widest">
                    {isHe ? 'מומלץ' : 'Recommended'}
                  </span>
                </div>
                <p className="font-sans text-xs text-white/40 mb-2">
                  {isHe
                    ? 'פתחו Claude Code בתיקיית הפרויקט שלכם, העתיקו את הטקסט הבא ושלחו — Claude יטפל בכל השאר.'
                    : 'Open Claude Code in your project folder, paste this prompt and send — Claude handles the rest.'}
                </p>
                <CopyBlock
                  text={easyPrompt}
                  label={isHe ? 'העתיקו את זה ל-Claude Code' : 'Paste this into Claude Code'}
                  accent
                />
              </div>

              <button
                onClick={() => setShowManual(!showManual)}
                className="flex items-center gap-2 font-mono text-[10px] text-white/20 hover:text-white/40 transition-colors uppercase tracking-widest"
              >
                <Terminal size={12} />
                {isHe ? 'התקנה ידנית (מתקדמים)' : 'Manual Setup (Advanced)'}
                <span className={`transition-transform ${showManual ? 'rotate-180' : ''}`}>▾</span>
              </button>

              {showManual && session.install_prompt && (
                <CopyBlock text={session.install_prompt} label={isHe ? 'פקודות Terminal' : 'Terminal Commands'} />
              )}
            </>
          )}
        </div>
      )}

      {/* Resource links */}
      <div>
        <p className="font-mono text-[10px] text-white/30 uppercase tracking-widest mb-3">
          {isHe ? 'משאבים' : 'Resources'}
        </p>
        <div className="flex flex-wrap gap-3">
          {session.github_url && (
            <a
              href={session.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 font-sans text-sm text-white/70 hover:text-signal-red hover:border-signal-red/30 transition-colors"
            >
              <Github size={16} />
              GitHub Repo
              <ExternalLink size={12} className="text-white/20" />
            </a>
          )}
          {session.pdf_url && (
            <a
              href={session.pdf_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 font-sans text-sm text-white/70 hover:text-signal-red hover:border-signal-red/30 transition-colors"
            >
              <FileText size={16} />
              {isHe ? 'מדריך הסקיל' : 'Skill Guide'}
              <ExternalLink size={12} className="text-white/20" />
            </a>
          )}
        </div>
      </div>

      {/* Usage examples */}
      {examples.length > 0 && (
        <div>
          <p className="font-mono text-[10px] text-white/30 uppercase tracking-widest mb-4">
            {isHe ? 'דוגמאות שימוש' : 'Usage Examples'}
          </p>
          <div className="space-y-4">
            {examples.map((ex, i) => (
              <div key={i} className="bg-white/[0.03] border border-white/10 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-6 h-6 rounded-full bg-signal-red/20 text-signal-red font-mono text-xs font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                  <h4 className="font-sans font-semibold text-sm text-white">
                    {isHe ? ex.title_he : ex.title_en}
                  </h4>
                </div>
                {ex.prompt && (
                  <CopyBlock text={ex.prompt} label="Prompt" />
                )}
                {ex.result_image && (
                  <img
                    src={ex.result_image}
                    alt={isHe ? ex.title_he : ex.title_en}
                    className="mt-3 rounded-lg border border-white/10 w-full"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
