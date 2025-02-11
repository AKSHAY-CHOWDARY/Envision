import React, { useState } from "react";
import { FaClipboardList } from "react-icons/fa";
import { FaClipboardCheck } from "react-icons/fa6";
const CopyToClipboard = ({ text }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      
      <button
        onClick={handleCopy}
        className="text-indigo-950"
      >
        {copied ? <FaClipboardCheck  size={20}/> : <FaClipboardList size={20} />}
      </button>
    </div>
  );
};

export default CopyToClipboard;
