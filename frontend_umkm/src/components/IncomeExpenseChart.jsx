import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";

export default function IncomeExpenseChart({ data }) {
  if (!data || !Array.isArray(data.monthly)) {
    return (
      <p className="text-gray-500 text-sm">
        Tidak ada data pendapatan dan pengeluaran tersedia.
      </p>
    );
  }

  const allMonths = [
    "Jan","Feb","Mar","Apr","May","Jun",
    "Jul","Aug","Sep","Oct","Nov","Dec"
  ];

  const dataMap = {};
  data.monthly.forEach((item) => {
    dataMap[item.month] = {
      month: item.month,
      revenue: parseFloat(item.revenue) || 0,
      expense: parseFloat(item.expense) || 0,
    };
  });

  const chartData = allMonths.map((m) => dataMap[m] || { month: m, revenue: 0, expense: 0 });

  const maxRevenue = chartData.reduce((a, b) => (b.revenue > a.revenue ? b : a));
  const minRevenue = chartData.reduce((a, b) => (b.revenue < a.revenue ? b : a));

  // Custom dot untuk highlight bulan tertinggi/terendah
  const CustomDot = ({ cx, cy, payload }) => {
    if (payload.month === maxRevenue.month) {
      return <circle cx={cx} cy={cy} r={6} fill="#16a34a" stroke="#065f46" strokeWidth={2} />;
    }
    if (payload.month === minRevenue.month) {
      return <circle cx={cx} cy={cy} r={6} fill="#f87171" stroke="#b91c1c" strokeWidth={2} />;
    }
    return <circle cx={cx} cy={cy} r={4} fill="#22c55e" />;
  };

  return (
    <div className="w-full h-80 mt-8">
      <h4 className="text-base font-semibold text-gray-700 mb-2">
        Pendapatan dan Pengeluaran per Bulan
      </h4>

      <p className="text-sm text-gray-500 mb-4">
        Bulan pendapatan tertinggi:{" "}
        <span className="font-semibold text-green-600">{maxRevenue.month}</span>{" "}
        (Rp {maxRevenue.revenue.toLocaleString("id-ID")}) — 
        terendah:{" "}
        <span className="font-semibold text-red-600">{minRevenue.month}</span>{" "}
        (Rp {minRevenue.revenue.toLocaleString("id-ID")})
      </p>

      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 10, right: 30, left: 10, bottom: 0 }}
        >
          <defs>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22c55e" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#22c55e" stopOpacity={0.2} />
            </linearGradient>
            <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ef4444" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#ef4444" stopOpacity={0.2} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="month" tick={{ fontSize: 12 }} />
          <YAxis
            tickFormatter={(val) =>
              `Rp ${val.toLocaleString("id-ID", { maximumFractionDigits: 0 })}`
            }
            tick={{ fontSize: 12 }}
          />
          <Tooltip
            formatter={(value) =>
              `Rp ${Number(value).toLocaleString("id-ID", { maximumFractionDigits: 0 })}`
            }
          />
          <Legend verticalAlign="top" height={36} />

          <Line
            type="monotone"
            dataKey="revenue"
            stroke="url(#revenueGradient)"
            strokeWidth={3}
            dot={<CustomDot />}
            name="Pendapatan"
            activeDot={{ r: 8 }}
          />
          <Line
            type="monotone"
            dataKey="expense"
            stroke="url(#expenseGradient)"
            strokeWidth={3}
            dot={{ r: 4, fill: "#ef4444" }}
            name="Pengeluaran"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
