"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { useState } from "react"

export default function SettingsPage() {
  const [generalSettings, setGeneralSettings] = useState({
    siteName: "X:1 Sports",
    siteDescription: "Connect athletes with trainers for personalized coaching",
    supportEmail: "info@myx1sports.com",
    contactPhone: "+1 (555) 123-4567",
  })

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    newUserAlerts: true,
    paymentAlerts: true,
    systemAlerts: true,
    marketingEmails: false,
  })

  const handleGeneralSettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setGeneralSettings((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleNotificationToggle = (setting: string) => {
    setNotificationSettings((prev) => ({
      ...prev,
      [setting]: !prev[setting as keyof typeof prev],
    }))
  }

  const handleSaveGeneralSettings = () => {
    // In a real app, you would save these to your database
    toast({
      title: "Settings saved",
      description: "Your general settings have been saved successfully.",
    })
  }

  const handleSaveNotificationSettings = () => {
    // In a real app, you would save these to your database
    toast({
      title: "Notification settings saved",
      description: "Your notification preferences have been updated.",
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your admin dashboard and platform settings.</p>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="api">API</TabsTrigger>
        </TabsList>
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Configure basic platform settings.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="siteName">Site Name</Label>
                <Input
                  id="siteName"
                  name="siteName"
                  value={generalSettings.siteName}
                  onChange={handleGeneralSettingsChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="siteDescription">Site Description</Label>
                <Textarea
                  id="siteDescription"
                  name="siteDescription"
                  value={generalSettings.siteDescription}
                  onChange={handleGeneralSettingsChange}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="supportEmail">Support Email</Label>
                <Input
                  id="supportEmail"
                  name="supportEmail"
                  type="email"
                  value={generalSettings.supportEmail}
                  onChange={handleGeneralSettingsChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactPhone">Contact Phone</Label>
                <Input
                  id="contactPhone"
                  name="contactPhone"
                  type="tel"
                  value={generalSettings.contactPhone}
                  onChange={handleGeneralSettingsChange}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveGeneralSettings}>Save Changes</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Platform Features</CardTitle>
              <CardDescription>Enable or disable platform features.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="chatbot">AI Chatbot</Label>
                  <p className="text-sm text-muted-foreground">Enable the AI-powered chatbot for user assistance.</p>
                </div>
                <Switch id="chatbot" defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="reviews">User Reviews</Label>
                  <p className="text-sm text-muted-foreground">Allow users to leave reviews for trainers.</p>
                </div>
                <Switch id="reviews" defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="messaging">Direct Messaging</Label>
                  <p className="text-sm text-muted-foreground">Enable direct messaging between users.</p>
                </div>
                <Switch id="messaging" defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="payments">In-Platform Payments</Label>
                  <p className="text-sm text-muted-foreground">Allow payments to be processed through the platform.</p>
                </div>
                <Switch id="payments" defaultChecked />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Features</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure how and when you receive notifications.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="emailNotifications">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive notifications via email.</p>
                </div>
                <Switch
                  id="emailNotifications"
                  checked={notificationSettings.emailNotifications}
                  onCheckedChange={() => handleNotificationToggle("emailNotifications")}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="newUserAlerts">New User Alerts</Label>
                  <p className="text-sm text-muted-foreground">Get notified when new users register.</p>
                </div>
                <Switch
                  id="newUserAlerts"
                  checked={notificationSettings.newUserAlerts}
                  onCheckedChange={() => handleNotificationToggle("newUserAlerts")}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="paymentAlerts">Payment Alerts</Label>
                  <p className="text-sm text-muted-foreground">Get notified about payment events.</p>
                </div>
                <Switch
                  id="paymentAlerts"
                  checked={notificationSettings.paymentAlerts}
                  onCheckedChange={() => handleNotificationToggle("paymentAlerts")}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="systemAlerts">System Alerts</Label>
                  <p className="text-sm text-muted-foreground">Get notified about system events and errors.</p>
                </div>
                <Switch
                  id="systemAlerts"
                  checked={notificationSettings.systemAlerts}
                  onCheckedChange={() => handleNotificationToggle("systemAlerts")}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="marketingEmails">Marketing Emails</Label>
                  <p className="text-sm text-muted-foreground">Receive marketing and promotional emails.</p>
                </div>
                <Switch
                  id="marketingEmails"
                  checked={notificationSettings.marketingEmails}
                  onCheckedChange={() => handleNotificationToggle("marketingEmails")}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveNotificationSettings}>Save Preferences</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage security settings and access controls.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="twoFactor">Two-Factor Authentication</Label>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">Add an extra layer of security to your account.</p>
                  <Switch id="twoFactor" />
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <Label htmlFor="sessionTimeout">Session Timeout</Label>
                <div className="flex items-center gap-4">
                  <Input id="sessionTimeout" type="number" defaultValue={30} min={5} max={120} className="w-20" />
                  <p className="text-sm text-muted-foreground">minutes</p>
                </div>
                <p className="text-sm text-muted-foreground">Automatically log out after period of inactivity.</p>
              </div>
              <Separator />
              <div className="space-y-2">
                <Label>Password Requirements</Label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Switch id="minLength" defaultChecked />
                    <Label htmlFor="minLength" className="text-sm">
                      Minimum 8 characters
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch id="uppercase" defaultChecked />
                    <Label htmlFor="uppercase" className="text-sm">
                      Require uppercase letters
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch id="numbers" defaultChecked />
                    <Label htmlFor="numbers" className="text-sm">
                      Require numbers
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch id="special" defaultChecked />
                    <Label htmlFor="special" className="text-sm">
                      Require special characters
                    </Label>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Security Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="api" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>API Settings</CardTitle>
              <CardDescription>Manage API keys and access.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="apiKey">API Key</Label>
                <div className="flex gap-2">
                  <Input id="apiKey" value="sk_live_51NcGjqLkzGcXXXXXXXXXXXXXX" readOnly type="password" />
                  <Button variant="outline">Show</Button>
                  <Button variant="outline">Copy</Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="webhookUrl">Webhook URL</Label>
                <Input id="webhookUrl" placeholder="https://your-server.com/webhook" />
              </div>
              <div className="space-y-2">
                <Label>API Access</Label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Switch id="readAccess" defaultChecked />
                    <Label htmlFor="readAccess" className="text-sm">
                      Read access
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch id="writeAccess" defaultChecked />
                    <Label htmlFor="writeAccess" className="text-sm">
                      Write access
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch id="deleteAccess" />
                    <Label htmlFor="deleteAccess" className="text-sm">
                      Delete access
                    </Label>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save API Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
