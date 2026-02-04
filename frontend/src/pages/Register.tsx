import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { authAPI } from '@/services/api'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Logo from '@/assets/apex-logo.png'

export default function Register() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')

  const registerMutation = useMutation({
    mutationFn: authAPI.register,
    onSuccess: () => {
      alert('Registration successful! Please login.')
      navigate('/login')
    },
    onError: (error: any) => {
      alert(error.response?.data?.detail || 'Registration failed')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    registerMutation.mutate({ email, password, full_name: fullName || undefined })
  }

  return (
    // bg-[#f4f4f4] matches the login screen background
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f4f4f4] p-4 font-sans">
      
      {/* Card Wrapper with Border and Shadow */}
      <div className="w-full max-w-[480px] bg-white border border-gray-300 rounded-[4px] shadow-sm overflow-hidden">
        
        {/* Branding Section */}
        <div className="flex flex-col items-center pt-10 pb-6">
          <img src={Logo} alt="Apex Systems" className="h-16 mb-6" />
          <div className="w-full h-[1px] bg-gray-200" />
        </div>

        <div className="px-12 pb-12">
          <h2 className="text-center text-[18px] text-[#555] mb-8 mt-4">Register</h2>
          
          <form onSubmit={handleSubmit}>
            {/* Full Name Field */}
            <div className="mb-5">
              <label className="block text-[15px] font-bold text-gray-800 mb-2">Full Name (Optional)</label>
              <Input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="h-11 border-gray-400 rounded-[4px] focus:border-blue-600 focus:ring-0 text-gray-700"
              />
            </div>

            {/* Email Field */}
            <div className="mb-5">
              <label className="block text-[15px] font-bold text-gray-800 mb-2">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11 border-gray-400 rounded-[4px] focus:border-blue-600 focus:ring-0 text-gray-700"
              />
            </div>

            {/* Password Field */}
            <div className="mb-10">
              <label className="block text-[15px] font-bold text-gray-800 mb-2">Password (min. 8 characters)</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="h-11 border-gray-400 rounded-[4px] focus:border-blue-600 focus:ring-0 text-gray-700"
              />
            </div>

            {/* Register Button */}
            <Button
              type="submit"
              disabled={registerMutation.isPending}
              className="w-full bg-[#1b66db] hover:bg-[#1557b8] text-white h-[50px] text-lg font-medium rounded-[4px] shadow-sm mb-6"
            >
              {registerMutation.isPending ? 'Creating account...' : 'Register'}
            </Button>
            <div className="flex flex-col space-y-3 text-[15px]">
              <Link to="/login" className="text-[#1b66db] hover:underline">
              {/* <Link to="/register" className="text-[#1b66db] hover:underline"> */}
                Login
              </Link>
            </div>

          </form>
        </div>
      </div>
    </div>
  )
}