"use client";

import { useState } from "react";
import { Search, ChevronDown, ThumbsUp, ThumbsDown } from "lucide-react";
import { FAQ_DATA } from "@/lib/constants";

export default function FAQsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Record<string, "helpful" | "not-helpful" | null>>({});

  const filteredFAQs = FAQ_DATA.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleFeedback = (id: string, type: "helpful" | "not-helpful") => {
    setFeedback((prev) => ({
      ...prev,
      [id]: prev[id] === type ? null : type,
    }));
  };

  return (
    <div className="min-h-screen bg-neutral-200">
      <div className="px-4 py-6 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500"
          />
          <input
            type="text"
            placeholder="Search FAQs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 pl-12 pr-4 rounded-xl border-[1.5px] border-neutral-400 bg-white text-base placeholder:text-neutral-500 focus:outline-none focus:border-primary-900"
          />
        </div>

        {/* FAQs List */}
        {filteredFAQs.length > 0 ? (
          <div className="bg-white rounded-2xl overflow-hidden">
            {filteredFAQs.map((faq, index) => {
              const isExpanded = expandedId === faq.id;
              const isLast = index === filteredFAQs.length - 1;
              const faqFeedback = feedback[faq.id];

              return (
                <div
                  key={faq.id}
                  className={!isLast ? "border-b border-neutral-300" : ""}
                >
                  {/* Question Header */}
                  <button
                    onClick={() => toggleExpand(faq.id)}
                    className="w-full flex items-center justify-between gap-3 px-4 py-4 text-left"
                  >
                    <span className="text-base font-medium text-neutral-900 flex-1">
                      {faq.question}
                    </span>
                    <ChevronDown
                      size={20}
                      className={`text-neutral-500 flex-shrink-0 transition-transform duration-200 ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Answer Content */}
                  {isExpanded && (
                    <div className="px-4 pb-4">
                      <p className="text-sm text-neutral-700 leading-relaxed mb-4">
                        {faq.answer}
                      </p>

                      {/* Feedback Section */}
                      <div className="flex items-center gap-2 pt-3 border-t border-neutral-200">
                        <span className="text-sm text-neutral-600 mr-2">
                          Was this helpful?
                        </span>
                        <button
                          onClick={() => handleFeedback(faq.id, "helpful")}
                          className={`p-2 rounded-lg transition-colors ${
                            faqFeedback === "helpful"
                              ? "bg-primary-100 text-primary-900"
                              : "text-neutral-500 hover:bg-neutral-100"
                          }`}
                        >
                          <ThumbsUp size={18} />
                        </button>
                        <button
                          onClick={() => handleFeedback(faq.id, "not-helpful")}
                          className={`p-2 rounded-lg transition-colors ${
                            faqFeedback === "not-helpful"
                              ? "bg-warning-100 text-warning-900"
                              : "text-neutral-500 hover:bg-neutral-100"
                          }`}
                        >
                          <ThumbsDown size={18} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white rounded-2xl p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-neutral-100 rounded-full flex items-center justify-center">
              <Search size={24} className="text-neutral-500" />
            </div>
            <h3 className="text-base font-medium text-neutral-900 mb-2">
              No results found
            </h3>
            <p className="text-sm text-neutral-600">
              Try searching with different keywords or browse all FAQs
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="mt-4 text-sm font-medium text-primary-900"
              >
                Clear search
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
