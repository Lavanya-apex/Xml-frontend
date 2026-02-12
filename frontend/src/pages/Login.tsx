
// // import { useState } from 'react'
// // import { useNavigate, Link } from 'react-router-dom'
// // import { useMutation } from '@tanstack/react-query'
// // // import { authAPI } from '@/services/api'
// // import { useAuthStore } from '@/store/authStore'
// // import Button from '@/components/ui/Button'
// // import Input from '@/components/ui/Input'
// // import Logo from '@/assets/apex-logo.png' 


// // export default function Login() {
// //   const navigate = useNavigate()
// //   const setUser = useAuthStore((state) => state.setUser)
  
// //   const [username, setUsername] = useState('') 
// //   const [password, setPassword] = useState('')

// //   const loginMutation = useMutation({
// //     mutationFn: authAPI.login,
// //     onSuccess: async (tokenData) => {
// //       console.log("Login response:", tokenData);

// //       // 1. Save token with correct key used by your API interceptors
// //       // Based on your requirement: localStorage.setItem('access_token', tokenData.access_token)
// //       localStorage.setItem('access_token', tokenData.access_token);
      
// //       // 2. Set user if provided in response
// //       if (tokenData.user) {
// //         setUser(tokenData.user);
// //         navigate('/dashboard');
// //       } else {
// //         // 3. Otherwise fetch the user details to populate global state
// //         try {
// //           const user = await authAPI.getCurrentUser();
// //           if (user) {
// //             setUser(user);
// //             navigate('/dashboard');
// //           }
// //         } catch (error) {
// //           console.error("Failed to fetch user profile after login:", error);
// //           // Fallback: Still navigate to dashboard if the token exists
// //           navigate('/dashboard');
// //         }
// //       }
// //     },
// //     onError: (error: any) => {
// //       console.error("Login Error:", error);
// //       console.error("Error response:", error.response?.data);
// //     },
// //   })

// //   const handleSubmit = (e: React.FormEvent) => {
// //     e.preventDefault()
// //     loginMutation.mutate({ username, password })
// //   }

// //   return (
// //     <div className="min-h-screen flex flex-col items-center justify-center bg-[#f4f4f4] p-4 font-sans">
// //       <div className="w-full max-w-[480px] bg-white border border-gray-300 rounded-[4px] shadow-sm overflow-hidden">
        
// //         {/* Logo Section */}
// //         <div className="flex flex-col items-center pt-10 pb-6">
// //           <img src={Logo} alt="Apex Systems" className="h-16 mb-6" />
// //           <div className="w-full h-[1px] bg-gray-200" />
// //         </div>

// //         <div className="px-12 pb-12">
// //           <h2 className="text-center text-[18px] text-[#555] mb-10 mt-4">Sign In</h2>
          
// //           <form onSubmit={handleSubmit}>
// //             {/* Username Field */}
// //             <div className="mb-6">
// //               <label className="block text-[15px] font-bold text-gray-800 mb-2">Username</label>
// //               <Input
// //                 type="text" 
// //                 value={username}
// //                 onChange={(e) => setUsername(e.target.value)}
// //                 className="h-11 border-gray-400 rounded-[4px] focus:border-blue-600 focus:ring-0 text-gray-700"
// //                 required
// //               />
// //             </div>

// //             {/* Password Field */}
// //             <div className="mb-4">
// //               <label className="block text-[15px] font-bold text-gray-800 mb-2">Password</label>
// //               <div className="relative">
// //                 <Input
// //                   type="password"
// //                   value={password}
// //                   onChange={(e) => setPassword(e.target.value)}
// //                   className="h-11 border-gray-400 rounded-[4px] focus:border-blue-600 focus:ring-0"
// //                   required
// //                 />
// //               </div>
              
// //               {loginMutation.isError && (
// //                  <p className="flex items-center mt-3 text-[14px] text-[#d93025]">
// //                    <span className="mr-2 flex items-center justify-center bg-[#d93025] text-white rounded-full w-[18px] h-[18px] text-[12px] font-bold">!</span>
// //                    Invalid username or password
// //                  </p>
// //               )}
// //             </div>

// //             {/* Sign In Button */}
// //             <Button
// //               type="submit"
// //               disabled={loginMutation.isPending}
// //               className="w-full bg-[#1b66db] hover:bg-[#1557b8] text-white h-[50px] text-lg font-medium rounded-[4px] shadow-sm mb-8"
// //             >
// //               {loginMutation.isPending ? 'Signing in...' : 'Sign in'}
// //             </Button>

// //             {/* Footer Links */}
// //             <div className="flex flex-col space-y-3 text-[15px]">
// //               <Link to="/register" className="text-[#1b66db] hover:underline">
// //                 Register here
// //               </Link>
// //             </div>
// //           </form>
// //         </div>
// //       </div>
// //     </div>
// //   )
// // }

// import { useState } from 'react'
// import { useNavigate, Link } from 'react-router-dom'
// import { useMutation } from '@tanstack/react-query'
// import { authAPI } from '@/services/api'  // ✅ UNCOMMENT THIS LINE
// import { useAuthStore } from '@/store/authStore'
// import Button from '@/components/ui/Button'
// import Input from '@/components/ui/Input'
// import Logo from '@/assets/apex-logo.png' 

// export default function Login() {
//   const navigate = useNavigate()
//   const setUser = useAuthStore((state) => state.setUser)
  
//   const [username, setUsername] = useState('') 
//   const [password, setPassword] = useState('')

//   const loginMutation = useMutation({
//     mutationFn: authAPI.login,
//     onSuccess: async (tokenData) => {
//       console.log("Login response:", tokenData);
//       localStorage.setItem('access_token', tokenData.access_token);
      
//       if (tokenData.user) {
//         setUser(tokenData.user);
//         navigate('/dashboard');
//       } else {
//         try {
//           const user = await authAPI.getCurrentUser();
//           if (user) {
//             setUser(user);
//             navigate('/dashboard');
//           }
//         } catch (error) {
//           console.error("Failed to fetch user profile after login:", error);
//           navigate('/dashboard');
//         }
//       }
//     },
//     onError: (error: any) => {
//       console.error("Login Error:", error);
//     },
//   })

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault()
//     loginMutation.mutate({ username, password })
//   }

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-[#f4f4f4] p-4 font-sans">
//       <div className="w-full max-w-[480px] bg-white border border-gray-300 rounded-[4px] shadow-sm overflow-hidden">
        
//         <div className="flex flex-col items-center pt-10 pb-6">
//           <img src={Logo} alt="Apex Systems" className="h-16 mb-6" />
//           <div className="w-full h-[1px] bg-gray-200" />
//         </div>

//         <div className="px-12 pb-12">
//           <h2 className="text-center text-[18px] text-[#555] mb-10 mt-4">Sign In</h2>
          
//           <form onSubmit={handleSubmit}>
//             <div className="mb-6">
//               <label className="block text-[15px] font-bold text-gray-800 mb-2">Username</label>
//               <Input
//                 type="text" 
//                 value={username}
//                 onChange={(e) => setUsername(e.target.value)}
//                 className="h-11 border-gray-400 rounded-[4px] focus:border-blue-600 focus:ring-0 text-gray-700"
//                 required
//               />
//             </div>

//             <div className="mb-4">
//               <label className="block text-[15px] font-bold text-gray-800 mb-2">Password</label>
//               <Input
//                 type="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className="h-11 border-gray-400 rounded-[4px] focus:border-blue-600 focus:ring-0"
//                 required
//               />
              
//               {loginMutation.isError && (
//                 <p className="flex items-center mt-3 text-[14px] text-[#d93025]">
//                   <span className="mr-2 flex items-center justify-center bg-[#d93025] text-white rounded-full w-[18px] h-[18px] text-[12px] font-bold">!</span>
//                   Invalid username or password
//                 </p>
//               )}
//             </div>

//             <Button
//               type="submit"
//               disabled={loginMutation.isPending}
//               className="w-full bg-[#1b66db] hover:bg-[#1557b8] text-white h-[50px] text-lg font-medium rounded-[4px] shadow-sm mb-8"
//             >
//               {loginMutation.isPending ? 'Signing in...' : 'Sign in'}
//             </Button>

//             <div className="flex flex-col space-y-3 text-[15px]">
//               <Link to="/register" className="text-[#1b66db] hover:underline">
//                 Register here
//               </Link>
//             </div>
//           </form>
//         </div>
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
  
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('')

  const loginMutation = useMutation({
    mutationFn: authAPI.login,
    onSuccess: async (tokenData) => {
      console.log("Login response:", tokenData);
      localStorage.setItem('access_token', tokenData.access_token);
      
      if (tokenData.user) {
        setUser(tokenData.user);
        navigate('/dashboard');
      } else {
        try {
          const user = await authAPI.getCurrentUser();
          if (user) {
            setUser(user);
            navigate('/dashboard');
          }
        } catch (error) {
          console.error("Failed to fetch user profile after login:", error);
          navigate('/dashboard');
        }
      }
    },
    onError: (error: any) => {
      console.error("Login Error:", error);
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    loginMutation.mutate({ username, password })
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f4f4f4] p-4 font-sans">
      <div className="w-full max-w-[480px] bg-white border border-gray-300 rounded-[4px] shadow-sm overflow-hidden">
        
        <div className="flex flex-col items-center pt-10 pb-6">
          <img src={Logo} alt="Apex Systems" className="h-16 mb-6" />
          <div className="w-full h-[1px] bg-gray-200" />
        </div>

        <div className="px-12 pb-12">
          <h2 className="text-center text-[18px] text-[#555] mb-10 mt-4">Sign In</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-[15px] font-bold text-gray-800 mb-2">Username</label>
              <Input
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="h-11 border-gray-400 rounded-[4px] focus:border-blue-600 focus:ring-0 text-gray-700"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-[15px] font-bold text-gray-800 mb-2">Password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11 border-gray-400 rounded-[4px] focus:border-blue-600 focus:ring-0"
                required
              />
              
              {loginMutation.isError && (
                <p className="flex items-center mt-3 text-[14px] text-[#d93025]">
                  <span className="mr-2 flex items-center justify-center bg-[#d93025] text-white rounded-full w-[18px] h-[18px] text-[12px] font-bold">!</span>
                  Invalid username or password
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full bg-[#1b66db] hover:bg-[#1557b8] text-white h-[50px] text-lg font-medium rounded-[4px] shadow-sm mb-8"
            >
              {loginMutation.isPending ? 'Signing in...' : 'Sign in'}
            </Button>

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