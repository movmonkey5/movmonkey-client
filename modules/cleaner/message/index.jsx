"use client";

import { use, useState } from "react";
import Container from "@/components/shared/Container";
import { Input } from "@/components/ui/input";
import { useQuery, useMutation } from "@tanstack/react-query";
import ApiKit from "@/common/ApiKit";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import useStore from "@/store";

export default function CleanerMessagePage() {
  const { user } = useStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [messageContent, setMessageContent] = useState("");
  const [messageDetails, setMessageDetails] = useState([]);
  const currentUserUid = user.uid; // Replace with actual current user UID

  const {
    data: messages,
    isLoading: isMessagingLoading,
    refetch: refetchMessages,
  } = useQuery({
    queryKey: ["me/inbox"],
    queryFn: () => ApiKit.me.getMessages().then(({ data }) => data),
  });
  const User = messages?.results.map((message) => message.user);

  const sendMessageMutation = useMutation({
    mutationFn: (payload) => {
      if (selectedMessage) {
        return ApiKit.me.postMessage(selectedMessage.uid, payload);
      }
    },
    onSuccess: () => {
      refetchMessages();
      fetchMessageDetails(selectedMessage.uid); // refetch detailed messages after sending
      setMessageContent(""); // clear input after sending message
    },
  });

  const fetchMessageDetails = (uid) => {
    ApiKit.me
      .getMessageDetails(uid)
      .then(({ data }) => setMessageDetails(data.results.reverse()));
  };
  console.log(messageDetails);
  const handleUserClick = (message) => {
    setSelectedMessage(message);
    fetchMessageDetails(message.uid); // Fetch detailed messages when a message is selected
  };

  const handleSendMessage = () => {
    sendMessageMutation.mutate({ content: messageContent });
  };

  const baseUrl = "https://backend.movmonkey.com/";

  return (
    <div className="min-h-[calc(100vh-60px)] bg-black/10 lg:min-h-[calc(100vh-80px)]">
      {/* Header */}
      <div className="bg-primary text-2xl font-semibold text-black md:text-2xl lg:mt-10">
        <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between px-4 md:h-20">
          <h3>Message Box</h3>
        </div>
      </div>

      <Container>
        <div className="mx-auto mt-10 flex h-[80vh] max-w-7xl flex-col overflow-hidden rounded-lg bg-white shadow-md lg:flex-row">
          {/* Sidebar (User List) */}
          <div className="w-full bg-primary p-4 lg:w-1/3">
            <div className="mb-4">
              <Input
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-green-600 text-white"
              />
            </div>
            <ul>
              {messages?.results
                ?.filter((msg) =>
                  msg.target.full_name
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()),
                )
                .map((msg) => (
                  <li
                    key={msg.uid}
                    onClick={() => handleUserClick(msg)}
                    className="mb-4 flex cursor-pointer items-center gap-3"
                  >
                    <img
                      src={baseUrl + msg.target.avatar.at350x350}
                      alt={msg.target.full_name}
                      className="h-10 w-10 rounded-full"
                    />
                    <div>
                      <p className="text-white">{msg.target.full_name}</p>
                      <p className="text-xs text-gray-300">
                        {msg.last_message?.content}
                      </p>
                    </div>
                  </li>
                ))}
            </ul>
          </div>

          {/* Chat Window */}
          <div className="flex w-full flex-col bg-white p-4 lg:w-2/3">
            {selectedMessage ? (
              <>
                {/* Chat Header */}
                <div className="flex items-center gap-4 border-b pb-2">
                  <img
                    src={baseUrl + selectedMessage.target.avatar.at350x350}
                    alt={selectedMessage.user.full_name}
                    className="h-10 w-10 rounded-full"
                  />
                  <div>
                    <h4 className="text-lg font-semibold">
                      {selectedMessage.target.full_name}
                    </h4>
                  </div>
                </div>

                {/* Chat Messages */}
                <div className="flex-grow overflow-y-auto p-4">
                  <h1 className="mb-6 rounded-lg bg-gray-600 p-4 text-center text-white">
                    {messageDetails[0]?.content}
                  </h1>
                  {messageDetails.length > 0 ? (
                    messageDetails.slice(1).map((detail) => (
                      <div
                        key={detail.uid}
                        className={`mb-4 flex ${
                          detail.author?.uid === currentUserUid
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <p
                          className={`mb-2 inline-block rounded-lg p-3 ${
                            detail.author?.uid === currentUserUid
                              ? "bg-green-600 text-white"
                              : "bg-gray-200 text-black"
                          }`}
                        >
                          {detail.content}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-500">
                      No messages to display.
                    </p>
                  )}
                </div>

                {/* Message Input */}
                <div className="flex items-center gap-3 border-t p-3">
                  <Input
                    placeholder="Add a comment..."
                    value={messageContent}
                    onChange={(e) => setMessageContent(e.target.value)}
                    className="flex-grow rounded-full bg-gray-200 px-4 py-2"
                  />
                  <button
                    onClick={handleSendMessage}
                    className="rounded-full bg-green-600 px-4 py-2 text-white"
                  >
                    Send
                  </button>
                </div>
              </>
            ) : (
              <p className="my-12 text-center text-xl text-gray-500">
                Select a message to start chatting
              </p>
            )}
          </div>
        </div>
        <Link href="/cleaner/profile" className="mt-10">
          <Button className="mt-10" size="lg" color="primary">
            <span className="m-2">Back</span>
          </Button>
        </Link>
      </Container>
    </div>
  );
}
