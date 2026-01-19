"use client";

import { useRouter } from "next/navigation";
import {
  HelpCircle,
  MessageCircle,
  AlertTriangle,
  Info,
  ChevronRight,
} from "lucide-react";

interface SupportOption {
  id: string;
  icon: "HelpCircle" | "MessageCircle" | "AlertTriangle";
  iconBg: string;
  title: string;
  subtitle: string;
  action: () => void;
}

interface PopularArticle {
  id: string;
  question: string;
}

const POPULAR_ARTICLES: PopularArticle[] = [
  { id: "faq-1", question: "How do I use my package at a facility?" },
  { id: "faq-4", question: "What is co-pay and why do I pay it?" },
  { id: "faq-7", question: "How do I add children to my account?" },
  { id: "faq-6", question: "Can I get a refund for unused visits?" },
];

const IconComponents = {
  HelpCircle,
  MessageCircle,
  AlertTriangle,
};

export default function HelpPage() {
  const router = useRouter();

  const handleFAQs = () => {
    router.push("/profile/help/faqs");
  };

  const handleContactUs = () => {
    router.push("/profile/help/contact");
  };

  const handleReportIssue = () => {
    router.push("/profile/help/report-issue");
  };

  const handleArticleTap = (faqId: string) => {
    router.push(`/profile/help/faqs?expand=${faqId}`);
  };

  const supportOptions: SupportOption[] = [
    {
      id: "faqs",
      icon: "HelpCircle",
      iconBg: "bg-secondary-100",
      title: "FAQs",
      subtitle: "Find answers to common questions",
      action: handleFAQs,
    },
    {
      id: "contact",
      icon: "MessageCircle",
      iconBg: "bg-secondary-100",
      title: "Contact Us",
      subtitle: "Get in touch with our team",
      action: handleContactUs,
    },
    {
      id: "report",
      icon: "AlertTriangle",
      iconBg: "bg-secondary-100",
      title: "Report an Issue",
      subtitle: "Let us know what's not working",
      action: handleReportIssue,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="px-4 py-6 space-y-4">
        {/* Title Section */}
        <div className="px-1">
          <h2 className="text-xl font-bold text-neutral-900">
            How can we help?
          </h2>
        </div>

        {/* Support Options Card */}
        <div className="rounded-4xl px-4 border border-neutral-400">
          {supportOptions.map((option, index) => {
            const IconComponent = IconComponents[option.icon];
            const isLast = index === supportOptions.length - 1;
            const iconColorClass =
              option.icon === "AlertTriangle"
                ? "text-neutral-900"
                : "text-neutral-900";

            return (
              <button
                key={option.id}
                onClick={option.action}
                className={`w-full flex items-center gap-3 py-4 text-left ${
                  !isLast ? "border-b border-neutral-400" : ""
                }`}
              >
                {/* Icon Circle */}
                <div
                  className={`w-12 h-12 rounded-full ${option.iconBg} flex items-center justify-center shrink-0`}
                >
                  <IconComponent size={20} className={iconColorClass} />
                </div>

                {/* Text Content */}
                <div className="flex-1 min-w-0">
                  <span className="block text-base font-medium text-neutral-900">
                    {option.title}
                  </span>
                  <span className="block text-sm text-neutral-700 mt-0.5">
                    {option.subtitle}
                  </span>
                </div>

                {/* Chevron */}
                <ChevronRight
                  size={20}
                  className="text-neutral-700 shrink-0"
                />
              </button>
            );
          })}
        </div>

        {/* Popular Articles Card */}
        <div
          className="rounded-4xl p-4"
          style={{ backgroundColor: "#E3F1FC" }}
        >
          <div className="flex items-start gap-3">
            <Info size={24} className="text-neutral-900 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-base font-medium text-neutral-900 mb-3">
                Popular articles
              </p>
              <div className="space-y-1">
                {POPULAR_ARTICLES.map((article) => (
                  <button
                    key={article.id}
                    onClick={() => handleArticleTap(article.id)}
                    className="w-full flex items-center justify-between gap-2 py-2 text-left"
                  >
                    <span className="text-sm text-neutral-700">
                      {article.question}
                    </span>
                    <ChevronRight
                      size={16}
                      className="text-secondary-900 shrink-0"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
