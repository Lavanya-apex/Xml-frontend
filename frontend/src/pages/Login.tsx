// import { useState } from 'react'
// import { useNavigate, Link } from 'react-router-dom'
// import { useMutation } from '@tanstack/react-query'
// import { authAPI } from '@/services/api'
// import { useAuthStore } from '@/store/authStore'
// import Button from '@/components/ui/Button'
// import Input from '@/components/ui/Input'
// import Logo from '@/assets/apex-logo.png' 

// export default function Login() {
//   const navigate = useNavigate()
//   const setUser = useAuthStore((state) => state.setUser)
  
//   // Keep this as 'email' to match your working backend logic
//   const [email, setEmail] = useState('') 
//   const [password, setPassword] = useState('')

//   const loginMutation = useMutation({
//     mutationFn: authAPI.login,
//     onSuccess: async (data) => {
//       localStorage.setItem('access_token', data.access_token)
//       localStorage.setItem('refresh_token', data.refresh_token)
      
//       const user = await authAPI.getCurrentUser()
//       setUser(user)
//       navigate('/dashboard')
//     },
//     onError: (error: any) => {
//       // Improved error alert to see the exact message from backend
//       alert(error.response?.data?.detail || 'Login failed. Please check your credentials.')
//     },
//   })

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault()
//     // Sending { email, password } to match your original working code
//     loginMutation.mutate({ email, password })
//   }

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4 font-sans">
//       {/* Logo Section */}
//       <div className="w-full max-w-[450px] flex flex-col items-center mb-6">
//         <img src={Logo} alt="Apex Systems" className="h-20 mb-4" />
//         <div className="w-full h-[1px] bg-gray-200 mb-8" />
//         <h2 className="text-xl font-semibold text-[#444] mb-8">Sign In</h2>
//       </div>

//       <div className="w-full max-w-[360px]">
//         <form onSubmit={handleSubmit}>
          
//           {/* Email/Username Field */}
//           <div className="mb-5">
//             <label className="block text-[15px] font-bold text-gray-800 mb-2">Username</label>
//             <Input
//               type="text" 
//               // placeholder="name@email.com"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="h-12 border-gray-400 rounded-[4px] focus:border-blue-600 focus:ring-0 text-gray-700"
//               required
//             />
//           </div>

//           {/* Password Field */}
//           <div className="mb-2">
//             <label className="block text-[15px] font-bold text-gray-800 mb-2">Password</label>
//             <div className="relative">
//               <Input
//                 type="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className="h-12 border-gray-400 rounded-[4px] focus:border-blue-600 focus:ring-0"
//                 required
//               />
//             </div>
            
//             {/* Conditional Error Message (Optional: shows when mutation fails) */}
//             {loginMutation.isError && (
//                <p className="flex items-center mt-3 text-[14px] text-[#d93025]">
//                <span className="mr-2 flex items-center justify-center bg-[#d93025] text-white rounded-full w-[18px] h-[18px] text-[12px] font-bold">!</span>
//                Invalid username or password
//              </p>
//             )}
//           </div>

//           {/* Sign In Button */}
//           <Button
//             type="submit"
//             disabled={loginMutation.isPending}
//             className="w-full bg-[#1b66db] mt-6 hover:bg-[#1557b8] text-white h-[52px] text-lg font-medium rounded-[4px] shadow-sm mb-6"
//           >
//             {loginMutation.isPending ? 'Signing in...' : 'Sign in'}
//           </Button>

//           {/* Register Link */}
//           <p className="text-center text-[15px] text-gray-600">
//             New user?{' '}
//             <Link to="/register" className="text-[#1b66db] font-semibold hover:underline">
//               Register here
//             </Link>
//           </p>
//         </form>
//       </div>
//     </div>
//   )
// }

import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { authAPI } from '@/services/api'
import { useAuthStore } from '@/store/authStore'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Logo from '@/assets/apex-logo.png' 

export default function Login() {
  const navigate = useNavigate()
  const setUser = useAuthStore((state) => state.setUser)
  
  const [email, setEmail] = useState('') 
  const [password, setPassword] = useState('')
  const [keepSignedIn, setKeepSignedIn] = useState(false)

  const loginMutation = useMutation({
    mutationFn: authAPI.login,
    onSuccess: async (data) => {
      localStorage.setItem('access_token', data.access_token)
      localStorage.setItem('refresh_token', data.refresh_token)
      const user = await authAPI.getCurrentUser()
      setUser(user)
      navigate('/dashboard')
    },
    onError: (error: any) => {
      // Logic for error display
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    loginMutation.mutate({ email, password })
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f4f4f4] p-4 font-sans">
      {/* This div creates the white card with the border you wanted */}
      <div className="w-full max-w-[480px] bg-white border border-gray-300 rounded-[4px] shadow-sm overflow-hidden">
        
        {/* Logo Section */}
        <div className="flex flex-col items-center pt-10 pb-6">
          <img src={Logo} alt="Apex Systems" className="h-16 mb-6" />
          <div className="w-full h-[1px] bg-gray-200" />
        </div>

        <div className="px-12 pb-12">
          <h2 className="text-center text-[18px] text-[#555] mb-10 mt-4">Sign In</h2>
          
          <form onSubmit={handleSubmit}>
            {/* Email/Username Field */}
            <div className="mb-6">
              <label className="block text-[15px] font-bold text-gray-800 mb-2">Username</label>
              <Input
                type="text" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 border-gray-400 rounded-[4px] focus:border-blue-600 focus:ring-0 text-gray-700"
                required
              />
            </div>

            {/* Password Field */}
            <div className="mb-4">
              <label className="block text-[15px] font-bold text-gray-800 mb-2">Password</label>
              <div className="relative">
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 border-gray-400 rounded-[4px] focus:border-blue-600 focus:ring-0"
                  required
                />
              </div>
              
              {loginMutation.isError && (
                 <p className="flex items-center mt-3 text-[14px] text-[#d93025]">
                   <span className="mr-2 flex items-center justify-center bg-[#d93025] text-white rounded-full w-[18px] h-[18px] text-[12px] font-bold">!</span>
                   Invalid username or password
                 </p>
              )}
            </div>

            {/* Sign In Button */}
            <Button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full bg-[#1b66db] hover:bg-[#1557b8] text-white h-[50px] text-lg font-medium rounded-[4px] shadow-sm mb-8"
            >
              Sign in
            </Button>

            {/* Footer Links from Screenshot */}
            <div className="flex flex-col space-y-3 text-[15px]">
              <Link to="/register" className="text-[#1b66db] hover:underline">
                Register here
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}