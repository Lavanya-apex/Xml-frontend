// import { useAuthStore } from '@/store/authStore'
// import { useNavigate } from 'react-router-dom'

// export default function Header() {
//   const { user } = useAuthStore()
//   const navigate = useNavigate()

//   const handleLogout = () => {
//     navigate('/login')
//   }

//   // Changed bg-card to bg-[#333c4d] and added text-white
//   return (
//     <header className="h-16 border-b border-white/10 bg-[#333c4d] text-white flex items-center justify-between px-6">
//       <div>
//         <h2 className="text-lg font-semibold">Welcome back{user?.full_name ? `, ${user.full_name}` : ''}!</h2>
//         <p className="text-sm text-blue-100/70">{user?.email}</p>
//       </div>
//     </header>
//   )
// }


import { useAuthStore } from '@/store/authStore'
import { useNavigate } from 'react-router-dom'
// Import the logo from your assets folder
import headerLogo from '@/assets/headerlogo.png' 

export default function Header() {
  const { user } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    navigate('/login')
  }

  return (
    <header className="h-20 border-b border-white/10 bg-[#333c4d] text-white flex items-center justify-between px-6">
      {/* Left side: User Info */}
      <div>
        <h2 className="text-xl font-semibold">
          Welcome back{user?.full_name ? `, ${user.full_name}` : ''}!
        </h2>
        <p className="text-sm text-blue-100/70">{user?.email}</p>
      </div>

      {/* Right side: Logo */}
      <div className="flex items-center">
        <img 
          src={headerLogo} 
          alt="Header Logo" 
          className="h-12 w-auto object-contain" 
        />
      </div>
    </header>
  )
}