import { CirclePlus, LayoutGrid } from "lucide-react";
import React from "react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";

const NoDataFound = ({ title, description, buttonText, buttonAction }) => {
  const containerVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <motion.div
      className="col-span-full text-center py-12 2xl:py-24 bg-muted/40 rounded-2xl shadow-sm h-[85vh] flex flex-col justify-center items-center"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Animated Icon */}
      <motion.div
        className="mb-4 flex justify-center"
        animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <LayoutGrid className="w-14 h-14 text-muted-foreground" />
      </motion.div>

      {/* Title */}
      <motion.h3 className="mt-2 text-xl font-semibold" variants={itemVariants}>
        {title}
      </motion.h3>

      {/* Description */}
      <motion.p
        className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto"
        variants={itemVariants}
      >
        {description}
      </motion.p>

      {/* Button with animation */}
      {!buttonText && !buttonAction ? (
        <motion.div variants={itemVariants}></motion.div>
      ) : (
        <motion.div variants={itemVariants}>
          <Button onClick={buttonAction} className="mt-6">
            <CirclePlus className="w-4 h-4" /> {buttonText}
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default NoDataFound;
