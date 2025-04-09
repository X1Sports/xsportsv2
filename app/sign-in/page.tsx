import { SignInForm } from "@/components/auth/sign-in-form"

export default function SignInPage() {
  return (
    <div className="container max-w-screen-xl mx-auto px-4 py-12 bg-background">
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <h1 className="text-3xl font-bold mb-8 text-center text-foreground">Welcome Back to X:1 Sports</h1>
        <SignInForm />
      </div>
    </div>
  )
}
