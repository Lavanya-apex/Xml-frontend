// import { useState } from 'react'
// import { useMutation, useQueryClient } from '@tanstack/react-query'
// import { useAuthStore } from '@/store/authStore'
// import { userAPI } from '@/services/api'
// import Button from '@/components/ui/Button'
// import Input from '@/components/ui/Input'
// import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'

// export default function Profile() {
//   const { user, setUser } = useAuthStore()
//   const queryClient = useQueryClient()
  
//   const [fullName, setFullName] = useState(user?.full_name || '')
//   const [email, setEmail] = useState(user?.email || '')
//   const [currentPassword, setCurrentPassword] = useState('')
//   const [newPassword, setNewPassword] = useState('')

//   const updateProfileMutation = useMutation({
//     mutationFn: userAPI.updateProfile,
//     onSuccess: (data) => {
//       setUser(data)
//       alert('Profile updated successfully!')
//     },
//     onError: (error: any) => {
//       alert(error.response?.data?.detail || 'Failed to update profile')
//     },
//   })

//   const changePasswordMutation = useMutation({
//     mutationFn: ({ current, newPass }: { current: string; newPass: string }) =>
//       userAPI.changePassword(current, newPass),
//     onSuccess: () => {
//       alert('Password changed successfully!')
//       setCurrentPassword('')
//       setNewPassword('')
//     },
//     onError: (error: any) => {
//       alert(error.response?.data?.detail || 'Failed to change password')
//     },
//   })

//   const handleUpdateProfile = (e: React.FormEvent) => {
//     e.preventDefault()
//     updateProfileMutation.mutate({ full_name: fullName, email })
//   }

//   const handleChangePassword = (e: React.FormEvent) => {
//     e.preventDefault()
//     if (newPassword.length < 8) {
//       alert('Password must be at least 8 characters')
//       return
//     }
//     changePasswordMutation.mutate({ current: currentPassword, newPass: newPassword })
//   }

//   return (
//     <div className="max-w-2xl mx-auto space-y-6">
//       <h1 className="text-3xl font-bold">Profile</h1>

//       <Card>
//         <CardHeader>
//           <CardTitle>Update Profile</CardTitle>
//           {/* <CardDescription>Manage your account information</CardDescription> */}
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleUpdateProfile} className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium mb-2">Full Name</label>
//               <Input
//                 type="text"
//                 value={fullName}
//                 onChange={(e) => setFullName(e.target.value)}
//                 // placeholder="Enter your full name"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium mb-2">Email</label>
//               <Input
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//               />
//             </div>
            
//             <Button type="submit" disabled={updateProfileMutation.isPending}>
//               {updateProfileMutation.isPending ? 'Updating...' : 'Update Profile'}
              
//             </Button>
//           </form>
//         </CardContent>
//       </Card>

//       <Card>
//         <CardHeader>
//           <CardTitle>Change Password</CardTitle>
//           {/* <CardDescription>Update your password</CardDescription> */}
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleChangePassword} className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium mb-2">Current Password</label>
//               <Input
//                 type="password"
//                 value={currentPassword}
//                 onChange={(e) => setCurrentPassword(e.target.value)}
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium mb-2">New Password</label>
//               <Input
//                 type="password"
//                 value={newPassword}
//                 onChange={(e) => setNewPassword(e.target.value)}
//                 required
//                 minLength={8}
//               />
//             </div>
//             <Button type="submit" disabled={changePasswordMutation.isPending}>
//               {changePasswordMutation.isPending ? 'Changing...' : 'Change Password'}
              
//             </Button>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }

import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/store/authStore'
import { userAPI } from '@/services/api'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'

export default function Profile() {
  const { user, setUser } = useAuthStore()
  const queryClient = useQueryClient()
  
  const [fullName, setFullName] = useState(user?.full_name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')

  const updateProfileMutation = useMutation({
    mutationFn: userAPI.updateProfile,
    onSuccess: (data) => {
      setUser(data)
      alert('Profile updated successfully!')
    },
    onError: (error: any) => {
      alert(error.response?.data?.detail || 'Failed to update profile')
    },
  })

  const changePasswordMutation = useMutation({
    mutationFn: ({ current, newPass }: { current: string; newPass: string }) =>
      userAPI.changePassword(current, newPass),
    onSuccess: () => {
      alert('Password changed successfully!')
      setCurrentPassword('')
      setNewPassword('')
    },
    onError: (error: any) => {
      alert(error.response?.data?.detail || 'Failed to change password')
    },
  })

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault()
    updateProfileMutation.mutate({ full_name: fullName, email })
  }

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword.length < 8) {
      alert('Password must be at least 8 characters')
      return
    }
    changePasswordMutation.mutate({ current: currentPassword, newPass: newPassword })
  }

  // Define the sidebar color constant for easy reuse
  const sidebarColorClass = "bg-[#333c4d] hover:bg-[#3d485c] text-white transition-colors"

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Profile</h1>

      <Card>
        <CardHeader>
          <CardTitle>Update Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Full Name</label>
              <Input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <Button 
              type="submit" 
              disabled={updateProfileMutation.isPending}
              className={sidebarColorClass}
            >
              {updateProfileMutation.isPending ? 'Updating...' : 'Update Profile'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Current Password</label>
              <Input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">New Password</label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={8}
              />
            </div>
            <Button 
              type="submit" 
              disabled={changePasswordMutation.isPending}
              className={sidebarColorClass}
            >
              {changePasswordMutation.isPending ? 'Changing...' : 'Change Password'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}