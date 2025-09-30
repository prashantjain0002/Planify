// src/routes/root/Home.jsx
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Users,
  Calendar,
  Rocket,
  Shield,
  CheckCircle,
  Workflow,
  FolderPlus,
  ListChecks,
  BarChart2,
  Moon,
  Sun,
} from "lucide-react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "@/lib/provider/authContext";
import { useState, useEffect } from "react";

const COLORS = [
  "#FF5733",
  "#33C1FF",
  "#28A745",
  "#FFC300",
  "#8E44AD",
  "#E67E22",
  "#2ECC71",
  "#34495E",
];

const features = [
  {
    icon: <Rocket className="w-10 h-10 text-white" />,
    color: COLORS[0],
    title: "Boost Productivity",
    desc: "Streamline workflows with smart task management.",
  },
  {
    icon: <Users className="w-10 h-10 text-white" />,
    color: COLORS[1],
    title: "Seamless Collaboration",
    desc: "Work together in real-time effortlessly.",
  },
  {
    icon: <Calendar className="w-10 h-10 text-white" />,
    color: COLORS[2],
    title: "Stay On Schedule",
    desc: "Deadlines & reminders keep you on track.",
  },
  {
    icon: <Shield className="w-10 h-10 text-white" />,
    color: COLORS[4],
    title: "Secure & Reliable",
    desc: "Enterprise-grade security for your data.",
  },
  {
    icon: <CheckCircle className="w-10 h-10 text-white" />,
    color: COLORS[5],
    title: "Easy to Use",
    desc: "Clean, intuitive interface. Zero learning curve.",
  },
  {
    icon: <Workflow className="w-10 h-10 text-white" />,
    color: COLORS[7],
    title: "Powerful Insights",
    desc: "Visualize progress with rich analytics.",
  },
];

const works = [
  {
    step: "1",
    icon: <FolderPlus className="w-12 h-12 text-white" />,
    color: COLORS[0],
    title: "Create Workspace",
    desc: "Set up your workspace in minutes and invite your team.",
  },
  {
    step: "2",
    icon: <ListChecks className="w-12 h-12 text-white" />,
    color: COLORS[1],
    title: "Organize Projects",
    desc: "Group tasks into projects and set deadlines easily.",
  },
  {
    step: "3",
    icon: <BarChart2 className="w-12 h-12 text-white" />,
    color: COLORS[2],
    title: "Track Progress",
    desc: "Monitor real-time progress with analytics & insights.",
  },
];

export default function Home() {
  const { isAuthenticated } = useAuth();
  const [darkMode, setDarkMode] = useState(false);

  if (isAuthenticated) return <Navigate to="/dashboard" />;

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-500 ${darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"}`}
    >
      {/* Header */}
      <header className="w-full py-4 px-8 flex justify-between items-center bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50 transition-colors duration-500">
        <h1 className="text-3xl font-extrabold" style={{ color: COLORS[0] }}>
          Planify
        </h1>
        <div className="flex gap-4 items-center">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          >
            {darkMode ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>
          <Link to="/sign-in">
            <Button
              variant="outline"
              className="hover:scale-105 transition-transform"
            >
              Sign In
            </Button>
          </Link>
          <Link to="/sign-up">
            <Button
              className="text-white hover:scale-105 transition-transform"
              style={{ backgroundColor: COLORS[1] }}
            >
              Get Started
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-center gap-20 px-8 md:px-20 py-24">
        <motion.div
          className="max-w-xl text-center md:text-left"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-5xl md:text-6xl font-extrabold leading-tight">
            Organize. Collaborate. <br />
            <span style={{ color: COLORS[2] }}>Plan Smarter.</span>
          </h2>
          <p className="mt-6 text-lg">
            Planify helps teams manage projects, track tasks, and achieve goals
            with simplicity and style. Fast setup, beautiful UI, and powerful
            collaboration.
          </p>
          <div className="flex gap-4 mt-10 justify-center md:justify-start">
            <Link to="/sign-up">
              <Button
                size="lg"
                className="text-white hover:scale-105 transition-transform"
                style={{ backgroundColor: COLORS[2] }}
              >
                Get Started Free
              </Button>
            </Link>
            <Link to="/sign-in">
              <Button
                size="lg"
                variant="outline"
                className="hover:scale-105 transition-transform"
              >
                Sign In
              </Button>
            </Link>
          </div>
        </motion.div>
        <motion.div
          className="mt-12 md:mt-0"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
        >
          <img
            src="banner.png"
            alt="Team collaborating"
            className="w-full max-w-lg rounded-3xl shadow-2xl object-cover"
          />
        </motion.div>
      </section>

      {/* Features */}
      <section className="py-20 px-8">
        <h3 className="text-3xl font-bold text-center mb-12">
          Why Teams Love Planify 🚀
        </h3>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-2xl transition-all rounded-3xl border-2 border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
                <CardContent className="p-6 text-center">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto"
                    style={{ backgroundColor: feature.color }}
                  >
                    {feature.icon}
                  </div>
                  <h4 className="text-xl font-semibold mb-2">
                    {feature.title}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {feature.desc}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6">
        <h3 className="text-3xl font-bold text-center mb-12">
          How It Works ⚡
        </h3>
        <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
          {works.map((item, i) => (
            <motion.div
              key={i}
              className="flex flex-col items-center text-center rounded-3xl p-8 shadow-md hover:shadow-2xl transition-shadow bg-white dark:bg-gray-800"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              viewport={{ once: true }}
            >
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
                style={{ backgroundColor: item.color }}
              >
                {item.icon}
              </div>
              <div className="flex items-center justify-center mb-2">
                <div className="w-10 h-10 rounded-full bg-[#FFC300] text-white flex items-center justify-center font-bold mr-3">
                  {item.step}
                </div>
                <h4 className="text-xl font-semibold">{item.title}</h4>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 flex items-center justify-center">
        <div className="text-center px-6 max-w-3xl">
          <h3 className="text-4xl md:text-5xl font-extrabold mb-4">
            Start Planning Smarter Today
          </h3>
          <p className="text-lg mb-8">
            Join thousands of teams already using Planify to stay productive.
          </p>
          <Link to="/sign-up">
            <Button
              size="lg"
              className="bg-[#28A745] text-white font-semibold hover:scale-105 transition-transform"
            >
              Get Started Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 text-center text-sm bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
        © {new Date().getFullYear()} Planify. All rights reserved.
      </footer>
    </div>
  );
}
