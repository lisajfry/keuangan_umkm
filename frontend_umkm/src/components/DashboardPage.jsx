// ===== DashboardPage.jsx =====
import React, { useEffect, useState } from "react";
import umkmApi from "../api/umkmApi";
import CashFlowChart from "../components/CashFlowChart";
import IncomeExpenseChart from "../components/IncomeExpenseChart";


export default function DashboardPage() {
  const [summary, setSummary] = useState(null);
  const [err, setErr] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await umkmApi.getSummary();
        console.log("📊 Summary dari API:", data); 
        setSummary(data);
      } catch (e) {
        setErr(e.message || "Gagal memuat data ringkasan keuangan.");
      }
    };
    load();
  }, []);

  if (err)
    return (
      <div className="flex items-center justify-center h-full p-6">
        <div className="text-red-600 bg-red-50 border border-red-100 px-6 py-4 rounded-lg shadow-sm">
          {err}
        </div>
      </div>
    );

  if (!summary)
    return (
      <div className="flex items-center justify-center h-full text-gray-600 text-lg">
        Memuat ringkasan keuangan...
      </div>
    );

  const inc = summary.income_statement?.revenue ?? 0;
  const exp = summary.income_statement?.expense ?? 0;
  const net = inc - exp;
  const cf = summary.cash_flow ?? {};
const cash = cf.cash_end ?? (cf.cash_start ?? 0) + (cf.net_change_in_cash ?? 0);

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:pl-10 md:pr-8">
      <div>
        {/* Judul Halaman */}
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1">
            Dashboard Keuangan
          </h2>
          <p className="text-gray-500 text-sm sm:text-base">
            Ringkasan kondisi keuangan UMKM Anda secara real-time
          </p>
        </div>

        {/* Ringkasan Utama */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-10">
          <SummaryCard label="Pendapatan" value={inc} color="green" />
          <SummaryCard label="Pengeluaran" value={exp} color="red" />
          <SummaryCard label="Saldo Kas" value={cash} color="blue" />

        </div>

        {/* Ringkasan Laba Rugi */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 md:p-8 hover:shadow-md transition mb-10">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Ringkasan Laba Rugi
          </h3>
          <div className="text-gray-700 space-y-2 text-sm md:text-base">
            <Row label="Pendapatan" value={inc} />
            <Row label="Pengeluaran" value={exp} />
            <div className="flex justify-between mt-3 text-base sm:text-lg font-semibold text-gray-900">
              <span>Laba Bersih</span>
              <span className={net >= 0 ? "text-green-600" : "text-red-600"}>
                Rp {Number(net).toLocaleString("id-ID")}
              </span>
            </div>
          </div>
        </div>

        {/* Cash Flow Chart */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 md:p-8 hover:shadow-md transition">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Arus Kas (Cash Flow)
          </h3>
          <div className="w-full overflow-x-auto">
            <CashFlowChart data={summary.cash_flow} />
          </div>
        </div>

       {/* Grafik Pendapatan vs Pengeluaran */}
<div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 md:p-8 hover:shadow-md transition mt-8">
  <IncomeExpenseChart data={{ monthly: summary.monthly_income_expense }} />

</div>


      </div>
    </div>
  );
}

function SummaryCard({ label, value, color }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 hover:shadow-md transition">
      <p className="text-sm sm:text-base text-gray-500 mb-1">{label}</p>
      <p className={`text-2xl sm:text-3xl font-bold text-${color}-600 tracking-tight`}>
        Rp {Number(value).toLocaleString("id-ID")}
      </p>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between border-b border-gray-100 pb-2">
      <span>{label}</span>
      <span className="font-medium">
        Rp {Number(value).toLocaleString("id-ID")}
      </span>
    </div>
  );
}
