import React from "react";
import { motion } from "framer-motion";

const FeatureItem = ({ text, icon: Icon, title }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="bg-white rounded-2xl border border-purple-100 shadow-md hover:shadow-lg transition flex flex-col py-10 px-6 items-center gap-4 text-center"
    >
      <div className="flex items-center justify-center w-20 h-20 rounded-full bg-purple-100">
        <Icon className="text-black text-4xl" />
      </div>
      <h3 className="text-xl font-bold text-slate-900">{title}</h3>
      <p className="text-slate-600">{text}</p>
    </motion.div>
  );
};

export default FeatureItem;
