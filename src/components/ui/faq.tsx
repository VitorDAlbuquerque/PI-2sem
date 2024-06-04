import React, { useState } from "react";

interface FaqProps {
  question: string;
  answer: string;
  expanded: boolean;
  onClick: () => void;
}

const Faq: React.FC<FaqProps> = ({ question, answer }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <div className="w-full max-w-4xl mx-auto mb-1">
      
      <div className="border border-t-0 bg-mainFontColor hover:opacity-90 brightness-95 dark:border-white dark:border-2 dark:bg-body-dark rounded-lg">
        <h2 className="accordion-header mb-0">
          <button
            className="group relative flex w-full items-center border-0 bg-transparent px-5 py-4 text-left text-base text-neutral-800 transition overflow-anchor-none hover:z-2 focus:z-3 focus:outline-none dark:bg-body-dark dark:text-white dark:bg-black dark:hover:bg-dark-900 dark:hover:text-primary rounded-t-lg"
            type="button"
            onClick={toggleExpanded}
            aria-expanded={expanded ? "true" : "false"}
            aria-controls={question}
          >
            {question}
            <span
              className={`-me-1 ms-auto h-5 w-5 shrink-0 transition-transform duration-200 ease-in-out ${
                expanded ? "rotate-0" : "-rotate-180"
              } group-data-twe-collapse-collapsed:me-0 group-data-twe-collapse-collapsed:rotate-0 motion-reduce:transition-none dark:translate-y-0 dark:rotate-180 dark:[&>svg]:h-6 dark:[&>svg]:w-6`}
            >
              <svg
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </span>
          </button>
        </h2>
        <div
          id={question}
          className={`px-5 py-4 ${expanded ? "block" : "hidden"} text-black dark:text-white dark:bg-black dark:border-2 dark:border-white rounded-b-lg`}
        >
          <div>{answer}</div>
        </div>
      </div>
    </div>
  );
};

export default Faq;