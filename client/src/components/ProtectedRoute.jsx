import { Protect, SignIn } from '@clerk/clerk-react'
import { useAuth } from '@clerk/clerk-react'

export default function ProtectPage({children}) {
  const {isSignedIn} = useAuth()
  return (
    <Protect
      condition={isSignedIn}
      fallback={<SignIn/>}
    >
      {children}
    </Protect>
  )
}