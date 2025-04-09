"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/firebase-context"
import { AuthGuard } from "@/components/auth/auth-guard"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import { Loader2, AlertCircle, Check } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function AccountSettingsPage() {
  const { user, getLinkedProviders, linkGoogleAccount, unlinkGoogleAccount, sendVerificationEmail } = useAuth()

  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const isGoogleLinked = getLinkedProviders().includes("google.com")

  const handleLinkGoogle = async () => {
    setLoading("google")
    setError(null)
    setSuccess(null)

    try {
      await linkGoogleAccount()
      setSuccess("Successfully linked your Google account.")
      toast({
        title: "Success",
        description: "Google account linked successfully.",
      })
    } catch (err: any) {
      setError(err.message || "Failed to link Google account.")
      toast({
        title: "Error",
        description: err.message || "Failed to link Google account.",
        variant: "destructive",
      })
    } finally {
      setLoading(null)
    }
  }

  const handleUnlinkGoogle = async () => {
    setLoading("google")
    setError(null)
    setSuccess(null)

    try {
      await unlinkGoogleAccount()
      setSuccess("Successfully unlinked your Google account.")
      toast({
        title: "Success",
        description: "Google account unlinked successfully.",
      })
    } catch (err: any) {
      setError(err.message || "Failed to unlink Google account.")
      toast({
        title: "Error",
        description: err.message || "Failed to unlink Google account.",
        variant: "destructive",
      })
    } finally {
      setLoading(null)
    }
  }

  const handleSendVerificationEmail = async () => {
    setLoading("verification")
    setError(null)
    setSuccess(null)

    try {
      await sendVerificationEmail()
      setSuccess("Verification email sent successfully.")
      toast({
        title: "Success",
        description: "Verification email sent. Please check your inbox.",
      })
    } catch (err: any) {
      setError(err.message || "Failed to send verification email.")
      toast({
        title: "Error",
        description: err.message || "Failed to send verification email.",
        variant: "destructive",
      })
    } finally {
      setLoading(null)
    }
  }

  return (
    <AuthGuard>
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Account Settings</h1>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid grid-cols-3 gap-2 bg-transparent h-auto p-0">
            <TabsTrigger
              value="general"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg py-2.5"
            >
              General
            </TabsTrigger>
            <TabsTrigger
              value="security"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg py-2.5"
            >
              Security
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg py-2.5"
            >
              Notifications
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>Manage your account preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="dark-mode">Dark Mode</Label>
                      <p className="text-sm text-muted-foreground">Enable dark mode for the application</p>
                    </div>
                    <Switch id="dark-mode" />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="language">Language</Label>
                      <p className="text-sm text-muted-foreground">Choose your preferred language</p>
                    </div>
                    <div className="text-sm">English (US)</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="timezone">Timezone</Label>
                      <p className="text-sm text-muted-foreground">Set your local timezone</p>
                    </div>
                    <div className="text-sm">Eastern Time (ET)</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Email Verification</CardTitle>
                  <CardDescription>Verify your email address for account security</CardDescription>
                </CardHeader>
                <CardContent>
                  {user?.emailVerified ? (
                    <div className="flex items-center space-x-2 text-green-600">
                      <Check className="h-5 w-5" />
                      <span>Your email is verified</span>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2 text-amber-600">
                        <AlertCircle className="h-5 w-5" />
                        <span>Your email is not verified</span>
                      </div>
                      <Button onClick={handleSendVerificationEmail} disabled={loading === "verification"}>
                        {loading === "verification" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Send Verification Email
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Connected Accounts</CardTitle>
                  <CardDescription>Manage your connected social accounts</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  {success && (
                    <Alert variant="default" className="bg-green-50 text-green-800 border-green-200">
                      <Check className="h-4 w-4" />
                      <AlertTitle>Success</AlertTitle>
                      <AlertDescription>{success}</AlertDescription>
                    </Alert>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="bg-white p-2 rounded-full shadow-sm">
                        <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                          <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                            <path
                              fill="#4285F4"
                              d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"
                            />
                            <path
                              fill="#34A853"
                              d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"
                            />
                            <path
                              fill="#FBBC05"
                              d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"
                            />
                            <path
                              fill="#EA4335"
                              d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"
                            />
                          </g>
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium">Google</h4>
                        <p className="text-sm text-muted-foreground">
                          {isGoogleLinked ? "Connected" : "Not connected"}
                        </p>
                      </div>
                    </div>

                    {isGoogleLinked ? (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-500 border-red-200 hover:bg-red-50"
                        onClick={handleUnlinkGoogle}
                        disabled={loading === "google"}
                      >
                        {loading === "google" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Disconnect
                      </Button>
                    ) : (
                      <Button variant="outline" size="sm" onClick={handleLinkGoogle} disabled={loading === "google"}>
                        {loading === "google" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Connect
                      </Button>
                    )}
                  </div>

                  <div className="pt-4">
                    <p className="text-sm text-muted-foreground">
                      Connecting your Google account allows you to sign in quickly and securely using your Google
                      credentials.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Password</CardTitle>
                  <CardDescription>Change your password or enable two-factor authentication</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline">Change Password</Button>

                  <div className="pt-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="2fa">Two-factor Authentication</Label>
                        <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                      </div>
                      <Switch id="2fa" disabled />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">Two-factor authentication is coming soon</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Control how you receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="email-notifications">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                    </div>
                    <Switch id="email-notifications" defaultChecked />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="push-notifications">Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive notifications on your device</p>
                    </div>
                    <Switch id="push-notifications" defaultChecked />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="marketing-emails">Marketing Emails</Label>
                      <p className="text-sm text-muted-foreground">Receive promotional emails and offers</p>
                    </div>
                    <Switch id="marketing-emails" />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button>Save Preferences</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AuthGuard>
  )
}
