"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface UrlModalProps {
  onSubmit: (url: string) => void;
}

export const UrlModal = ({ onSubmit }: UrlModalProps) => {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    try {
      new URL(url); // Validate URL
      onSubmit(url);
    } catch {
      setError("Invalid URL. Please enter a valid URL.");
    }
  };

  return (
    <Dialog open>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enter URL to Start Chat</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input 
            placeholder="Enter website URL" 
            value={url} 
            onChange={(e) => { setUrl(e.target.value); setError(""); }} 
            autoFocus
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button onClick={handleSubmit} className="w-full">
            Start Chat
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};



