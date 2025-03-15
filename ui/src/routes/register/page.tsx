import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useNavigate, Link } from 'react-router-dom'
import * as z from 'zod'

import { Logo } from '@/components'
import {
  Button,
  Input,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui'
import { useAuth } from '@/context'

const registerSchema = z
  .object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

type RegisterFormValues = z.infer<typeof registerSchema>

const RegisterPage = () => {
  const { register } = useAuth()
  const navigate = useNavigate()

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = async (values: RegisterFormValues) => {
    try {
      await register(values.email, values.password)
      navigate('/app/dashboard')
    } catch (error) {
      form.setError('root', {
        message: error instanceof Error ? error.message : 'Registration failed. Please try again.',
      })
    }
  }

  return (
    <Form {...form}>
      <form
        className="flex flex-col justify-center h-full w-full p-6 md:p-8"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="flex flex-col gap-4">
          <Logo size="xl" className="p-2" />
          <div className="flex flex-col items-center text-center">
            <h1 className="text-2xl font-bold">Create an account</h1>
            <p className="text-balance text-muted-foreground">
              Enter your details below to register
            </p>
          </div>
          <div className="flex flex-col gap-3 w-full">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="johndoe@example.com" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="••••••••••" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input placeholder="••••••••••" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {form.formState.errors.root && (
            <span className="text-[0.8rem] font-medium text-destructive">
              {form.formState.errors.root.message}
            </span>
          )}
          <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Account
              </>
            ) : (
              'Create Account'
            )}
          </Button>
          <div className="text-center text-sm">
            Already have an account?{' '}
            <Link to="/login" className="underline underline-offset-4">
              Login
            </Link>
          </div>
        </div>
      </form>
    </Form>
  )
}

export default RegisterPage
