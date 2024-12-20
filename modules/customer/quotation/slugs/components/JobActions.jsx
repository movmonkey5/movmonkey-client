import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ApiKit from "@/common/ApiKit";
import { useRouter, useSearchParams } from "next/navigation";

const JobActions = ({ job, onJobCompleted, userDetails }) => {
  const [isDisputeOpen, setIsDisputeOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [disputeType, setDisputeType] = useState("REFUND");
  const queryClient = useQueryClient();
  console.log("here", job);
  // Mutation for completing job
  const completeMutation = useMutation({
    mutationFn: () => ApiKit.me.updateStatus(job.uid, { status: "COMPLETED" }),
    onSuccess: () => {
      queryClient.invalidateQueries(["jobDetails", job.uid]);
      queryClient.invalidateQueries(["quotation", job.uid]);
      setIsConfirmOpen(false);
      onJobCompleted(); // Notify parent component
    },
  });

  // Mutation for submitting dispute
  const disputeMutation = useMutation({
    mutationFn: (disputeData) => ApiKit.me.postDispute(disputeData),
    onSuccess: () => {
      setIsDisputeOpen(false);
      queryClient.invalidateQueries(["jobDetails", job.uid]);
      queryClient.invalidateQueries(["quotation", job.uid]);
    },
  });

  const handleDisputeSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const disputeData = {
      title: formData.get("subject"),
      quotation: job.uid,
      body: formData.get("message"),
      kind: disputeType,
    };

    disputeMutation.mutate(disputeData);
  };
  const router = useRouter();
  const StartChatting = () => {
    router.push(`/message?name=${userDetails.full_name.split(" ").join("-")}`);
    console.log("Chatting with service provider");
  };

  return (
    <div className="flex w-full flex-col justify-between gap-8 md:flex-row">
      <Button
        size="lg"
        className=" w-full md:w-4/12"
        onClick={() => setIsConfirmOpen(true)}
      >
        Mark as Completed
      </Button>
      {/* Work need  */}
      <Button size="lg" className=" w-full md:w-4/12" onClick={StartChatting}>
        Chat With {userDetails.full_name}
      </Button>
      <Button
        size="lg"
        className=" w-full md:w-4/12"
        onClick={() => setIsDisputeOpen(true)}
      >
        Go to Dispute
      </Button>

      {/* Completion Confirmation Dialog */}
      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Confirm Job Completion</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-lg">
              Are you sure you want to mark{" "}
              <span className="font-bold">{job.title}</span> as completed?
              Please ensure all tasks have been completed satisfactorily.
            </p>
          </div>
          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={() => setIsConfirmOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => completeMutation.mutate()}
              disabled={completeMutation.isLoading}
            >
              {completeMutation.isLoading ? "Processing..." : "Confirm"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dispute Dialog */}
      <Dialog open={isDisputeOpen} onOpenChange={setIsDisputeOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Submit Dispute</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleDisputeSubmit} className="space-y-10 pt-4">
            <div>
              <Label className="ml-0" htmlFor="subject">
                Subject
              </Label>
              <Input
                id="subject"
                name="subject"
                type="text"
                className="rounded-none border-b-2 border-l-0 border-r-0 border-t-0 px-0 ring-offset-0 focus:border-secondary focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
                placeholder="Enter dispute subject"
                required
              />
            </div>

            <div>
              <Label className="ml-0">Dispute Type</Label>
              <Select value={disputeType} onValueChange={setDisputeType}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select dispute type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="REFUND">Refund</SelectItem>
                  <SelectItem value="QUALITY_ISSUE">Quality Issue</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="w-full">
              <Label className="ml-0" htmlFor="message">
                Message
              </Label>
              <Textarea
                id="message"
                name="message"
                className="h-32 min-h-32 rounded-none border-b-2 border-l-0 border-r-0 border-t-0 px-0 ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
                placeholder="Describe your dispute in detail..."
                required
              />
            </div>

            <div className="flex justify-center gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDisputeOpen(false)}
                className="px-8"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="px-8"
                disabled={disputeMutation.isLoading}
              >
                {disputeMutation.isLoading ? "Submitting..." : "Submit Dispute"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default JobActions;
