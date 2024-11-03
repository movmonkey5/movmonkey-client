import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import ApiKit from "@/common/ApiKit";

const ReviewDialog = ({
  isOpen,
  onOpenChange,
  jobUid,
  jobkind,
  userDetails,
}) => {
  const [rating, setRating] = useState(0);
  const queryClient = useQueryClient();

  const reviewMutation = useMutation({
    mutationFn: (reviewData) => ApiKit.me.postReview(reviewData),
    onSuccess: () => {
      onOpenChange(false);
      queryClient.invalidateQueries(["jobDetails", jobUid]);
      queryClient.invalidateQueries(["quotation", jobUid]);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const reviewData = {
      kind: jobkind,
      rating: rating,
      job_uid: jobUid,
      description: formData.get("description"),
    };

    reviewMutation.mutate(reviewData);
  };
  console.log(userDetails);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-center mb-4">Submit Review</DialogTitle>
          <h5 className="my-8 text-2xl">
            How was the experience with{" "}
            <span className="font-bold"> {userDetails?.full_name}</span>
          </h5>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label>Rating</Label>
            <div className="flex gap-2 py-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`text-2xl ${
                    star <= rating ? "text-yellow-400" : "text-gray-300"
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Share your experience..."
              required
            />
          </div>
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={reviewMutation.isLoading || !rating}
            >
              {reviewMutation.isLoading ? "Submitting..." : "Submit Review"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewDialog;
