'use client';

import React from 'react';
import { Award, BarChart2, PieChart as PieChartIcon, Target, TrendingUp } from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { MOCK_STATS_DATA } from '@/lib/mock-stats-data';

export function AnalyticsOverview() {
  const interviews = MOCK_STATS_DATA;

  if (!interviews || interviews.length === 0) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center p-12 text-center">
        <h2 className="mb-2 text-xl font-bold text-white">No Stats Available</h2>
        <p className="text-white/50">Complete some mock interviews to see your performance data.</p>
      </div>
    );
  }

  const count = interviews.length;

  //Skill Radar Data
  const avgTech = interviews.reduce((acc, i) => acc + i.competencies.technicalSkills, 0) / count;
  const avgProb = interviews.reduce((acc, i) => acc + i.competencies.problemSolving, 0) / count;
  const avgComm = interviews.reduce((acc, i) => acc + i.competencies.communication, 0) / count;
  const avgCult = interviews.reduce((acc, i) => acc + i.competencies.culturalFit, 0) / count;

  const skillData = [
    { subject: 'Technical', value: Number(avgTech.toFixed(1)), fullMark: 5 },
    { subject: 'Problem Solving', value: Number(avgProb.toFixed(1)), fullMark: 5 },
    { subject: 'Communication', value: Number(avgComm.toFixed(1)), fullMark: 5 },
    { subject: 'Cultural Fit', value: Number(avgCult.toFixed(1)), fullMark: 5 },
  ];

  //Historical Trend Data
  const timelineData = [...interviews]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((i) => ({
      name: new Date(i.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      score: i.overallScore,
    }));

  const averageOverall = timelineData.reduce((acc, curr) => acc + curr.score, 0) / count;

  //Topic Mastery Data
  const topicsMap: Record<string, { total: number; count: number }> = {};
  interviews.forEach((i) => {
    if (!topicsMap[i.topic]) topicsMap[i.topic] = { total: 0, count: 0 };
    topicsMap[i.topic].total += i.overallScore;
    topicsMap[i.topic].count += 1;
  });
  const topicData = Object.entries(topicsMap)
    .map(([topic, { total, count }]) => ({
      name: topic,
      score: Number((total / count).toFixed(1)),
    }))
    .sort((a, b) => b.score - a.score);

  //Interview Results Distribution Data
  const outcomeCounts = {
    'Strong Hire': 0,
    Hire: 0,
    'Leaning Hire': 0,
    'No Hire': 0,
  };
  interviews.forEach((i) => {
    outcomeCounts[i.hireRecommendation]++;
  });
  const outcomesData = Object.entries(outcomeCounts)
    .filter(([_, count]) => count > 0)
    .map(([name, value]) => ({ name, value }));

  const OUTCOME_COLORS: Record<string, string> = {
    'Strong Hire': '#22c55e',
    Hire: '#4ade80',
    'Leaning Hire': '#a3e635',
    'No Hire': '#ef4444',
  };

  // --- 5. Difficulty Data ---
  const diffMap: Record<string, { total: number; count: number }> = {
    Easy: { total: 0, count: 0 },
    Medium: { total: 0, count: 0 },
    Hard: { total: 0, count: 0 },
  };
  interviews.forEach((i) => {
    diffMap[i.difficulty].total += i.overallScore;
    diffMap[i.difficulty].count += 1;
  });
  const diffData = Object.entries(diffMap).map(([name, { total, count }]) => ({
    name,
    score: count > 0 ? Number((total / count).toFixed(1)) : 0,
  }));

  // --- Custom Tooltips ---
  const CustomRadarTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="max-w-[200px] rounded-md border border-white/10 bg-[var(--card)] p-3 shadow-xl backdrop-blur-md">
          <p className="text-sm font-semibold text-white/90">{data.subject}</p>
          <p className="mt-1 font-mono text-xs text-[var(--accent)]">Avg Score: {data.value}/5</p>
        </div>
      );
    }
    return null;
  };

  const CustomBarTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="max-w-[200px] rounded-md border border-white/10 bg-[var(--card)] p-3 shadow-xl backdrop-blur-md">
          <p className="mb-1 text-sm font-semibold text-white/90">{label}</p>
          <p className="font-mono text-xs text-[var(--accent)]">
            Score: {payload[0].value.toFixed(1)}/5
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="rounded-md border border-white/10 bg-[var(--card)] p-3 shadow-xl backdrop-blur-md">
          <p className="flex items-center gap-2 text-sm font-semibold text-white/90">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: data.fill }} />
            {data.name}
          </p>
          <p className="mt-1 font-mono text-xs text-white/60">Count: {data.value}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="app-viewport-frame bg-background min-h-screen">
      <div className="app-viewport-content mx-auto w-full space-y-6 px-4 py-8">
        {/* Main Grid: Row 1 */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Overall Competency Radar */}
          <div className="relative flex flex-col overflow-hidden rounded-xl border border-white/10 bg-[#0f0f0f] p-6">
            <div className="mb-6 flex items-start justify-between">
              <div>
                <h3 className="flex items-center gap-2 text-lg font-bold tracking-tight text-white">
                  <Target className="h-5 w-5 text-white/40" />
                  Overall Competency
                </h3>
                <p className="mt-1 text-xs text-white/40">Average scores across core skills</p>
              </div>
            </div>

            <div className="relative mt-2 min-h-[250px] w-full flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillData}>
                  <PolarGrid stroke="rgba(255,255,255,0.08)" gridType="polygon" />
                  <PolarAngleAxis
                    dataKey="subject"
                    tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 11, fontFamily: 'monospace' }}
                  />
                  <PolarRadiusAxis domain={[0, 5]} tick={false} axisLine={false} tickCount={6} />
                  <Radar
                    name="Skills"
                    dataKey="value"
                    stroke="var(--accent)"
                    strokeWidth={2}
                    fill="var(--accent)"
                    fillOpacity={0.2}
                    isAnimationActive={true}
                  />
                  <Tooltip content={<CustomRadarTooltip />} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Historical Performance Timeline */}
          <div className="relative flex flex-col overflow-hidden rounded-xl border border-white/10 bg-[#0f0f0f] p-6">
            <div className="mb-6 flex items-start justify-between">
              <div>
                <h3 className="flex items-center gap-2 text-lg font-bold tracking-tight text-white">
                  <TrendingUp className="h-5 w-5 text-white/40" />
                  Performance Trend
                </h3>
                <p className="mt-1 text-xs text-white/40">Overall score over time</p>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 backdrop-blur-sm">
                <span className="font-mono text-xs font-bold text-white">
                  AVG: {averageOverall.toFixed(2)}/5.0
                </span>
              </div>
            </div>

            <div className="mt-2 -ml-2 min-h-[250px] w-full flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={timelineData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    vertical={false}
                    horizontal={true}
                    stroke="rgba(255,255,255,0.05)"
                    strokeDasharray="3 3"
                  />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontFamily: 'monospace' }}
                    axisLine={false}
                    tickLine={false}
                    dy={10}
                  />
                  <YAxis
                    domain={[0, 5]}
                    ticks={[0, 1, 2, 3, 4, 5]}
                    tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontFamily: 'monospace' }}
                    axisLine={false}
                    tickLine={false}
                    dx={-10}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--card)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '4px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                    }}
                    itemStyle={{
                      color: 'var(--accent)',
                      fontFamily: 'monospace',
                      fontSize: '12px',
                    }}
                    labelStyle={{
                      color: 'var(--foreground)',
                      fontFamily: 'monospace',
                      fontSize: '10px',
                      marginBottom: '4px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke="var(--accent)"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#trendGradient)"
                    activeDot={{
                      r: 6,
                      stroke: 'var(--card)',
                      strokeWidth: 2,
                      fill: 'var(--accent)',
                    }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Main Grid: Row 2 */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Topic Mastery */}
          <div className="relative flex flex-col overflow-hidden rounded-xl border border-white/10 bg-[#0f0f0f] p-6 lg:col-span-2">
            <div className="mb-6 flex items-start justify-between">
              <div>
                <h3 className="flex items-center gap-2 text-lg font-bold tracking-tight text-white">
                  <BarChart2 className="h-5 w-5 text-white/40" />
                  Topic Mastery
                </h3>
                <p className="mt-1 text-xs text-white/40">Average scores by problem topic</p>
              </div>
            </div>

            <div className="mt-2 min-h-[250px] w-full flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={topicData}
                  layout="vertical"
                  margin={{ top: 0, right: 10, left: 10, bottom: 0 }}
                >
                  <CartesianGrid
                    horizontal={true}
                    vertical={false}
                    stroke="rgba(255,255,255,0.05)"
                    strokeDasharray="3 3"
                  />
                  <XAxis type="number" domain={[0, 5]} hide />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    width={140}
                  />
                  <Tooltip
                    content={<CustomBarTooltip />}
                    cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                  />
                  <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={24}>
                    {topicData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill="rgb(220, 220, 220)" fillOpacity={0.8} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recommendation Outcomes */}
          <div className="relative flex flex-col overflow-hidden rounded-xl border border-white/10 bg-[#0f0f0f] p-6 lg:row-span-2">
            <div className="mb-2 flex items-start justify-between">
              <div>
                <h3 className="flex items-center gap-2 text-lg font-bold tracking-tight text-white">
                  <PieChartIcon className="h-5 w-5 text-white/40" />
                  Outcomes
                </h3>
                <p className="mt-1 text-xs text-white/40">Hire recommendations</p>
              </div>
            </div>

            <div className="mt-2 flex w-full flex-1 flex-col">
              <div className="min-h-[160px] flex-1">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={outcomesData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                      stroke="none"
                    >
                      {outcomesData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={OUTCOME_COLORS[entry.name] || '#9ca3af'}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomPieTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              {/* Legend within chart area */}
              <div className="mt-2 flex flex-col gap-2 px-2 pb-2">
                {outcomesData.map((entry) => (
                  <div key={entry.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: OUTCOME_COLORS[entry.name] || '#9ca3af' }}
                      />
                      <span className="font-medium text-white/70">{entry.name}</span>
                    </div>
                    <span className="font-mono text-white">{entry.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Difficulty Breakdown (Optional Bottom Row) */}
          <div className="relative flex flex-col overflow-hidden rounded-xl border border-white/10 bg-[#0f0f0f] p-6 lg:col-span-2">
            <div className="mb-6 flex items-start justify-between">
              <div>
                <h3 className="flex items-center gap-2 text-lg font-bold tracking-tight text-white">
                  <BarChart2 className="h-5 w-5 text-white/40" />
                  Difficulty Performance
                </h3>
                <p className="mt-1 text-xs text-white/40">
                  Average score mapped by question difficulty
                </p>
              </div>
            </div>
            <div className="mt-2 min-h-[220px] w-full flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={diffData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid
                    vertical={false}
                    horizontal={true}
                    stroke="rgba(255,255,255,0.05)"
                    strokeDasharray="3 3"
                  />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12, fontFamily: 'monospace' }}
                    axisLine={false}
                    tickLine={false}
                    dy={10}
                  />
                  <YAxis
                    type="number"
                    domain={[0, 5]}
                    ticks={[0, 1, 2, 3, 4, 5]}
                    tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontFamily: 'monospace' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    content={<CustomBarTooltip />}
                    cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                  />
                  <Bar dataKey="score" radius={[4, 4, 0, 0]} barSize={40}>
                    {diffData.map((entry, index) => {
                      const fillGradient =
                        entry.name === 'Easy'
                          ? '#4ade80'
                          : entry.name === 'Medium'
                            ? '#facc15'
                            : '#f87171';
                      return <Cell key={`cell-${index}`} fill={fillGradient} fillOpacity={0.8} />;
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
