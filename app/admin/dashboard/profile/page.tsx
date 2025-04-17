"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  FaSave,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaInfoCircle,
  FaShieldAlt,
  FaCalendarAlt,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaCamera,
  FaCheck,
  FaExclamationTriangle,
  FaNewspaper,
  FaComments,
  FaCog,
} from "react-icons/fa"
import { toast } from "react-hot-toast"

export default function ProfilePage() {
  const [profile, setProfile] = useState(null)
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    bio: "",
    profileImage: "",
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [passwordFeedback, setPasswordFeedback] = useState("")
  const [recentActivity, setRecentActivity] = useState([])
  const [stats, setStats] = useState({
    articlesPublished: 0,
    commentsModerated: 0,
    totalViews: 0,
  })

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("/api/admin/profile")

        if (response.ok) {
          const data = await response.json()
          setProfile(data)
          setFormData({
            fullName: data.fullName || "",
            phone: data.phone || "",
            bio: data.bio || "",
            profileImage: data.profileImage || "",
          })
        } else {
          throw new Error("Failed to fetch profile")
        }
      } catch (error) {
        console.error("Error fetching profile:", error)
        toast.error("Failed to load profile")
      } finally {
        setIsLoading(false)
      }
    }

    const fetchAdminStats = async () => {
      try {
        // This would be a real API endpoint in a production app
        // For now, we'll simulate some data
        setStats({
          articlesPublished: 24,
          commentsModerated: 156,
          totalViews: 12453,
        })

        // Simulate recent activity
        setRecentActivity([
          {
            type: "article",
            action: "published",
            title: "New Economic Policies Announced",
            date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          },
          {
            type: "comment",
            action: "approved",
            title: "Comment on 'Climate Change Report'",
            date: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
          },
          {
            type: "article",
            action: "edited",
            title: "Sports Tournament Results",
            date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            type: "settings",
            action: "updated",
            title: "Site Settings",
            date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          },
        ])
      } catch (error) {
        console.error("Error fetching admin stats:", error)
      }
    }

    fetchProfile()
    fetchAdminStats()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordData((prev) => ({ ...prev, [name]: value }))

    if (name === "newPassword") {
      checkPasswordStrength(value)
    }
  }

  const checkPasswordStrength = (password) => {
    // Simple password strength checker
    let strength = 0
    let feedback = ""

    if (password.length >= 8) strength += 1
    if (/[A-Z]/.test(password)) strength += 1
    if (/[a-z]/.test(password)) strength += 1
    if (/[0-9]/.test(password)) strength += 1
    if (/[^A-Za-z0-9]/.test(password)) strength += 1

    if (strength === 0) feedback = "Password is too weak"
    else if (strength <= 2) feedback = "Password is weak"
    else if (strength <= 4) feedback = "Password is medium strength"
    else feedback = "Password is strong"

    setPasswordStrength(strength)
    setPasswordFeedback(feedback)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    setIsSaving(true)

    try {
      const response = await fetch("/api/admin/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to update profile")
      }

      setProfile(data.admin)
      toast.success("Profile updated successfully")
    } catch (error) {
      console.error("Error updating profile:", error)
      toast.error(error.message || "Failed to update profile")
    } finally {
      setIsSaving(false)
    }
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords don't match")
      return
    }

    if (passwordStrength < 3) {
      toast.error("Please use a stronger password")
      return
    }

    setIsChangingPassword(true)

    try {
      // This would be a real API endpoint in a production app
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast.success("Password changed successfully")
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
    } catch (error) {
      console.error("Error changing password:", error)
      toast.error(error.message || "Failed to change password")
    } finally {
      setIsChangingPassword(false)
    }
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
          <p className="text-foreground">Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <motion.div className="space-y-6" variants={containerVariants} initial="hidden" animate="visible">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">My Profile</h1>

        <motion.button
          onClick={handleSubmit}
          disabled={isSaving}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isSaving ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span>Saving...</span>
            </>
          ) : (
            <>
              <FaSave />
              <span>Save Changes</span>
            </>
          )}
        </motion.button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Info Card */}
        <motion.div
          className="bg-card rounded-xl shadow-sm p-6 border border-border lg:col-span-1"
          variants={itemVariants}
        >
          <div className="flex flex-col items-center">
            <div className="relative w-32 h-32 rounded-full bg-primary/20 flex items-center justify-center text-primary mb-4 group">
              {profile.profileImage ? (
                <img
                  src={profile.profileImage || "/placeholder.svg"}
                  alt={profile.fullName}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <FaUser size={64} />
              )}
              <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <FaCamera size={24} className="text-white" />
              </div>
            </div>

            <h2 className="text-xl font-bold text-foreground">{profile.fullName}</h2>
            <p className="text-muted-foreground">{profile.email}</p>

            <div className="mt-4 py-2 px-4 rounded-full bg-primary/10 text-primary text-sm font-medium">
              {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
            </div>

            <div className="w-full mt-6 space-y-4">
              <div className="flex items-center text-sm">
                <FaCalendarAlt className="text-primary mr-2" />
                <span className="text-muted-foreground">Joined: </span>
                <span className="ml-2 text-foreground">{new Date(profile.createdAt).toLocaleDateString()}</span>
              </div>

              <div className="flex items-center text-sm">
                <FaCalendarAlt className="text-primary mr-2" />
                <span className="text-muted-foreground">Last Login: </span>
                <span className="ml-2 text-foreground">
                  {profile.lastLogin ? new Date(profile.lastLogin).toLocaleString() : "Never"}
                </span>
              </div>
            </div>

            {/* Activity Stats */}
            <div className="w-full mt-6 pt-6 border-t border-border">
              <h3 className="text-sm font-medium text-foreground mb-4">Activity Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Articles Published</span>
                  <span className="text-sm font-medium text-foreground">{stats.articlesPublished}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Comments Moderated</span>
                  <span className="text-sm font-medium text-foreground">{stats.commentsModerated}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total Views</span>
                  <span className="text-sm font-medium text-foreground">{stats.totalViews.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Edit Profile Form */}
        <motion.div
          className="bg-card rounded-xl shadow-sm p-6 border border-border lg:col-span-2"
          variants={itemVariants}
        >
          <h2 className="text-xl font-bold text-foreground mb-6">Edit Profile</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="fullName" className="block text-sm font-medium text-foreground">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="text-muted-foreground" />
                </div>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="pl-10 w-full p-3 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-foreground">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="text-muted-foreground" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={profile.email}
                  className="pl-10 w-full p-3 bg-background border border-input rounded-lg text-muted-foreground"
                  disabled
                />
              </div>
              <p className="text-xs text-muted-foreground">Email cannot be changed</p>
            </div>

            <div className="space-y-2">
              <label htmlFor="phone" className="block text-sm font-medium text-foreground">
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaPhone className="text-muted-foreground" />
                </div>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  className="pl-10 w-full p-3 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                  placeholder="Enter your phone number"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="profileImage" className="block text-sm font-medium text-foreground">
                Profile Image URL
              </label>
              <input
                id="profileImage"
                name="profileImage"
                type="text"
                value={formData.profileImage}
                onChange={handleChange}
                className="w-full p-3 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                placeholder="Enter profile image URL"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="bio" className="block text-sm font-medium text-foreground">
                Bio
              </label>
              <div className="relative">
                <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                  <FaInfoCircle className="text-muted-foreground" />
                </div>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  className="pl-10 w-full p-3 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                  placeholder="Tell us about yourself..."
                  rows={4}
                />
              </div>
            </div>
          </form>
        </motion.div>
      </div>

      {/* Security Section */}
      <motion.div className="bg-card rounded-xl shadow-sm p-6 border border-border" variants={itemVariants}>
        <div className="flex items-center mb-6">
          <FaShieldAlt className="text-primary mr-2" size={20} />
          <h2 className="text-xl font-bold text-foreground">Security</h2>
        </div>

        <div className="space-y-6">
          <div className="p-4 bg-background rounded-lg border border-border">
            <h3 className="text-foreground font-medium mb-4">Change Password</h3>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="currentPassword" className="block text-sm font-medium text-foreground">
                  Current Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-muted-foreground" />
                  </div>
                  <input
                    id="currentPassword"
                    name="currentPassword"
                    type={showCurrentPassword ? "text" : "password"}
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className="pl-10 pr-10 w-full p-3 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                    placeholder="Enter your current password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? (
                      <FaEyeSlash className="text-muted-foreground" />
                    ) : (
                      <FaEye className="text-muted-foreground" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="newPassword" className="block text-sm font-medium text-foreground">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-muted-foreground" />
                  </div>
                  <input
                    id="newPassword"
                    name="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className="pl-10 pr-10 w-full p-3 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                    placeholder="Enter your new password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? (
                      <FaEyeSlash className="text-muted-foreground" />
                    ) : (
                      <FaEye className="text-muted-foreground" />
                    )}
                  </button>
                </div>
                {passwordData.newPassword && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-muted-foreground">Password strength:</span>
                      <span
                        className={`text-xs ${
                          passwordStrength <= 2
                            ? "text-red-500"
                            : passwordStrength <= 4
                              ? "text-yellow-500"
                              : "text-green-500"
                        }`}
                      >
                        {passwordFeedback}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          passwordStrength <= 2
                            ? "bg-red-500"
                            : passwordStrength <= 4
                              ? "bg-yellow-500"
                              : "bg-green-500"
                        }`}
                        style={{ width: `${(passwordStrength / 5) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground">
                  Confirm New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-muted-foreground" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className="pl-10 pr-10 w-full p-3 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                    placeholder="Confirm your new password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <FaEyeSlash className="text-muted-foreground" />
                    ) : (
                      <FaEye className="text-muted-foreground" />
                    )}
                  </button>
                </div>
                {passwordData.newPassword && passwordData.confirmPassword && (
                  <div className="flex items-center mt-1">
                    {passwordData.newPassword === passwordData.confirmPassword ? (
                      <>
                        <FaCheck className="text-green-500 mr-1" size={12} />
                        <span className="text-xs text-green-500">Passwords match</span>
                      </>
                    ) : (
                      <>
                        <FaExclamationTriangle className="text-red-500 mr-1" size={12} />
                        <span className="text-xs text-red-500">Passwords don't match</span>
                      </>
                    )}
                  </div>
                )}
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isChangingPassword}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isChangingPassword ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      <span>Changing Password...</span>
                    </>
                  ) : (
                    <>
                      <FaLock />
                      <span>Change Password</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-background rounded-lg border border-border">
            <div>
              <h3 className="text-foreground font-medium">Two-Factor Authentication</h3>
              <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
            </div>
            <button className="mt-2 sm:mt-0 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors">
              Enable 2FA
            </button>
          </div>
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div className="bg-card rounded-xl shadow-sm p-6 border border-border" variants={itemVariants}>
        <h2 className="text-xl font-bold text-foreground mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {recentActivity.map((activity, index) => (
            <div key={index} className="flex items-start p-3 rounded-lg hover:bg-muted/50 transition-colors">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${
                  activity.type === "article"
                    ? "bg-primary/10 text-primary"
                    : activity.type === "comment"
                      ? "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400"
                      : "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                }`}
              >
                {activity.type === "article" ? (
                  <FaNewspaper />
                ) : activity.type === "comment" ? (
                  <FaComments />
                ) : (
                  <FaCog />
                )}
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <h3 className="font-medium text-foreground">
                    {activity.action.charAt(0).toUpperCase() + activity.action.slice(1)} {activity.title}
                  </h3>
                  <span className="text-xs text-muted-foreground flex items-center">
                    <FaCalendarAlt className="mr-1" />
                    {new Date(activity.date).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
          {recentActivity.length === 0 && <p className="text-center text-muted-foreground py-4">No recent activity</p>}
        </div>
      </motion.div>
    </motion.div>
  )
}
