"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { FAQ_DATA } from "@/lib/constants";
import { FAQAccordion } from "@/components/common/FAQAccordion";
import { Search } from "lucide-react";

export default function FAQsPage() {
  const searchParams = useSearchParams();
  const expandParam = searchParams.get("expand");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(expandParam);

  useEffect(() => {
    if (expandParam) {
      setExpandedId(expandParam);
    }
  }, [expandParam]);

  const filteredFAQs = useMemo(() => {
    if (!searchQuery.trim()) return FAQ_DATA;
    const query = searchQuery.toLowerCase();
    return FAQ_DATA.filter(
      (faq) =>
        faq.question.toLowerCase().includes(query) ||
        faq.answer.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const groupedFAQs = useMemo(() => {
    const groups: Record<string, typeof FAQ_DATA> = {
      packages: [],
      payments: [],
      account: [],
    };
    filteredFAQs.forEach((faq) => {
      groups[faq.category].push(faq);
    });
    return groups;
  }, [filteredFAQs]);

  const handleToggle = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleFeedback = (faqId: string, helpful: boolean) => {
    console.log(
      `FAQ ${faqId} feedback: ${helpful ? "helpful" : "not helpful"}`
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="px-4 py-4 space-y-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search questions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 pr-10 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#32C28A]"
          />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>

        {Object.entries(groupedFAQs).map(([category, faqs]) =>
          faqs.length > 0 ? (
            <div
              key={category}
              className="bg-white rounded-2xl border border-gray-100"
            >
              {faqs.map((faq) => (
                <FAQAccordion
                  key={faq.id}
                  faq={faq}
                  isExpanded={expandedId === faq.id}
                  onToggle={() => handleToggle(faq.id)}
                  onFeedback={(helpful) => handleFeedback(faq.id, helpful)}
                />
              ))}
            </div>
          ) : null
        )}

        {filteredFAQs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">
              No questions found for "{searchQuery}"
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
