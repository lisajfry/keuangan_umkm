import React, { useState, useEffect } from "react";
import umkmApi from "../api/umkmApi"; // atau sesuaikan path ke file api.js kamu


const fmt = (value) => {
  if (value === null || value === undefined || value === "" || isNaN(value)) return "-";
  return Number(value).toLocaleString("id-ID");
};

const Section = ({ title, subtitle, color, children }) => (
  <div className="mb-10">
    <div className={`border-l-4 pl-3 mb-3 ${color} bg-gray-50 py-2 rounded`}>
      <h2 className="text-xl font-bold">{title}</h2>
      {subtitle && <p className="text-gray-500 text-sm">{subtitle}</p>}
    </div>
    {children}
  </div>
);

const Table = ({ headers, rows, footer }) => (
  <div className="overflow-x-auto shadow rounded-lg">
    <table className="w-full border-collapse border border-gray-300 text-sm">
      <thead className="bg-gradient-to-r from-blue-100 to-blue-200">
        <tr>
          {headers.map((h, i) => (
            <th key={i} className="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-800">
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows?.length > 0 ? (
          rows.map((row, i) => (
            <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
              {row.map((cell, j) => (
                <td key={j} className="border border-gray-300 px-3 py-1 text-gray-700">
                  {cell}
                </td>
              ))}
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={headers.length} className="text-center py-3 text-gray-500">
              Tidak ada data
            </td>
          </tr>
        )}
      </tbody>
      {footer && (
        <tfoot className="bg-gray-100 font-semibold">
          {footer.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j} className="border border-gray-300 px-3 py-2">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tfoot>
      )}
    </table>
  </div>
);

export default function ReportSummary() {
  const [report, setReport] = useState(null);
  const [month, setMonth] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchReport = async (selectedMonth = "") => {
  setLoading(true);
  try {
    const data = await umkmApi.getSummary({ month: selectedMonth }); // kirim full YYYY-MM
    setReport(data);
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};



const downloadExcel = async () => {
  try {
    const res = await umkmApi.downloadReportExcel(month); // kirim "YYYY-MM"
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const a = document.createElement("a");
    a.href = url;
    a.download = `Laporan_Keuangan_${month || "semua"}.xlsx`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  } catch (err) {
    console.error(err);
    alert("Gagal mengunduh file Excel.");
  }
};



  useEffect(() => {
    fetchReport();
  }, []);

  if (loading) return <p className="text-gray-600">Memuat laporan...</p>;
  if (!report) return <p className="text-gray-600">Tidak ada data laporan.</p>;

  const _income = report.income_statement || {};
  const retained = report.retained_earnings || {};
  const balance = report.balance_sheet || {};
  const cash = report.cash_flow || {};

  return (
    <div className="p-6 bg-white rounded-xl shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">📊 Ringkasan Laporan Keuangan</h1>
        <div className="flex gap-3">
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={() => fetchReport(month)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            🔍 Filter
          </button>
          <button
            onClick={downloadExcel}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
          >
            📥 Download Excel
          </button>
        </div>
      </div>

      {/* === LABA RUGI === */}
<Section
  title="Laporan Laba Rugi"
  subtitle="Menunjukkan total pendapatan, beban, dan laba bersih"
  color="border-blue-500"
>
  <Table
    headers={["Keterangan", "Debit", "Kredit"]}
    rows={
      report?.income_statement?.details
        ? report.income_statement.details.map((d) => [
            d.name,
            fmt(d.total_debit),
            fmt(d.total_credit),
          ])
        : []
    }
    footer={[
      ["Total Pendapatan", "", fmt(report?.income_statement?.revenue)],
      ["Total Beban", fmt(report?.income_statement?.expense), ""],
      ["Laba Bersih", "", fmt(report?.income_statement?.netIncome)],
    ]}
  />
</Section>

      {/* === LABA DITAHAN === */}
      <Section
        title="Laporan Laba Ditahan"
        subtitle="Menampilkan perubahan saldo laba perusahaan"
        color="border-green-500"
      >
        <Table
          headers={["Keterangan", "Nilai"]}
          rows={[
            ["Saldo Awal", fmt(retained.beginning)],
            ["Laba Bersih", fmt(retained.income)],
            ["Dividen", fmt(retained.dividends)],
          ]}
          footer={[["Saldo Akhir", fmt(retained.ending)]]}
        />
      </Section>

      {/* === NERACA === */}
      <Section
        title="Neraca (Balance Sheet)"
        subtitle="Perbandingan total aset dengan kewajiban dan ekuitas"
        color="border-purple-500"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-2 text-gray-700">💰 Aset</h3>
            <Table
              headers={["Nama Akun", "Saldo"]}
              rows={balance.asset?.map((a) => [a.name, fmt(a.balance)]) || []}
              footer={[["Total Aset", fmt(balance.total_assets)]]}
            />
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-gray-700">🏦 Kewajiban & Ekuitas</h3>
            <Table
              headers={["Nama Akun", "Saldo"]}
              rows={[
                ...(balance.liability?.map((l) => [l.name, fmt(l.balance)]) || []),
                ...(balance.equity?.map((e) => [e.name, fmt(e.balance)]) || []),
              ]}
              footer={[
                ["Total Kewajiban + Ekuitas", fmt((balance.total_liabilities || 0) + (balance.total_equity || 0))],
              ]}
            />
          </div>
        </div>

        <div className="mt-4 text-right font-semibold">
          Status Neraca:{" "}
          <span
            className={`${
              balance.balanced ? "text-green-600" : "text-red-600"
            }`}
          >
            {balance.balanced ? "BALANCE ✅" : "TIDAK BALANCE ❌"}
          </span>
        </div>
      </Section>

      {/* === ARUS KAS === */}
      <Section
        title="Laporan Arus Kas"
        subtitle="Menunjukkan aliran kas dari aktivitas operasi, investasi, dan pendanaan"
        color="border-orange-500"
      >
        <Table
          headers={["Aktivitas", "Nilai"]}
          rows={[
            ["Arus Kas Operasi", fmt(cash.operating)],
            ["Arus Kas Investasi", fmt(cash.investing)],
            ["Arus Kas Pendanaan", fmt(cash.financing)],
          ]}
          footer={[["Kenaikan Bersih Kas", fmt(cash.net)]]}
        />
      </Section>
    </div>
  );
}
