import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";

type ContactFormData = {
  name: string;
  email: string;
  message: string;
};

export default function Contact() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const url = import.meta.env.VITE_REACT_APP_GOOGLE_FORM_URL;

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending...");
    setLoading(true);

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(formData),
      });

      if (navigator.sendBeacon) {
        const blob = new Blob([JSON.stringify(formData)], {
          type: "text/plain",
        });
        navigator.sendBeacon(url, blob);
      }

      if (res.ok) {
        setStatus("message sent!");
        setFormData({ name: "", email: "", message: "" });
      } else {
        setStatus("error sending message.");
      }
    } catch (err) {
      console.error("error:", err);
      setStatus("error sending message.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="contact-wrapper">
        <div className="contact-header">
          <h1 className="contact-title">Let's Work.</h1>
          <p className="secondary-contact">Or chat.</p>
          <p className="tertiary-contact">... or coffee, your call</p>
        </div>

        <div className="contact-form">
          <h2 className="form-title">Contact Me</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <textarea
              className="on-mind"
              name="message"
              placeholder="What's on your mind?"
              value={formData.message}
              onChange={handleChange}
              required
            />
            <button className="contact-submit" type="submit">
              Send
            </button>
          </form>

          {loading && <div className="spinner">⏳ Sending...</div>}
          {!loading && status && <p>{status}</p>}
        </div>
      </div>
    </>
  );
}
