import React from "react";
import { Avatar, AvatarImage } from "../ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";

const Watchers = ({ watchers }) => {
  return (
    <div className="bg-card rounded-lg p-6 shadow-sm mb-6">
      <h3 className="text-lg font-medium mb-4">Watchers</h3>

      <div className="space-y-2">
        {watchers && watchers .length > 0 ? (
            watchers.map((watcher) => {
                <div key={watcher._id} className="flex items-center gap-2">
                    <Avatar>
                        <AvatarImage src={watcher.profilePicture} />
                        <AvatarFallback>{watcher.name.charAt(0)}</AvatarFallback>
                    </Avatar>

                    <p className="text-sm">{watcher.name}</p>
                </div>
            })
        ) : (
            <p className="text-sm font-semibold text-center">No Watchers</p>
        )}
      </div>
    </div>
  );
};

export default Watchers;
