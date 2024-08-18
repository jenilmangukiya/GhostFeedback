"use client";

import MessageCard from "@/components/MessageCard";

const Page = () => {
  return (
    <div className="container my-4 grid grid-cols-2 gap-4">
      <MessageCard />
      <MessageCard />
      <MessageCard />
      <MessageCard />
      <MessageCard />
    </div>
  );
};

export default Page;
