import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";

type ContactFormData = {
  name: string;
  email: string;
  message: string;
};

type Status = "idle" | "sent" | "failed";

const EMPTY_FORM: ContactFormData = { name: "", email: "", message: "" };

const url = import.meta.env.VITE_REACT_APP_GOOGLE_FORM_URL;

/*
  the endpoint is reliable but slow, so waiting on its response just makes people
  think nothing happened. sendBeacon hands the payload to the browser instead:
  once it's queued, delivery is the browser's job and survives closing the tab.
  a truthy return means it's queued, which is enough to confirm to the sender.
*/
function queueMessage(payload: ContactFormData) {
  if (!url) return false;

  const body = JSON.stringify(payload);

  if (navigator.sendBeacon) {
    const blob = new Blob([body], { type: "text/plain;charset=utf-8" });
    if (navigator.sendBeacon(url, blob)) return true;
  }

  try {
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body,
      keepalive: true,
    }).catch(() => {});
    return true;
  } catch {
    return false;
  }
}

export default function Contact() {
  const [formData, setFormData] = useState<ContactFormData>(EMPTY_FORM);
  const [status, setStatus] = useState<Status>("idle");
  const [sentTo, setSentTo] = useState("");
  const resetTimer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(resetTimer.current), []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!navigator.onLine || !queueMessage(formData)) {
      setStatus("failed");
      return;
    }

    setSentTo(formData.email);
    setFormData(EMPTY_FORM);
    setStatus("sent");
    resetTimer.current = window.setTimeout(() => setStatus("idle"), 12000);
  };

  const sendAnother = () => {
    window.clearTimeout(resetTimer.current);
    setStatus("idle");
  };

  return (
    <div className="tab-wrapper contact-wrapper">
      <header className="contact-header">
        <h1 className="contact-title">Let's Work.</h1>
        <p className="contact-subtitle">Or chat.</p>
        <p className="contact-subtitle-alt">... or coffee, your call</p>
      </header>

      <div className="contact-card">
        {status === "sent" ? (
          <div className="contact-sent" role="status">
            <svg
              className="contact-sent-mark"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="11" />
              <path d="M7 12.5l3.2 3.2L17 9" />
            </svg>

            <h2 className="contact-sent-title">Message sent</h2>
            <p className="contact-sent-text">
              {sentTo ? (
                <>
                  I'll get back to you at <strong>{sentTo}</strong>, usually
                  within a day or two.
                </>
              ) : (
                <>I'll get back to you, usually within a day or two.</>
              )}
            </p>

            <button
              type="button"
              className="contact-secondary"
              onClick={sendAnother}
            >
              Send another
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <label className="field">
              <span className="field-label">Name</span>
              <input
                type="text"
                name="name"
                autoComplete="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </label>

            <label className="field">
              <span className="field-label">Email</span>
              <input
                type="email"
                name="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </label>

            <label className="field">
              <span className="field-label">Message</span>
              <textarea
                name="message"
                rows={6}
                placeholder="What's on your mind?"
                value={formData.message}
                onChange={handleChange}
                required
              />
            </label>

            <button className="contact-submit" type="submit">
              Send message
            </button>

            {status === "failed" && (
              <p className="contact-error" role="alert">
                That didn't go through — check your connection and try again, or
                reach me on{" "}
                <a
                  href="https://ca.linkedin.com/in/adammeddah"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkedIn
                </a>
                .
              </p>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
