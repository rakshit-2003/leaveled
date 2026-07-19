"use client";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from "recharts";

interface ChartData {
  name: string;
  allocated: number;
  used: number;
  color: string;
}

export function LeaveChart({ data }: { data: ChartData[] }) {
  if (data.length === 0) return null;

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
      <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">Leave Overview</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Allocated vs used days this year</p>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} barGap={4} barCategoryGap="30%">
          <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-gray-100 dark:text-gray-800" vertical={false} />
          <XAxis dataKey="name" tick={{ fontSize: 12, fill: "currentColor" }} className="text-gray-500 dark:text-gray-400" axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 12, fill: "currentColor" }} className="text-gray-500 dark:text-gray-400" axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--tooltip-bg, #fff)",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              fontSize: "12px",
            }}
            cursor={{ fill: "transparent" }}
          />
          <Bar dataKey="allocated" name="Allocated" radius={[4,4,0,0]} fill="#e0e7ff">
            {data.map((d, i) => <Cell key={i} fill={d.color + "33"} />)}
          </Bar>
          <Bar dataKey="used" name="Used" radius={[4,4,0,0]}>
            {data.map((d, i) => <Cell key={i} fill={d.color} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
