"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Container from "@/components/shared/Container";
import { Input } from "@/components/ui/input";
import { useQuery, useMutation } from "@tanstack/react-query";
import ApiKit from "@/common/ApiKit";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import useStore from "@/store";
import { useSearchParams } from "next/navigation";

export default function CleanerMessagePage() {
  const { user } = useStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [messageContent, setMessageContent] = useState("");
  const [messageDetails, setMessageDetails] = useState([]);
  const currentUserUid = user.uid; // Replace with actual current user UID
  const searchParams = useSearchParams();
  const name = searchParams.get("name");
  const {
    data: messages,
    isLoading: isMessagingLoading,
    refetch: refetchMessages,
  } = useQuery({
    queryKey: ["me/inbox"],
    queryFn: () => ApiKit.me.getMessages().then(({ data }) => data),
  });

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

  const handleUserClick = (message) => {
    console.log("clicked", message);
    setSelectedMessage(message);
    fetchMessageDetails(message.uid); // Fetch detailed messages when a message is selected
  };

  const handleSendMessage = () => {
    sendMessageMutation.mutate({ content: messageContent });
  };

  useEffect(() => {
    if (name && messages?.results) {
      const matchingMessage = messages.results.find(
        (msg) => msg.target.full_name.split(" ").join("-") === name,
      );
      if (matchingMessage) {
        handleUserClick(matchingMessage);
      }
    }
  }, [name, messages]);

  const baseUrl = "https://backend.movmonkey.com/";

  return (
    <div className="min-h-[calc(100vh-60px)] bg-black/10 lg:min-h-[calc(100vh-80px)]">
      {/* Header */}
      <div className="bg-primary py-4 text-lg font-semibold text-black lg:mt-10 lg:py-6 lg:text-2xl">
        <div className="mx-auto max-w-7xl px-4 text-center lg:text-left">
          <h3>Message Box</h3>
        </div>
      </div>

      <Container>
        <div className="mx-auto mt-6 flex h-[80vh] max-w-7xl flex-col overflow-hidden rounded-lg bg-white shadow-md lg:mt-10 lg:flex-row">
          {/* Sidebar (User List) */}
          <div className="w-full flex-shrink-0 bg-primary p-4 lg:w-1/3">
            <div className="mb-4">
              <Input
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-white text-gray-600"
              />
            </div>
            <ul className="h-[60vh] overflow-y-auto">
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
                    className={`mb-4 flex cursor-pointer items-center gap-3 p-2 ${
                      selectedMessage?.uid === msg.uid
                        ? "rounded-xl bg-gray-700"
                        : ""
                    }`}
                  >
                    <img
                      src={
                        msg.target.avatar?.at350x350
                          ? baseUrl + msg.target.avatar.at350x350
                          : "https://frontend.movmonkey.com/image/user-placeholder-green.png"
                      }
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
                <div className="mb-2 flex items-center gap-4 border-b pb-2 lg:pb-4">
                  <img
                    src={
                      selectedMessage.target.avatar?.at350x350
                        ? baseUrl + selectedMessage.target.avatar.at350x350
                        : "https://frontend.movmonkey.com/image/user-placeholder-green.png"
                    }
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
                <div className="flex-grow space-y-4 overflow-y-auto p-4">
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
        <Link href="/profile" className="mt-10 flex justify-center">
          <Button size="lg" className="mt-10 w-full max-w-xs" color="primary">
            <span className="m-2">Back</span>
          </Button>
        </Link>
      </Container>
    </div>
  );
}
