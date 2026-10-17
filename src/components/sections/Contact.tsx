import React, { useState } from 'react';
import {
  Mail,
  Copy,
  Check,
  Send,
  ExternalLink,
  Shield,
  MessageSquare,
} from 'lucide-react';
import { siteConfig } from '../../config/site';
import { isValidEmail } from '../../lib/validators';
import { Container } from '../ui/Container';
import { SectionHeading } from '../ui/SectionHeading';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { SocialLinks } from '../ui/SocialLinks';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState(false);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(siteConfig.contact.email);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2500);
    } catch {
      // Fallback if clipboard API is restricted
      setCopiedEmail(false);
    }
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Please provide your name.';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Please provide your email address.';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email format (e.g., name@domain.com).';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Please add a subject.';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Please include a message.';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message should be at least 10 characters.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleMailtoSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const encodedSubject = encodeURIComponent(
      `[Portfolio Inquiry] ${formData.subject.trim()}`
    );
    const bodyText = `Hi ${siteConfig.developer.name},\n\n${formData.message.trim()}\n\n---\nFrom: ${formData.name.trim()} (${formData.email.trim()})`;
    const encodedBody = encodeURIComponent(bodyText);

    // Open mail client safely
    window.location.href = `mailto:${siteConfig.contact.email}?subject=${encodedSubject}&body=${encodedBody}`;
  };

  const handleCopyFormattedDraft = async () => {
    if (!validate()) return;

    const draft = `Subject: [Portfolio Inquiry] ${formData.subject.trim()}\nTo: ${siteConfig.contact.email}\nFrom: ${formData.name.trim()} <${formData.email.trim()}>\n\n${formData.message.trim()}`;
    try {
      await navigator.clipboard.writeText(draft);
      setCopiedMessage(true);
      setTimeout(() => setCopiedMessage(false), 2500);
    } catch {
      setCopiedMessage(false);
    }
  };

  return (
    <section id="contact" aria-label="Contact Section" className="py-20 bg-white">
      <Container>
        <SectionHeading
          eyebrow="LET'S CONNECT"
          title="Start a conversation."
          description="I am actively looking for junior fullstack opportunities, open-source collaborations, and discussions on web engineering."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start max-w-5xl mx-auto">
          {/* Left Column: Direct Contact & Transparency Info */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="p-6 bg-[#F8FBFF] border-[#DCEAF7]">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white border border-[#DCEAF7] text-[#3898EC] shadow-subtle mb-4">
                <Mail className="h-6 w-6" aria-hidden="true" />
              </div>
              <h3 className="text-base font-bold text-[#172B4D]">Direct Email</h3>
              <p className="mt-1 text-xs text-[#5B6B82] leading-relaxed">
                Feel free to email me directly. I usually respond within 24 to 48 hours.
              </p>

              <div className="mt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <code
                  tabIndex={0}
                  className="rounded-xl border border-[#DCEAF7] bg-white px-3 py-2 text-xs font-mono text-[#172B4D] truncate flex-1 focus:outline-none focus:ring-1 focus:ring-[#3898EC]"
                >
                  {siteConfig.contact.email}
                </code>
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-[#DCEAF7] bg-white px-3 py-2 text-xs font-semibold text-[#172B4D] hover:bg-[#EAF6FF] hover:text-[#3898EC] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3898EC]"
                  aria-label={copiedEmail ? 'Email address copied' : 'Copy email address'}
                >
                  {copiedEmail ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
                      <span className="text-emerald-700">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </Card>

            {/* Social profiles card */}
            <Card className="p-6 bg-[#F8FBFF] border-[#DCEAF7]">
              <h3 className="text-sm font-bold text-[#172B4D] mb-1">Online Profiles</h3>
              <p className="text-xs text-[#5B6B82] mb-4">
                Review my code contributions or connect professionally.
              </p>
              <SocialLinks variant="buttons" />
            </Card>

            {/* Security and Transparency note */}
            <div className="rounded-2xl border border-[#DCEAF7] bg-white p-4 flex items-start gap-3 text-xs text-[#5B6B82]">
              <Shield className="h-4 w-4 text-[#3898EC] shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <strong className="text-[#172B4D]">Privacy & Security:</strong> No messages are
                sent to unverified third-party endpoints. Form drafts launch your local mail client
                directly via standard <code className="text-xs font-mono">mailto:</code> links.
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Email Draft Composer */}
          <div className="lg:col-span-7">
            <Card className="p-6 sm:p-8 bg-white border-[#DCEAF7] shadow-card">
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-[#DCEAF7]">
                <MessageSquare className="h-5 w-5 text-[#3898EC]" aria-hidden="true" />
                <h3 className="text-base font-bold text-[#172B4D]">Compose Message</h3>
              </div>

              <form onSubmit={handleMailtoSubmit} noValidate className="space-y-4">
                {/* Name field */}
                <div>
                  <label
                    htmlFor="contact-name"
                    className="block text-xs font-semibold uppercase tracking-wider text-[#172B4D] mb-1"
                  >
                    Your Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                      if (errors.name) setErrors({ ...errors, name: undefined });
                    }}
                    placeholder="e.g., Alex Johnson"
                    className={`w-full rounded-xl border px-3.5 py-2.5 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#3898EC] ${
                      errors.name
                        ? 'border-rose-400 bg-rose-50/30'
                        : 'border-[#DCEAF7] bg-[#F8FBFF] focus:bg-white'
                    }`}
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? 'contact-name-error' : undefined}
                  />
                  {errors.name && (
                    <p id="contact-name-error" className="mt-1 text-xs text-rose-500">
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Email field */}
                <div>
                  <label
                    htmlFor="contact-email"
                    className="block text-xs font-semibold uppercase tracking-wider text-[#172B4D] mb-1"
                  >
                    Your Email <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      if (errors.email) setErrors({ ...errors, email: undefined });
                    }}
                    placeholder="alex@example.com"
                    className={`w-full rounded-xl border px-3.5 py-2.5 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#3898EC] ${
                      errors.email
                        ? 'border-rose-400 bg-rose-50/30'
                        : 'border-[#DCEAF7] bg-[#F8FBFF] focus:bg-white'
                    }`}
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? 'contact-email-error' : undefined}
                  />
                  {errors.email && (
                    <p id="contact-email-error" className="mt-1 text-xs text-rose-500">
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Subject field */}
                <div>
                  <label
                    htmlFor="contact-subject"
                    className="block text-xs font-semibold uppercase tracking-wider text-[#172B4D] mb-1"
                  >
                    Subject <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="contact-subject"
                    type="text"
                    value={formData.subject}
                    onChange={(e) => {
                      setFormData({ ...formData, subject: e.target.value });
                      if (errors.subject) setErrors({ ...errors, subject: undefined });
                    }}
                    placeholder="Inquiry regarding junior developer opportunity"
                    className={`w-full rounded-xl border px-3.5 py-2.5 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#3898EC] ${
                      errors.subject
                        ? 'border-rose-400 bg-rose-50/30'
                        : 'border-[#DCEAF7] bg-[#F8FBFF] focus:bg-white'
                    }`}
                    aria-invalid={Boolean(errors.subject)}
                    aria-describedby={errors.subject ? 'contact-subject-error' : undefined}
                  />
                  {errors.subject && (
                    <p id="contact-subject-error" className="mt-1 text-xs text-rose-500">
                      {errors.subject}
                    </p>
                  )}
                </div>

                {/* Message field */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label
                      htmlFor="contact-message"
                      className="block text-xs font-semibold uppercase tracking-wider text-[#172B4D]"
                    >
                      Message <span className="text-rose-500">*</span>
                    </label>
                    <span className="text-[11px] text-[#5B6B82]">
                      {formData.message.length} characters
                    </span>
                  </div>
                  <textarea
                    id="contact-message"
                    rows={4}
                    value={formData.message}
                    onChange={(e) => {
                      setFormData({ ...formData, message: e.target.value });
                      if (errors.message) setErrors({ ...errors, message: undefined });
                    }}
                    placeholder="Hello Alex, I came across your portfolio and wanted to reach out regarding..."
                    className={`w-full rounded-xl border px-3.5 py-2.5 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#3898EC] resize-none ${
                      errors.message
                        ? 'border-rose-400 bg-rose-50/30'
                        : 'border-[#DCEAF7] bg-[#F8FBFF] focus:bg-white'
                    }`}
                    aria-invalid={Boolean(errors.message)}
                    aria-describedby={errors.message ? 'contact-message-error' : undefined}
                  />
                  {errors.message && (
                    <p id="contact-message-error" className="mt-1 text-xs text-rose-500">
                      {errors.message}
                    </p>
                  )}
                </div>

                {/* Submit and Copy draft buttons */}
                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    className="flex-1"
                    icon={<Send className="h-4 w-4" aria-hidden="true" />}
                  >
                    Send via Email Client
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    size="md"
                    onClick={handleCopyFormattedDraft}
                    icon={
                      copiedMessage ? (
                        <Check className="h-4 w-4 text-emerald-600" aria-hidden="true" />
                      ) : (
                        <ExternalLink className="h-4 w-4" aria-hidden="true" />
                      )
                    }
                  >
                    {copiedMessage ? 'Draft Copied!' : 'Copy Draft'}
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        </div>
      </Container>
    </section>
  );
};
