import { useState } from "react";

import Navbar from "../Navbar";
export default function Contact({ user, setCurrentTab }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [status, setStatus] = useState("");

  const [loading, setLoading] = useState(false); // spinner state

  //  .env variable starts with VITE
  const url = import.meta.env.VITE_REACT_APP_GOOGLE_FORM_URL;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Sending...");
    setLoading(true);

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain;charset=utf-8", // FormEasy expects utf 8
        },
        body: JSON.stringify(formData),
      });

      //send even if page unloading
      if (navigator.sendBeacon) {
        const blob = new Blob([JSON.stringify(formData)], {
          type: "text/plain",
        });
        navigator.sendBeacon(url, blob);
      }

      // FormEasy might return an empty response, so will just check res.ok
      if (res.ok) {
        setStatus("Message sent!");
        setFormData({ name: "", email: "", message: "" });
      } else {
        setStatus("Error sending message.");
      }
    } catch (err) {
      console.error("Error:", err);
      setStatus("Error sending message.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <Navbar
        user={user}
        setCurrentTab={setCurrentTab}
        sectionClass={"contact-navbar"}
      />

      <div className="contact-wrapper">
        <div className="contact-form">
          <h2>Contact Me</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Your name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <textarea
              name="message"
              placeholder="Your message"
              value={formData.message}
              onChange={handleChange}
              required
            />
            <button type="submit">Send</button>
          </form>
          {loading && <div className="spinner">⏳ Sending...</div>}
          {!loading && status && <p>{status}</p>}
        </div>
      </div>
    </>
  );
}
