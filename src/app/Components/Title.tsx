"use client";
import { motion } from "framer-motion";
import Image from "next/image";

const Title = () => {
  return (
    <motion.div
      className="flex gap-2 items-center"
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Image
        src="/logo.png"
        alt="Get Your Img Shields"
        width={20}
        height={20}
      />
      <h1 className="text-4xl font-bold font-[family-name:var(--font-space-grotesk)] truncate">
        Get Your
        <wbr /> Img Shields
      </h1>
    </motion.div>
  );
};

export default Title;
