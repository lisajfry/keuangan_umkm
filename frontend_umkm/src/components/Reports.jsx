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
    value ? `Rp ${parseInt(value).toLocaleString("id-ID")}` : "-";

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto bg-white p-6 rounded-2xl shadow">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          Laporan Keuangan UMKM
        </h2>
        {message && (
          <p className="text-red-600 bg-red-100 p-3 rounded-lg mb-4">{message}</p>
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
          {/* Income Statement */}
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

              {incomeData.details && incomeData.details.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">Rincian Transaksi:</h4>
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border p-2 text-left">Tanggal</th>
                        <th className="border p-2 text-left">Akun</th>
                        <th className="border p-2 text-left">Jenis</th>
                        <th className="border p-2 text-left">Nominal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {incomeData.details.map((item, i) => (
                        <tr key={i} className="hover:bg-gray-50">
                          <td className="border p-2">{item.tanggal}</td>
                          <td className="border p-2">{item.akun}</td>
                          <td className="border p-2 capitalize">{item.jenis}</td>
                          <td className="border p-2">
                            {formatRupiah(item.nominal)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Retained Earnings */}
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

          {/* Balance Sheet */}
          {activeTab === "balance" && (
            <div>
              <h3 className="font-semibold text-lg mb-3">Laporan Neraca</h3>
              <div className="grid md:grid-cols-3 gap-4 bg-gray-50 rounded-xl p-4">
                <div>
                  <h4 className="font-semibold mb-2">Aset</h4>
                  {balanceData.assets?.map((a, i) => (
                    <p key={i}>
                      {a.nama}: {formatRupiah(a.nilai)}
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
                      {l.nama}: {formatRupiah(l.nilai)}
                    </p>
                  ))}
                  <p className="font-semibold mt-2">
                    Total Kewajiban: {formatRupiah(balanceData.total_liabilities)}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Ekuitas</h4>
                  {balanceData.equities?.map((e, i) => (
                    <p key={i}>
                      {e.nama}: {formatRupiah(e.nilai)}
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

          {/* Cash Flow */}
          {activeTab === "cashflow" && (
            <div>
              <h3 className="font-semibold text-lg mb-3">
                Laporan Arus Kas (Cash Flow)
              </h3>
              <div className="bg-gray-50 rounded-xl p-4">
                <p>Operasional: {formatRupiah(cashFlowData.operating)}</p>
                <p>Investasi: {formatRupiah(cashFlowData.investing)}</p>
                <p>Pendanaan: {formatRupiah(cashFlowData.financing)}</p>
                <p className="font-semibold mt-2">
                  Perubahan Kas: {formatRupiah(cashFlowData.net_change_in_cash)}
                </p>
              </div>

              {cashFlowData.details && cashFlowData.details.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">Rincian Transaksi Kas:</h4>
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border p-2 text-left">Tanggal</th>
                        <th className="border p-2 text-left">Akun</th>
                        <th className="border p-2 text-left">Jenis</th>
                        <th className="border p-2 text-left">Nominal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cashFlowData.details.map((item, i) => (
                        <tr key={i} className="hover:bg-gray-50">
                          <td className="border p-2">{item.tanggal}</td>
                          <td className="border p-2">{item.akun}</td>
                          <td className="border p-2 capitalize">{item.jenis}</td>
                          <td className="border p-2">
                            {formatRupiah(item.nominal)}
                          </td>
                        </tr>
                      ))}
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
