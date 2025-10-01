import Loader from "@/components/Loader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { Inbox } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { motion } from "framer-motion";
import { useGetWorkspaceDetailsQuery } from "@/hooks/useWorkspace";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useWorkspace } from "@/lib/provider/workspaceContext";

const Members = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  const [search, setSearch] = useState(initialSearch);

  const { selectedWorkspace } = useWorkspace();
  const workspaceId = selectedWorkspace?._id || searchParams.get("workspaceId");

  console.log(workspaceId);

  const { data, isLoading } = useGetWorkspaceDetailsQuery(workspaceId || "0");

  // Sync URL params with state
  useEffect(() => {
    const params = {};
    searchParams.forEach((value, key) => (params[key] = value));
    params.search = search;
    setSearchParams(params, { replace: true });
  }, [search]);

  useEffect(() => {
    const urlSearch = searchParams.get("search") || "";
    if (urlSearch !== search) setSearch(urlSearch);
  }, [searchParams]);

  // Filter members safely
  const filteredMembers =
    data?.members?.filter((member) => {
      const name = member.user?.name?.toLowerCase() || "";
      const email = member.user?.email?.toLowerCase() || "";
      const role = member.user?.role?.toLowerCase() || "";
      const searchText = search.toLowerCase();

      return (
        name.includes(searchText) ||
        email.includes(searchText) ||
        role.includes(searchText)
      );
    }) || [];

  if (isLoading) return <Loader />;

  if (!data) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center px-4">
        <Inbox className="w-20 h-20 mb-6 text-gray-300" />
        <h2 className="text-2xl font-bold text-gray-600 mb-2">
          No Workspace Found
        </h2>
      </div>
    );
  }

  // Framer Motion variants
  const pageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.1, duration: 0.5 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 120 },
    },
  };

  return (
    <motion.div
      className="space-y-6"
      initial="hidden"
      animate="visible"
      variants={pageVariants}
    >
      {/* Header */}
      <motion.div
        className="flex items-start md:items-center justify-between"
        variants={cardVariants}
      >
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Members
        </h1>
      </motion.div>

      {/* Search */}
      <motion.div variants={cardVariants} className="my-3">
        <Input
          placeholder="Search members..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-lg"
        />
      </motion.div>

      {/* Tabs */}
      <Tabs defaultValue="list">
        <TabsList>
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="grid">Grid View</TabsTrigger>
        </TabsList>

        {/* List View */}
        <TabsContent value="list" className="mb-4">
          <Card className="dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Members
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground dark:text-gray-400">
                {filteredMembers?.length} members in your workspace
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredMembers?.map((member) => (
                  <motion.div
                    key={member._id}
                    className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors rounded-lg"
                    variants={cardVariants}
                  >
                    <div className="flex items-center gap-4">
                      <Avatar className="bg-gray-500 w-12 h-12">
                        <AvatarImage src={member.user.profilePicture} />
                        <AvatarFallback className="text-black/45 dark:text-gray-200 font-bold text-lg">
                          {member.user.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <p className="font-medium text-gray-900 dark:text-gray-100">
                          {member.user.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {member.user.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          ["admin", "owner"].includes(member.role)
                            ? "done"
                            : "default"
                        }
                        className="text-sm px-3 py-1 capitalize"
                      >
                        {member.role}
                      </Badge>
                      <Badge
                        variant="default"
                        className="text-sm px-3 py-1 capitalize"
                      >
                        {data.name}
                      </Badge>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Grid View */}
        <TabsContent value="grid" className="mb-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredMembers.map((member) => (
              <motion.div
                key={member._id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 p-5 flex flex-col items-center text-center border-l-4"
                style={{
                  borderColor: ["owner"].includes(member.role)
                    ? "#10b981"
                    : ["admin"].includes(member.role)
                      ? "#f59e0b"
                      : "#3b82f6",
                }}
                variants={cardVariants}
              >
                <Avatar className="w-20 h-20 mb-4 ring-2 ring-green-400 dark:ring-green-600">
                  <AvatarImage src={member.user.profilePicture} />
                  <AvatarFallback className="text-black/60 dark:text-gray-200 font-bold text-2xl">
                    {member.user.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <p className="font-semibold text-gray-900 dark:text-gray-100 mb-1 text-lg">
                  {member.user.name}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 truncate">
                  {member.user.email}
                </p>
                <div className="flex flex-col gap-2 mt-auto w-full items-center">
                  <Badge
                    variant={
                      ["admin", "owner"].includes(member.role)
                        ? "done"
                        : "default"
                    }
                    className="text-sm px-4 py-1 rounded-full capitalize"
                  >
                    {member.role}
                  </Badge>
                  <Badge
                    variant="default"
                    className="text-sm px-4 py-1 rounded-full capitalize"
                  >
                    {data.name}
                  </Badge>
                </div>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default Members;
