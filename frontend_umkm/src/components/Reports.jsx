import { useEffect, useState } from "react";
import umkmApi from "../api/umkmApi";

export default function Reports() {
  const [activeTab, setActiveTab] = useState("income");
  const [incomeData, setIncomeData] = useState({});
  const [retainedData, setRetainedData] = useState({});
  const [balanceData, setBalanceData] = useState({});
  const [cashFlowData, setCashFlowData] = useState({});
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchIncomeStatement();
    fetchRetainedEarnings();
    fetchBalanceSheet();
    fetchCashFlow();
  }, []);

  const fetchIncomeStatement = async () => {
    try {
      const res = await umkmApi.get("/reports/income-statement");
      setIncomeData(res.data);
    } catch (err) {
      setMessage(err.response?.data?.message || "Gagal load income statement");
    }
  };

  const fetchRetainedEarnings = async () => {
    try {
      const res = await umkmApi.get("/reports/retained-earnings");
      setRetainedData(res.data);
    } catch (err) {
      setMessage(err.response?.data?.message || "Gagal load retained earnings");
    }
  };

  const fetchBalanceSheet = async () => {
    try {
      const res = await umkmApi.get("/reports/balance-sheet");
      setBalanceData(res.data);
    } catch (err) {
      setMessage(err.response?.data?.message || "Gagal load balance sheet");
    }
  };

  const fetchCashFlow = async () => {
    try {
      const res = await umkmApi.get("/reports/cash-flow");
      setCashFlowData(res.data);
    } catch (err) {
      setMessage(err.response?.data?.message || "Gagal load cash flow");
    }
  };

  const formatRupiah = (value) =>
    value || value === 0
      ? `Rp ${Number(value).toLocaleString("id-ID")}`
      : "-";

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto bg-white p-6 rounded-2xl shadow">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          Laporan Keuangan UMKM
        </h2>

        {message && (
          <p className="text-red-600 bg-red-100 p-3 rounded-lg mb-4">
            {message}
          </p>
        )}

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { id: "income", label: "Laporan Laba Rugi" },
            { id: "retained", label: "Laba Ditahan" },
            { id: "balance", label: "Neraca" },
            { id: "cashflow", label: "Arus Kas" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white shadow"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="mt-4 text-gray-700">
          {/* Laba Rugi */}
          {activeTab === "income" && (
            <div>
              <h3 className="font-semibold text-lg mb-3">
                Laporan Laba Rugi (Income Statement)
              </h3>
              <div className="bg-gray-50 rounded-xl p-4">
                <p>Pendapatan: {formatRupiah(incomeData.revenue)}</p>
                <p>Beban: {formatRupiah(incomeData.expense)}</p>
                <p className="font-semibold mt-2">
                  Laba Bersih: {formatRupiah(incomeData.net_income)}
                </p>
              </div>
            </div>
          )}

          {/* Laba Ditahan */}
          {activeTab === "retained" && (
            <div>
              <h3 className="font-semibold text-lg mb-3">
                Laporan Laba Ditahan
              </h3>
              <div className="bg-gray-50 rounded-xl p-4">
                <p>Laba Bersih: {formatRupiah(retainedData.net_income)}</p>
                <p>Dividen: {formatRupiah(retainedData.dividends)}</p>
                <p className="font-semibold mt-2">
                  Laba Ditahan: {formatRupiah(retainedData.retained_earnings)}
                </p>
              </div>
            </div>
          )}

          {/* Neraca */}
          {activeTab === "balance" && (
            <div>
              <h3 className="font-semibold text-lg mb-3">Laporan Neraca</h3>
              <div className="grid md:grid-cols-3 gap-4 bg-gray-50 rounded-xl p-4">
                <div>
                  <h4 className="font-semibold mb-2">Aset</h4>
                  {balanceData.assets?.map((a, i) => (
                    <p key={i}>
                      {a.name}: {formatRupiah(a.balance)}
                    </p>
                  ))}
                  <p className="font-semibold mt-2">
                    Total Aset: {formatRupiah(balanceData.total_assets)}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Kewajiban</h4>
                  {balanceData.liabilities?.map((l, i) => (
                    <p key={i}>
                      {l.name}: {formatRupiah(l.balance)}
                    </p>
                  ))}
                  <p className="font-semibold mt-2">
                    Total Kewajiban:{" "}
                    {formatRupiah(balanceData.total_liabilities)}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Ekuitas</h4>
                  {balanceData.equities?.map((e, i) => (
                    <p key={i}>
                      {e.name}: {formatRupiah(e.balance)}
                    </p>
                  ))}
                  <p className="font-semibold mt-2">
                    Total Ekuitas: {formatRupiah(balanceData.total_equity)}
                  </p>
                </div>
              </div>
              <p className="mt-4">
                Status Keseimbangan:{" "}
                <span className="font-semibold">
                  {balanceData.balanced ? "✅ Seimbang" : "❌ Tidak Seimbang"}
                </span>
              </p>
            </div>
          )}

          {/* Arus Kas */}
          {activeTab === "cashflow" && (
            <div>
              <h3 className="font-semibold text-lg mb-3">
                Laporan Arus Kas (Cash Flow)
              </h3>

              <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                <p>
                  💼 <strong>Kas Awal:</strong>{" "}
                  {formatRupiah(cashFlowData.cash_start)}
                </p>
                <p>
                  🔹 <strong>Arus Kas dari Aktivitas Operasi:</strong>{" "}
                  {formatRupiah(cashFlowData.operating)}
                </p>
                <p>
                  🏗️ <strong>Arus Kas dari Aktivitas Investasi:</strong>{" "}
                  {formatRupiah(cashFlowData.investing)}
                </p>
                <p>
                  💳 <strong>Arus Kas dari Aktivitas Pendanaan:</strong>{" "}
                  {formatRupiah(cashFlowData.financing)}
                </p>
                <p className="font-semibold border-t pt-2 mt-2">
                  🔻 Kenaikan (Penurunan) Kas Bersih:{" "}
                  {formatRupiah(cashFlowData.net_change_in_cash)}
                </p>
                <p>
                  💰 <strong>Kas Akhir:</strong>{" "}
                  {formatRupiah(cashFlowData.cash_end)}
                </p>
              </div>

              {cashFlowData.details && (
                <div className="mt-6">
                  <h4 className="font-semibold mb-2">Rincian Perhitungan:</h4>
                  <table className="w-full border-collapse text-sm">
                    <tbody>
                      <tr>
                        <td className="border p-2">Laba Bersih</td>
                        <td className="border p-2">
                          {formatRupiah(cashFlowData.details.net_income)}
                        </td>
                      </tr>
                      <tr>
                        <td className="border p-2">Penyesuaian Operasional</td>
                        <td className="border p-2">
                          {formatRupiah(
                            cashFlowData.details.operating_adjustments
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td className="border p-2">Depresiasi</td>
                        <td className="border p-2">
                          {formatRupiah(cashFlowData.details.depreciation)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
