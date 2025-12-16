"use client"

import { Toaster } from "react-hot-toast"

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: "#333",
          color: "#fff",
          border: "1px solid #444"
        },
        success: {
          style: {
            background: "#1c1c1c",
            border: "1px solid #D4AF37",
            color: "#fff"
          },
          iconTheme: {
            primary: "#D4AF37",
            secondary: "#1c1c1c"
          }
        },
        error: {
          style: {
            background: "#1c1c1c",
            border: "1px solid #ef4444",
            color: "#fff"
          },
          iconTheme: {
            primary: "#ef4444",
            secondary: "#1c1c1c"
          }
        },
        loading: {
          style: {
            background: "#1c1c1c",
            border: "1px solid #3b82f6",
            color: "#fff"
          }
        }
      }}
    />
  )
} 