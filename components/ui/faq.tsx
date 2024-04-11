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
    <div className=" w-2/3 border border-t-0 bg-mainFontColor brightness-95 dark:border-neutral-600 dark:bg-body-dark">
      <h2 className="accordion-header mb-0" id={question}>
        <button
          className="group relative flex w-full items-center border-0 bg- px-5 py-4 text-left text-base text-neutral-800 transition [overflow-anchor:none] hover:z-[2] focus:z-[3] focus:outline-none dark:bg-body-dark dark:text-white  [&:not([data-twe-collapse-collapsed])]:bg- [&:not([data-twe-collapse-collapsed])]:text-primary [&:not([data-twe-collapse-collapsed])]:shadow-border-b dark:[&:not([data-twe-collapse-collapsed])]:bg-surface-dark dark:[&:not([data-twe-collapse-collapsed])]:text-primary dark:[&:not([data-twe-collapse-collapsed])]:shadow-white/10"
          type="button"
          data-twe-collapse-init
          data-twe-collapse-collapsed={expanded ? "false" : "true"}
          data-twe-target={`#${question}`}
          aria-expanded={expanded ? "true" : "false"}
          aria-controls={question}
          onClick={toggleExpanded}
        >
          {question}
          <span className="-me-1 ms-auto h-5 w-5 shrink-0 rotate-[-180deg] transition-transform duration-200 ease-in-out group-data-[twe-collapse-collapsed]:me-0 group-data-[twe-collapse-collapsed]:rotate-0 motion-reduce:transition-none [&>svg]:h-6 [&>svg]:w-6 ">
            <svg
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 8.25l-7.5 7.5-7.5-7.5"
              />
            </svg>
          </span>
        </button>
      </h2>
      <div
        id={question}
        className={`${expanded ? "visible" : "hidden"} text-black`}
        data-twe-collapse-item
        aria-labelledby={question}
      >
        <div className="px-5 py-4">
          <strong>{question}</strong> {answer}
        </div>
      </div>
    </div>
  );
};

export default Faq;
