import { 
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from "recharts";

export default function CashFlowChart({ data }) {
  if (!data) return <p className="text-gray-500">Tidak ada data cash flow.</p>;

  const chartData = [
    { name: "Operasional", value: data.operating },
    { name: "Investasi", value: data.investing },
    { name: "Pendanaan", value: data.financing },
  ];

  const gradients = {
    Operasional: "url(#gradOp)",
    Investasi: "url(#gradInv)",
    Pendanaan: "url(#gradFin)",
  };

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <defs>
            <linearGradient id="gradOp" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.2} />
            </linearGradient>
            <linearGradient id="gradInv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ef4444" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#ef4444" stopOpacity={0.2} />
            </linearGradient>
            <linearGradient id="gradFin" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22c55e" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#22c55e" stopOpacity={0.2} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" />
          <YAxis tickFormatter={(val) => `Rp ${val.toLocaleString("id-ID")}`} />
          <Tooltip formatter={(v) => `Rp ${v.toLocaleString("id-ID")}`} />

          <Bar dataKey="value" radius={[8, 8, 0, 0]}>
            {chartData.map((entry) => (
              <Cell key={entry.name} fill={gradients[entry.name]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
