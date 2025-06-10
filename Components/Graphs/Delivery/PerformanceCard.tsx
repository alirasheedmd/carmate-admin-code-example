"use client";

// React imports
import { useState } from "react";

// Chart.js imports
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import { Line } from "react-chartjs-2";

// Component imports
import CountsCard from "@/components/ui/CountsCard";
import CardHeader from "./CardHeader";
import CustomDropdown from "../ui/CustomDropdown";

// Icon imports
import { Down } from "@/assets/icons";
import RocketIcon from "@/assets/icons/rocketIcon";

// Types
import type {
  PerformanceCardProps,
  ChartData,
  PerformanceMetric,
} from "@/types/dashboard";
import StatsTooltip from "../ui/StatsTooltip";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Chart options
const options: ChartOptions<"line"> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      enabled: true,
      mode: "index" as const,
      intersect: false,
      backgroundColor: "rgba(43, 46, 51, 0.9)",
      titleColor: "#fff",
      bodyColor: "#fff",
      borderColor: "#42464D",
      borderWidth: 1,
      padding: 10,
      displayColors: true,
      callbacks: {
        label: function (context: {
          dataset: { label?: string };
          parsed: { y: number | null };
        }) {
          let label = context.dataset.label || "";
          if (label) {
            label = " " + label + ": ";
          }
          if (context.parsed.y !== null) {
            label += context.parsed.y;
          }
          return label;
        },
        labelColor: function (context: any) {
          return {
            borderColor: context.dataset.backgroundColor,
            backgroundColor: context.dataset.backgroundColor,
            borderWidth: 0,
            borderRadius: 0,
          };
        },
      },
    },
  },
  scales: {
    x: {
      ticks: {
        color: "#fff",
        maxRotation: 45,
        minRotation: 45,
        font: {
          size: 10,
        },
      },
      grid: { display: false },
      border: { color: "#fff" },
      offset: true,
      min: 0,
    },
    y: {
      ticks: { color: "#fff", font: { size: 10 } },
      grid: { display: false },
      border: { color: "#fff" },
      grace: "10%",
    },
  },
  interaction: {
    mode: "index" as const,
    intersect: false,
  },
  layout: {
    padding: {
      left: 10,
      right: 10,
      top: 10,
      bottom: 10
    }
  }
};

// Date range options
const dateRangeOptions = [
  "Last 7 days",
  "Last 30 days",
  "Last 90 days",
] as const;
type DateRange = (typeof dateRangeOptions)[number];

export default function PerformanceCard({
  metrics,
  onPeriodChange,
  selectedPeriod,
}: PerformanceCardProps) {
  const [selectedDateRange, setSelectedDateRange] = useState<DateRange>(
    dateRangeOptions[0]
  );
  const [isDateRangeDropdownOpen, setIsDateRangeDropdownOpen] = useState(false);

  // Chart data
const chartData: ChartData = {
  labels: ["14/04/2025", "14/04/2025", "14/04/2025", "14/04/2025", "14/04/2025", "14/04/2025", "14/04/2025"],
  datasets: [
    {
      label: selectedPeriod || "Performance",
      data: [35, 32, 28, 15, 22, 30, 45],
      borderColor: "#4B7A4B",
      backgroundColor: "#4B7A4B",
      tension: 0.4,
      pointRadius: 0,
      borderWidth: 2,
    }
  ],
};

  const handleDateRangeChange = (dateRange: DateRange) => {
    setSelectedDateRange(dateRange);
    setIsDateRangeDropdownOpen(false);
  };

  return (
    <div className="md:border md:mx-6 border-border-dark rounded-lg bg-panel-dark">
      <CardHeader
        title={
          <div className="flex items-center gap-2">
            <RocketIcon />
            <span>Performance</span>
          </div>
        }
        rightComponent={
          <CustomDropdown
            isOpen={isDateRangeDropdownOpen}
            onClose={() => setIsDateRangeDropdownOpen(false)}
            onSelect={handleDateRangeChange}
            options={dateRangeOptions}
          >
            <button
              className="flex items-center gap-2 hover:bg-dark-gray px-[10px] py-[8px] rounded-[6px] cursor-pointer"
              onClick={() => setIsDateRangeDropdownOpen(true)}
            >
              <span className="text-light-gray-1 text-[14px] md:text-xbase font-[600]">
                {selectedDateRange}
              </span>
              <div className="py-[7px] px-[5px]">
              <Down />
              </div>
            </button>
          </CustomDropdown>
        }
      />

      {/* Metrics */}
      <div className="bg-panel-dark px-[18px] md:px-[16px] md:py-[8px] grid grid-cols-2 md:grid-cols-3 gap-2">
        {metrics.map((metric: PerformanceMetric) => (
          <CountsCard
            key={metric.label}
            label={metric.label}
            value={metric.value}
            selected={selectedPeriod === metric.label}
            onClick={() => onPeriodChange?.(metric.label)}
            icon={
              <StatsTooltip
                title={metric.icon?.title || ""}
                count={metric.icon?.count || ""}
                comparisonText={metric.icon?.comparisonText || ""}
                comparisonValue={metric.icon?.comparisonValue || ""}
                description={metric.icon?.description || ""}
              />
            }
            percentage={metric.percentage}
          />
        ))}
      </div>

      {/* Chart */}
      <div className="h-[290px] bg-panel-dark my-8 mx-10 relative">
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
          <Line data={chartData} options={options} />
        </div>
      </div>
    </div>
  );
}
