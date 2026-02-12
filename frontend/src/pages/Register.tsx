import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { authAPI } from '@/services/api'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Logo from '@/assets/apex-logo.png'
import { CheckCircle, XCircle, X } from 'lucide-react'

interface ModalState {
  isOpen: boolean
  title: string
  message: string
  type: 'success' | 'error'
}

export default function Register() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [username, setUsername] = useState('') // Added to match your FastAPI logic

  const [modal, setModal] = useState<ModalState>({
    isOpen: false,
    title: '',
    message: '',
    type: 'success',
  })

  const registerMutation = useMutation({
    mutationFn: authAPI.register,
    onSuccess: (response) => {
      setModal({
        isOpen: true,
        title: 'Registration Successful',
        message: 'Your account has been created successfully! Please login.',
        type: 'success',
      })
    },
    onError: (error: any) => {
      // ✅ Proper message: Extracts the specific detail from FastAPI (e.g., "Username already taken")
      const errorMessage = error.response?.data?.detail || 'Registration failed. Please try again.'
      setModal({
        isOpen: true,
        title: 'Registration Failed',
        message: errorMessage,
        type: 'error',
      })
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Matching your backend: name, username, email, password
    registerMutation.mutate({ 
      email, 
      password, 
      username,
      name: fullName 
    })
  }

  const handleModalClose = () => {
    setModal({ ...modal, isOpen: false })
    if (modal.type === 'success') {
      navigate('/login')
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f4f4f4] p-4 font-sans text-[#333]">
      
      {/* Dynamic Modal */}
      {modal.isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden">
            <div className={`px-6 py-4 flex items-center justify-between ${modal.type === 'success' ? 'bg-emerald-500' : 'bg-[#ef4444]'}`}>
              <div className="flex items-center gap-3">
                {modal.type === 'success' ? <CheckCircle className="text-white" /> : <XCircle className="text-white" />}
                <h3 className="text-lg font-semibold text-white">{modal.title}</h3>
              </div>
              <button onClick={handleModalClose} className="text-white/80 hover:text-white"><X size={20}/></button>
            </div>
            <div className="p-8 text-gray-700 text-[16px]">{modal.message}</div>
            <div className="px-6 py-4 bg-gray-50 flex justify-end">
              {/* ✅ OK Button color changed to match Sign In blue */}
              <button 
                onClick={handleModalClose} 
                className="bg-[#1b66db] text-white px-8 py-2 rounded font-bold hover:bg-[#1557b8] transition-colors"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Card Wrapper */}
      <div className="w-full max-w-[480px] bg-white border border-gray-300 rounded-[4px] shadow-sm overflow-hidden">
        
        {/* Branding Section */}
        <div className="flex flex-col items-center pt-10 pb-6">
          <img src={Logo} alt="Apex Systems" className="h-16 mb-6" />
          <div className="w-full h-[1px] bg-gray-200" />
        </div>

        <div className="px-12 pb-12">
          <h2 className="text-center text-[18px] text-[#555] mb-8 mt-4">Register</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label className="block text-[15px] font-bold text-gray-800 mb-2">Username</label>
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="h-11 border-gray-400 rounded-[4px] focus:border-blue-600 focus:ring-0"
              />
            </div>

            <div className="mb-5">
              <label className="block text-[15px] font-bold text-gray-800 mb-2">Full Name</label>
              <Input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="h-11 border-gray-400 rounded-[4px] focus:border-blue-600 focus:ring-0"
              />
            </div>

            <div className="mb-5">
              <label className="block text-[15px] font-bold text-gray-800 mb-2">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11 border-gray-400 rounded-[4px] focus:border-blue-600 focus:ring-0"
              />
            </div>

            <div className="mb-10">
              <label className="block text-[15px] font-bold text-gray-800 mb-2">Password (min. 8 characters)</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="h-11 border-gray-400 rounded-[4px] focus:border-blue-600 focus:ring-0"
              />
            </div>

            <Button
              type="submit"
              disabled={registerMutation.isPending}
              className="w-full bg-[#1b66db] hover:bg-[#1557b8] text-white h-[50px] text-lg font-medium rounded-[4px] shadow-sm mb-6"
            >
              {registerMutation.isPending ? 'Creating account...' : 'Register'}
            </Button>
            
            <div className="text-center text-[15px]">
              <span className="text-gray-600">Already have an account? </span>
              <Link to="/login" className="text-[#1b66db] font-bold hover:underline">
                Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}