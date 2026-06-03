import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { ChatbotWidget } from "../components/chatbot/ChatbotWidget";

export default function AppLayout({ children }) {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="layout-main">{children}</main>
      <Footer />
      <ChatbotWidget />
    </div>
  );
}