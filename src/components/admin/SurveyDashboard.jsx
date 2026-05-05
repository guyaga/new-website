import { useMemo } from 'react';
import { Star } from 'lucide-react';

const TIME_LABEL = {
  lt1: '< 1 hour',
  '1to3': '1–3 hours',
  '3to10': '3–10 hours',
  '10plus': '10+ hours',
};
const TIME_ORDER = ['lt1', '1to3', '3to10', '10plus'];

function npsColor(n) {
  if (n >= 9) return '#10B981'; // green = promoter
  if (n >= 7) return '#F59E0B'; // amber = passive
  return '#E63B2E'; // red = detractor
}

function StatCard({ label, value, accent }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-5">
      <p className="font-mono text-[10px] uppercase tracking-widest text-white/40 mb-2">{label}</p>
      <p className={`font-sans font-bold text-3xl ${accent || 'text-white'}`}>{value}</p>
    </div>
  );
}

function SectionHeader({ title }) {
  return (
    <div className="mb-4 flex items-end gap-3">
      <h3 className="font-sans font-bold text-lg text-white">{title}</h3>
      <div className="flex-1 h-px bg-white/10" />
    </div>
  );
}

function HBar({ label, count, total, color = '#E63B2E', sub }) {
  const pct = total ? (count / total) * 100 : 0;
  return (
    <div className="space-y-1">
      <div className="flex items-baseline justify-between gap-3">
        <span className="font-sans text-sm text-white/80">{label}</span>
        <span className="font-mono text-xs text-white/40 shrink-0">
          {count} {sub && <span className="text-white/30">· {sub}</span>}
        </span>
      </div>
      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

export default function SurveyDashboard({ responses, lessons }) {
  const lessonByDay = useMemo(() => {
    const m = {};
    for (const l of lessons) m[l.day] = l;
    return m;
  }, [lessons]);

  const stats = useMemo(() => {
    if (responses.length === 0) {
      return { count: 0, avgNps: '—', avgRating: '—', npsScore: null, promoters: 0, passives: 0, detractors: 0 };
    }
    const npsValues = responses.map((r) => r.nps).filter((n) => n != null);
    const ratingValues = responses.map((r) => r.overall_rating).filter((n) => n != null);
    const avgNps = npsValues.length ? (npsValues.reduce((a, b) => a + b, 0) / npsValues.length).toFixed(1) : '—';
    const avgRating = ratingValues.length ? (ratingValues.reduce((a, b) => a + b, 0) / ratingValues.length).toFixed(1) : '—';
    const promoters = npsValues.filter((n) => n >= 9).length;
    const passives = npsValues.filter((n) => n >= 7 && n <= 8).length;
    const detractors = npsValues.filter((n) => n <= 6).length;
    const npsScore = npsValues.length ? Math.round(((promoters - detractors) / npsValues.length) * 100) : null;
    return { count: responses.length, avgNps, avgRating, npsScore, promoters, passives, detractors, npsValuesCount: npsValues.length };
  }, [responses]);

  // NPS distribution 0-10
  const npsDistribution = useMemo(() => {
    const buckets = Array.from({ length: 11 }, () => 0);
    for (const r of responses) {
      if (typeof r.nps === 'number' && r.nps >= 0 && r.nps <= 10) buckets[r.nps]++;
    }
    const max = Math.max(1, ...buckets);
    return { buckets, max };
  }, [responses]);

  // Top useful skills
  const topUseful = useMemo(() => {
    const counts = {};
    for (const r of responses) {
      for (const d of (r.top_useful_days || [])) counts[d] = (counts[d] || 0) + 1;
    }
    return Array.from({ length: 10 }, (_, i) => i + 1)
      .map((day) => ({ day, count: counts[day] || 0 }))
      .sort((a, b) => b.count - a.count);
  }, [responses]);

  // Needs depth
  const needsDepth = useMemo(() => {
    const counts = {};
    for (const r of responses) {
      if (r.needs_depth_day) counts[r.needs_depth_day] = (counts[r.needs_depth_day] || 0) + 1;
    }
    return Array.from({ length: 10 }, (_, i) => i + 1)
      .map((day) => ({ day, count: counts[day] || 0 }))
      .sort((a, b) => b.count - a.count);
  }, [responses]);

  // Time saved buckets
  const timeSaved = useMemo(() => {
    const counts = {};
    for (const r of responses) {
      if (r.weekly_time_saved) counts[r.weekly_time_saved] = (counts[r.weekly_time_saved] || 0) + 1;
    }
    return TIME_ORDER.map((k) => ({ key: k, label: TIME_LABEL[k], count: counts[k] || 0 }));
  }, [responses]);

  // Rating distribution
  const ratingDistribution = useMemo(() => {
    const buckets = [0, 0, 0, 0, 0]; // index 0 = 1 star
    for (const r of responses) {
      if (typeof r.overall_rating === 'number' && r.overall_rating >= 1 && r.overall_rating <= 5) {
        buckets[r.overall_rating - 1]++;
      }
    }
    const max = Math.max(1, ...buckets);
    return { buckets, max };
  }, [responses]);

  const recentQuotes = useMemo(() => {
    return responses
      .filter((r) => r.what_built || r.next_topic || r.additional_comments)
      .slice(0, 6);
  }, [responses]);

  if (responses.length === 0) {
    return (
      <div className="bg-white/5 border border-white/10 rounded-xl p-12 text-center">
        <p className="font-sans text-white/40">No survey responses yet — once people submit, the dashboard fills in here.</p>
      </div>
    );
  }

  const totalTopUseful = responses.length; // each response can pick up to 3, but % of respondents who picked it
  const totalNeedsDepth = responses.filter((r) => r.needs_depth_day != null).length;
  const totalTime = responses.filter((r) => r.weekly_time_saved).length;

  return (
    <div className="space-y-10">
      {/* Top stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Responses" value={stats.count} />
        <StatCard
          label="NPS Score"
          value={stats.npsScore == null ? '—' : stats.npsScore}
          accent={stats.npsScore == null ? 'text-white/40' : stats.npsScore >= 50 ? 'text-emerald-400' : stats.npsScore >= 0 ? 'text-amber-400' : 'text-signal-red'}
        />
        <StatCard label="Avg NPS" value={stats.avgNps} accent="text-white" />
        <StatCard label="Avg Rating" value={`${stats.avgRating} / 5`} accent="text-signal-red" />
      </div>

      {/* NPS distribution */}
      <div>
        <SectionHeader title="NPS distribution" />
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <div className="grid grid-cols-11 gap-2 mb-3" style={{ height: '160px' }}>
            {npsDistribution.buckets.map((count, i) => {
              const pct = (count / npsDistribution.max) * 100;
              return (
                <div key={i} className="flex flex-col-reverse items-center gap-2">
                  <span className="font-mono text-[10px] text-white/40">{i}</span>
                  <div className="w-full flex-1 flex flex-col-reverse">
                    <div
                      className="w-full rounded-t transition-all"
                      style={{ height: `${Math.max(pct, count > 0 ? 4 : 0)}%`, background: npsColor(i) }}
                      title={`${count} responses`}
                    />
                  </div>
                  <span className="font-mono text-[10px] text-white font-bold">{count || ''}</span>
                </div>
              );
            })}
          </div>
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10 text-xs">
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-2 text-white/60">
                <span className="w-3 h-3 rounded-full" style={{ background: '#E63B2E' }} /> Detractors {stats.detractors}
              </span>
              <span className="flex items-center gap-2 text-white/60">
                <span className="w-3 h-3 rounded-full" style={{ background: '#F59E0B' }} /> Passives {stats.passives}
              </span>
              <span className="flex items-center gap-2 text-white/60">
                <span className="w-3 h-3 rounded-full" style={{ background: '#10B981' }} /> Promoters {stats.promoters}
              </span>
            </div>
            <span className="font-mono text-white/30">n = {stats.npsValuesCount}</span>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Top useful */}
        <div>
          <SectionHeader title="Most useful skills" />
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-3">
            {topUseful.map(({ day, count }) => {
              const lesson = lessonByDay[day];
              if (!lesson) return null;
              const pct = totalTopUseful ? Math.round((count / totalTopUseful) * 100) : 0;
              return (
                <HBar
                  key={day}
                  label={`Day ${day} · ${lesson.name_en}`}
                  count={count}
                  total={totalTopUseful}
                  sub={`${pct}%`}
                  color="#E63B2E"
                />
              );
            })}
          </div>
        </div>

        {/* Needs depth */}
        <div>
          <SectionHeader title="Needs more depth" />
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-3">
            {needsDepth.map(({ day, count }) => {
              const lesson = lessonByDay[day];
              if (!lesson) return null;
              const pct = totalNeedsDepth ? Math.round((count / totalNeedsDepth) * 100) : 0;
              return (
                <HBar
                  key={day}
                  label={`Day ${day} · ${lesson.name_en}`}
                  count={count}
                  total={totalNeedsDepth || 1}
                  sub={count ? `${pct}%` : null}
                  color="#F59E0B"
                />
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Time saved */}
        <div>
          <SectionHeader title="Time saved per week" />
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-3">
            {timeSaved.map(({ key, label, count }) => {
              const pct = totalTime ? Math.round((count / totalTime) * 100) : 0;
              return (
                <HBar key={key} label={label} count={count} total={totalTime || 1} sub={count ? `${pct}%` : null} color="#10B981" />
              );
            })}
          </div>
        </div>

        {/* Rating distribution */}
        <div>
          <SectionHeader title="Rating distribution" />
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <div className="grid grid-cols-5 gap-3" style={{ height: '160px' }}>
              {ratingDistribution.buckets.map((count, i) => {
                const stars = i + 1;
                const pct = (count / ratingDistribution.max) * 100;
                return (
                  <div key={stars} className="flex flex-col-reverse items-center gap-2">
                    <div className="flex gap-0.5">
                      {Array.from({ length: stars }, (_, j) => (
                        <Star key={j} size={11} className="text-signal-red" fill="currentColor" />
                      ))}
                    </div>
                    <div className="w-full flex-1 flex flex-col-reverse">
                      <div
                        className="w-full rounded-t bg-signal-red transition-all"
                        style={{ height: `${Math.max(pct, count > 0 ? 4 : 0)}%` }}
                      />
                    </div>
                    <span className="font-mono text-xs text-white font-bold">{count || ''}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Recent quotes */}
      {recentQuotes.length > 0 && (
        <div>
          <SectionHeader title="Recent quotes" />
          <div className="grid md:grid-cols-2 gap-3">
            {recentQuotes.map((r) => (
              <div key={r.id} className="bg-white/5 border border-white/10 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="font-sans font-semibold text-white text-sm">{r.name}</span>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-white/30">[{r.lang}]</span>
                  {r.nps != null && (
                    <span className="ms-auto font-mono text-xs font-bold" style={{ color: npsColor(r.nps) }}>
                      NPS {r.nps}
                    </span>
                  )}
                </div>
                {r.what_built && (
                  <div className="mb-3">
                    <p className="font-mono text-[9px] uppercase tracking-widest text-white/40 mb-1">Built</p>
                    <p dir={r.lang === 'he' ? 'rtl' : 'ltr'} className="font-sans text-sm text-white/80 whitespace-pre-wrap leading-relaxed">{r.what_built}</p>
                  </div>
                )}
                {r.next_topic && (
                  <div className="mb-3">
                    <p className="font-mono text-[9px] uppercase tracking-widest text-white/40 mb-1">Wants next</p>
                    <p dir={r.lang === 'he' ? 'rtl' : 'ltr'} className="font-sans text-sm text-white/80 whitespace-pre-wrap leading-relaxed">{r.next_topic}</p>
                  </div>
                )}
                {r.additional_comments && (
                  <div>
                    <p className="font-mono text-[9px] uppercase tracking-widest text-white/40 mb-1">Comments</p>
                    <p dir={r.lang === 'he' ? 'rtl' : 'ltr'} className="font-sans text-sm text-white/80 whitespace-pre-wrap leading-relaxed">{r.additional_comments}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
