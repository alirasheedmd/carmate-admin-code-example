import ListingMembers from "@/components/members/ListingMembers";
import Topbar from "@/components/members/Topbar";
import React from "react";

interface Props {}

function Page(props: Props) {
  const {} = props;

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <Topbar />
      <ListingMembers />
    </div>
  );
}

export default Page;
