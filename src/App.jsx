import React, { useState } from "react";
import { supabase } from "./supabaseclient";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // 1) Insert in Supabase
    const { error } = await supabase.from("customerdata").insert([
      {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
      },
    ]);

    if (error) {
      setLoading(false);
      return alert("❌ Failed to save in Supabase: " + error.message);
    }

    // 2) Send Email via Vercel API route
    const emailRes = await fetch("/api/sendEmail", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const emailData = await emailRes.json();

    setLoading(false);

    if (!emailData.success) {
      return alert(
        "⚠️ Saved in DB but failed to send email: " + emailData.error
      );
    }

    alert("✅ Data saved & Email sent!");

    // Reset form
    setFormData({ name: "", email: "", phone: "", message: "" });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="name"
        placeholder="Name"
        value={formData.name}
        onChange={handleChange}
        required
      />
      <input
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        required
      />
      <input
        name="phone"
        placeholder="Phone"
        value={formData.phone}
        onChange={handleChange}
        required
      />
      <textarea
        name="message"
        placeholder="Message"
        value={formData.message}
        onChange={handleChange}
        required
      ></textarea>

      <button type="submit" disabled={loading}>
        {loading ? "Sending..." : "Submit"}
      </button>
    </form>
  );
}
