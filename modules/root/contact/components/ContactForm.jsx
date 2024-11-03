"use client";

import CheckIcon from "@/components/icon/CheckIcon";
import Dot from "@/components/icon/Dot";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

export default function ContactForm() {
  const [inquiry, setInquiry] = useState("technical");

  return (
    <form className="mx-auto max-w-4xl space-y-10 px-5 pb-20 pt-10">
      <div className="flex flex-col items-center justify-between gap-10 md:flex-row">
        <div className="w-full md:w-1/2">
          <Label className="ml-0" htmlFor="first_name">
            First Name
          </Label>
          <Input
            id="first_name"
            type="text"
            className="rounded-none border-b-2 border-l-0 border-r-0 border-t-0 px-0 ring-offset-0 focus:border-secondary focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
            placeholder="Enter your first name"
          />
        </div>
        <div className="w-full md:w-1/2">
          <Label className="ml-0" htmlFor="last_name">
            Last Name
          </Label>
          <Input
            id="last_name"
            type="text"
            className="rounded-none border-b-2 border-l-0 border-r-0 border-t-0 px-0 ring-offset-0 focus:border-secondary focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
            placeholder="Enter your last name"
          />
        </div>
      </div>

      <div className="flex flex-col items-center justify-between gap-10 md:flex-row">
        <div className="w-full md:w-1/2">
          <Label className="ml-0" htmlFor="email">
            Email
          </Label>
          <Input
            id="email"
            type="text"
            className="rounded-none border-b-2 border-l-0 border-r-0 border-t-0 px-0 ring-offset-0 focus:border-secondary focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
            placeholder="Enter your email"
          />
        </div>
        <div className="w-full md:w-1/2">
          <Label className="ml-0" htmlFor="phone">
            Phone Number
          </Label>
          <Input
            id="phone"
            type="text"
            className="rounded-none border-b-2 border-l-0 border-r-0 border-t-0 px-0 ring-offset-0 focus:border-secondary focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
            placeholder="Enter your phone number"
          />
        </div>
      </div>

      <div>
        <Label className="ml-0" htmlFor="subject">
          Select Subject?
        </Label>

        <div className="mt-4 flex items-center gap-4">
          <Label
            htmlFor="inquiry"
            className="flex cursor-pointer items-center gap-1"
            onClick={() => setInquiry("technical")}
          >
            {inquiry === "technical" ? (
              <CheckIcon className="h-4 w-4" />
            ) : (
              <Dot className="h-4 w-4" />
            )}

            <p>Technical Inquiry</p>
          </Label>
          <Label
            htmlFor="inquiry"
            className="flex cursor-pointer items-center gap-1"
            onClick={() => setInquiry("normal")}
          >
            {inquiry === "normal" ? (
              <CheckIcon className="h-4 w-4" />
            ) : (
              <Dot className="h-4 w-4" />
            )}

            <p>Normal Inquiry</p>
          </Label>
        </div>
      </div>

      <div className="w-full">
        <Label className="ml-0" htmlFor="message">
          Message
        </Label>
        <Textarea
          id="message"
          type="text"
          className="h-10 min-h-10 rounded-none border-b-2 border-l-0 border-r-0 border-t-0 px-0 ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
          placeholder="Write your message..."
        />
      </div>

      <div className="flex justify-center">
        <Button type="submit" className="px-20 text-black">
          Submit
        </Button>
      </div>
    </form>
  );
}
