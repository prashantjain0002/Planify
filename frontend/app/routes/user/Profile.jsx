import {
  useChangePassword,
  useUpdateUserProfile,
  useUserProfileQuery,
} from "@/hooks/useUser";
import { useAuth } from "@/lib/provider/authContext";
import { changePasswordSchema, profileSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

const Profile = () => {
  const { data: user, isPending } = useUserProfileQuery();
  const { mutate: updateUserProfile, isPending: isUpdatingProfile } =
    useUpdateUserProfile();
  const { mutate: changePassword, isPending: isChangingPassword } =
    useChangePassword();

  const { logout } = useAuth();
  const navigate = useNavigate();

  const profileForm = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      profilePicture: "",
    },
  });

  useEffect(() => {
    if (user) {
      profileForm.reset({
        name: user.name || "",
        profilePicture: user.profilePicture || "",
      });
    }
  }, [user, profileForm]);


  const passwordForm = useForm({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const handleProfileFormSubmit = (values) => {
    updateUserProfile(
      { name: values.name, profilePicture: values.profilePicture || "" },
      {
        onSuccess: () => {
          toast.success("Profile updated successfully 🎉");
        },
        onError: (error) => {
          toast.error(error?.message || "Failed to update profile");
        },
      }
    );
  };

  const handlePasswordChange = (values) => {
    changePassword(values, {
      onSuccess: () => {
        toast.success("Password changed successfully 🔑");
        passwordForm.reset();

        setTimeout(() => {
          logout();
          navigate("/");
        }, 2000);
      },
      onError: (error) => {
        toast.error(error?.message || "Failed to change password");
      },
    });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      profileForm.setValue("profilePicture", imageUrl);
      // TODO: upload file to server and save actual URL
    }
  };

  if (isPending) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Page Header */}
      <div className="px-4 md:px-0">
        <Button
          onClick={() => navigate(-1)}
          variant="outline"
          size="sm"
          className="p-4 transition-transform"
        >
          ← Back
        </Button>

        <h3 className="text-2xl font-bold mt-4">Profile Settings</h3>
        <p className="text-sm text-muted-foreground">
          Manage your personal information and account security.
        </p>
      </div>

      <Separator />

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <Card className="shadow-md hover:shadow-lg transition-shadow rounded-xl">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Update your name and avatar.</CardDescription>
          </CardHeader>

          <CardContent>
            <Form {...profileForm}>
              <form
                onSubmit={profileForm.handleSubmit(handleProfileFormSubmit)}
                className="space-y-6"
              >
                <div className="flex items-center gap-6">
                  <motion.div>
                    <Avatar className="h-20 w-20 border-2 border-blue-500 shadow-md">
                      <AvatarImage
                        src={
                          profileForm.watch("profilePicture") ||
                          user?.profilePicture
                        }
                        alt={user?.name}
                      />
                      <AvatarFallback className="text-xl">
                        {user?.name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </motion.div>

                  <div className="flex flex-col gap-2">
                    <input
                      type="file"
                      id="avatarUpload"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      disabled={isUpdatingProfile}
                      style={{ display: "none" }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        document.getElementById("avatarUpload")?.click()
                      }
                      className="transition-transform"
                    >
                      Change Avatar
                    </Button>
                  </div>
                </div>

                <FormField
                  control={profileForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Your full name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid gap-1">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    disabled
                    value={user?.email}
                    className="bg-gray-100 cursor-not-allowed"
                  />
                  <p className="text-xs text-muted-foreground">
                    Your email cannot be changed
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full transition-transform  bg-blue-500 text-white"
                  disabled={isUpdatingProfile}
                >
                  {isUpdatingProfile ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </motion.div>

      {/* Change Password Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        <Card className="shadow-md hover:shadow-lg transition-shadow rounded-xl">
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
            <CardDescription>
              Update your password to keep your account secure.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Form {...passwordForm}>
              <form
                onSubmit={passwordForm.handleSubmit(handlePasswordChange)}
                className="space-y-4"
              >
                {["currentPassword", "newPassword", "confirmPassword"].map(
                  (fieldName, idx) => (
                    <FormField
                      key={idx}
                      control={passwordForm.control}
                      name={fieldName}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {fieldName === "currentPassword"
                              ? "Current Password"
                              : fieldName === "newPassword"
                                ? "New Password"
                                : "Confirm New Password"}
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="••••••••"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )
                )}

                <Button
                  type="submit"
                  className="w-full transition-transform  bg-blue-500 text-white"
                  disabled={isChangingPassword}
                >
                  {isChangingPassword ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Changing...
                    </>
                  ) : (
                    "Change Password"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default Profile;
