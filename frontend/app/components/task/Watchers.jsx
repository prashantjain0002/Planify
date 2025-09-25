import React from "react";
import { Avatar, AvatarImage } from "../ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { motion, AnimatePresence } from "framer-motion";

const Watchers = ({ watchers }) => {
  return (
    <div className="bg-card rounded-xl p-6 shadow-lg mb-6 border border-gray-100">
      <h3 className="text-lg font-semibold mb-4 text-gray-700">Watchers</h3>

      <AnimatePresence>
        {watchers.length > 0 ? (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={{
              visible: {
                transition: { staggerChildren: 0.1 },
              },
            }}
            className="flex flex-col space-y-3"
          >
            {watchers.map((watcher) => (
              <motion.div
                key={watcher._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex items-center mb-3 mr-2 shadow-sm px-3 py-2 rounded-2xl bg-muted/40 gap-2"
              >
                <Avatar>
                  <AvatarImage src={watcher.profilePicture} />
                  <AvatarFallback className="bg-gray-800/20 flex items-center justify-center w-8">
                    {watcher.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <p className="text-sm font-medium text-gray-800">
                  {watcher.name}
                </p>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.p
            key="no-watchers"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-sm font-semibold text-center text-gray-500"
          >
            No Watchers
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Watchers;
