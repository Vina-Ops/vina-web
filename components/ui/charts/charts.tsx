import React from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { cn } from "@/lib/utils";

export type ChartType = "line" | "bar" | "area" | "pie";

export interface ChartData {
  name: string;
  value: number;
  [key: string]: any;
}

export interface ChartProps {
  type: ChartType;
  data: ChartData[];
  dataKey: string;
  categories?: string[];
  colors?: string[];
  height?: number;
  width?: number;
  className?: string;
  showLegend?: boolean;
  showTooltip?: boolean;
  showGrid?: boolean;
  stacked?: boolean;
  animationDuration?: number;
  xAxisLabel?: string;
  yAxisLabel?: string;
  valueFormatter?: (value: number) => string;
  customTooltip?: React.ReactNode;
}

const defaultColors = [
  "#3b82f6", // blue-500
  "#10b981", // emerald-500
  "#f59e0b", // amber-500
  "#ef4444", // red-500
  "#8b5cf6", // violet-500
  "#ec4899", // pink-500
  "#06b6d4", // cyan-500
  "#f97316", // orange-500
];

export function Chart({
  type,
  data,
  dataKey,
  categories,
  colors = defaultColors,
  height = 400,
  width,
  className,
  showLegend = true,
  showTooltip = true,
  showGrid = true,
  stacked = false,
  animationDuration = 1000,
  xAxisLabel,
  yAxisLabel,
  valueFormatter = (value) => value.toString(),
  customTooltip,
}: ChartProps) {
  const renderTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;

    if (customTooltip) return customTooltip;

    return (
      <div className="rounded-lg border border-gray-200 bg-white p-2 shadow-lg">
        <p className="font-medium">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {valueFormatter(entry.value)}
          </p>
        ))}
      </div>
    );
  };

  const renderLegend = (props: any) => {
    const { payload } = props;

    return (
      <div className="mt-4 flex flex-wrap justify-center gap-4">
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-gray-600">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };

  const renderChart = () => {
    const commonProps = {
      data,
      margin: { top: 10, right: 10, left: 10, bottom: 10 },
      animationDuration,
    };

    if (!type || !data || data.length === 0) {
      return <div>No data available</div>;
    }

    switch (type) {
      case "line":
        return (
          <LineChart {...commonProps}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" />}
            <XAxis
              dataKey="name"
              label={
                xAxisLabel
                  ? { value: xAxisLabel, position: "bottom" }
                  : undefined
              }
            />
            <YAxis
              label={
                yAxisLabel
                  ? { value: yAxisLabel, angle: -90, position: "left" }
                  : undefined
              }
            />
            {showTooltip && <Tooltip content={renderTooltip} />}
            {categories?.map((category, index) => (
              <Line
                key={category}
                type="monotone"
                dataKey={category}
                stroke={colors[index % colors.length]}
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            ))}
            {showLegend && <Legend content={renderLegend} />}
          </LineChart>
        );

      case "bar":
        return (
          <BarChart {...commonProps}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" />}
            <XAxis
              dataKey="name"
              label={
                xAxisLabel
                  ? { value: xAxisLabel, position: "bottom" }
                  : undefined
              }
            />
            <YAxis
              label={
                yAxisLabel
                  ? { value: yAxisLabel, angle: -90, position: "left" }
                  : undefined
              }
            />
            {showTooltip && <Tooltip content={renderTooltip} />}
            {categories?.map((category, index) => (
              <Bar
                key={category}
                dataKey={category}
                fill={colors[index % colors.length]}
                stackId={stacked ? "stack" : undefined}
              />
            ))}
            {showLegend && <Legend content={renderLegend} />}
          </BarChart>
        );

      case "area":
        return (
          <AreaChart {...commonProps}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" />}
            <XAxis
              dataKey="name"
              label={
                xAxisLabel
                  ? { value: xAxisLabel, position: "bottom" }
                  : undefined
              }
            />
            <YAxis
              label={
                yAxisLabel
                  ? { value: yAxisLabel, angle: -90, position: "left" }
                  : undefined
              }
            />
            {showTooltip && <Tooltip content={renderTooltip} />}
            {categories?.map((category, index) => (
              <Area
                key={category}
                type="monotone"
                dataKey={category}
                fill={colors[index % colors.length]}
                stroke={colors[index % colors.length]}
                stackId={stacked ? "stack" : undefined}
              />
            ))}
            {showLegend && <Legend content={renderLegend} />}
          </AreaChart>
        );

      case "pie":
        return (
          <PieChart {...commonProps}>
            {showTooltip && <Tooltip content={renderTooltip} />}
            <Pie
              data={data}
              dataKey={dataKey}
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={colors[index % colors.length]}
                />
              ))}
            </Pie>
            {showLegend && <Legend content={renderLegend} />}
          </PieChart>
        );

      default:
        return <div>Unsupported chart type</div>;
    }
  };

  return (
    <div className={cn("w-full", className)}>
      <ResponsiveContainer width={width || "100%"} height={height}>
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
}
