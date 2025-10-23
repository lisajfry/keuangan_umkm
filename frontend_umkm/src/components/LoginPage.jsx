import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Lock, User } from 'lucide-react'
import umkmApi from '../api/umkmApi'

export default function LoginPage() {
  const [nib, setNib] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const res = await umkmApi.login({ nib, password })
      const token = res.data?.token
      if (!token) throw new Error('Token tidak diterima')
      localStorage.setItem('umkm_token', token)
      navigate('/dashboard')
    } catch (err) {
      console.error(err)
      setError(err.response?.data?.message || err.message || 'Login gagal')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-blue-50 to-white">
      <div className="bg-white/80 backdrop-blur-md shadow-lg rounded-2xl w-full max-w-md p-8 border border-blue-100 transition-transform duration-300 hover:scale-[1.01]">
        <h1 className="text-3xl font-bold text-blue-700 mb-2 text-center">Login UMKM</h1>
        <p className="text-gray-500 text-center mb-6 text-sm">
          Silakan masuk untuk mengakses dashboard UMKM Anda
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-2 mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={submit} className="space-y-5">
          {/* NIB */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">NIB</label>
            <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2 bg-white focus-within:ring-2 focus-within:ring-blue-300 transition">
              <User className="text-blue-400 w-5 h-5 mr-2" />
              <input
                type="text"
                value={nib}
                onChange={(e) => setNib(e.target.value)}
                placeholder="Masukkan NIB"
                className="w-full focus:outline-none text-gray-700 placeholder-gray-400"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2 bg-white focus-within:ring-2 focus-within:ring-blue-300 transition">
              <Lock className="text-blue-400 w-5 h-5 mr-2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password"
                className="w-full focus:outline-none text-gray-700 placeholder-gray-400"
                required
              />
            </div>
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg py-2.5 transition duration-300 shadow-md"
          >
            Masuk
          </button>
        </form>

        {/* Footer Links */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>
            Lupa password?{' '}
            <span className="text-blue-600 hover:underline cursor-pointer">Reset di sini</span>
          </p>
          <p className="mt-1">
            Belum punya akun?{' '}
            <Link to="/register" className="text-blue-600 hover:underline cursor-pointer">
              Daftar sekarang
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
