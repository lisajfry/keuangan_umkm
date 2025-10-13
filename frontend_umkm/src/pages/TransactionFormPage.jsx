import React from 'react'
import TransactionForm from '../components/TransactionForm'

export default function TransactionFormPage(){
  return (
    <div className="container">
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Tambah Transaksi</h2>
        <TransactionForm onSaved={() => { window.location.href = '/transactions' }} />
      </div>
    </div>
  )
}
