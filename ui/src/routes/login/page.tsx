import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { LoginForm } from './login-form'

import { Logo } from '@/components'
import { useAuth } from '@/context'
import { LoginFormValues, loginSchema } from '@/types'

const LoginPage = () => {
  const { login, loginWithGoogle, loading } = useAuth()
  const navigate = useNavigate()
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const handleLogin = async (values: LoginFormValues) => {
    try {
      await login(values.email, values.password)
      navigate('/app/dashboard')
    } catch (error) {
      form.setError('root', {
        message: error instanceof Error ? error.message : 'Login failed. Please try again.',
      })
    }
  }

  const handleGoogleLogin = async () => {
    try {
      setIsGoogleLoading(true)
      await loginWithGoogle()
      navigate('/app/dashboard')
    } catch (error) {
      form.setError('root', {
        message: error instanceof Error ? error.message : 'Google login failed. Please try again.',
      })
    } finally {
      setIsGoogleLoading(false)
    }
  }

  return (
    <div className="flex flex-col justify-center w-full h-full p-6 md:p-8">
      <div className="flex flex-col gap-4">
        <Logo size="xl" className="p-2" />
        <div className="flex flex-col items-center text-center">
          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="text-balance text-muted-foreground">Login to your account</p>
        </div>
        <LoginForm
          form={form}
          onSubmit={handleLogin}
          onGoogleLogin={handleGoogleLogin}
          isLoading={loading}
          isGoogleLoading={isGoogleLoading}
        />
      </div>
    </div>
  )
}

export default LoginPage
