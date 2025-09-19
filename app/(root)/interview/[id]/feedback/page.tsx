import { getCurrentUser } from "@/lib/actions/auth.action";
import {
  getFeedbackInterviewById,
  getInterviewById,
} from "@/lib/actions/general.action";
import { redirect } from "next/navigation";
import React, { use } from "react";

const Page = async ({ params }: RouteParams) => {
  const { id } = await params;
  const user = await getCurrentUser();
  const interview = getInterviewById(id);
  if (!interview) redirect("/");
  const feedback = await getFeedbackInterviewById({
    interviewId: id,
    userId: user?.id!,
  });

  console.log(feedback)
  return <div>page {id} {feedback?.totalScore}</div>;
};

export default Page;
