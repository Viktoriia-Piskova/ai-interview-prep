"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import FormField from "@/components/FormField";
import { auth } from "@/firebase/client";
import { signIn, signUp } from "@/lib/actions/auth.action";

const authFormSchema = (type: FormType) => {
  return z.object({
    name:
      type === "sign-up"
        ? z.string().min(3, { message: "Name must be at least 3 characters" })
        : z.string().optional(),
    email: z.email({ message: "Please enter a valid email" }),
    password: z
      .string()
      .min(5, { message: "Password must be at least 3 characters" }),
  });
};

const AuthForm = ({ type }: { type: FormType }) => {
  const router = useRouter();
  const isSignIn = type === "sign-in";
  const formSchema = authFormSchema(type);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (type === "sign-up") {
        const { name, email, password } = values;
        const userCredentials = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        const result = await signUp({
          uid: userCredentials.user.uid,
          name: name!,
          email,
          password,
        });

        if (!result?.success) {
          console.log(result?.message)
          toast.error(result?.message);
          return;
        }

        toast.success("Account created successfully. Please sign in");
        router.push("/sign-in");
      } else {
        const { email, password } = values;
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

        const idToken = await userCredential.user.getIdToken();

        if (!idToken) {
          toast.error("Sign in failed");
          return;
        }
        await signIn({ email, idToken });

        toast.success("Signed in successfully");
        router.push("/");
      }
    } catch (error) {
      console.log(error);
      toast.error(`There was an error ${error}`);
    }
  }

  return (
    <div className="card-border lg:min-w-[566px]">
      <div className="flexflex-col gap-6 card py-14 px-10">
        <div className="flex flex-row gap-2 justify-center">
          <Image src="/logo.svg" alt="Logo" height={32} width={38} />
          <h2 className="text-primary-100">AI Interview</h2>
        </div>
        <h3 className="text-center">Practice with AI</h3>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6 mt-4 form"
          >
            {!isSignIn && (
              <FormField
                type="text"
                control={form.control}
                label="Name"
                name="name"
                placeholder="Your name"
                error={form.formState.errors.name?.message?.toString()}
              />
            )}
            <FormField
              type="email"
              control={form.control}
              label="Email"
              name="email"
              placeholder="Your email address"
              error={form.formState.errors.email?.message?.toString()}
            />
            <FormField
              type="password"
              control={form.control}
              label="Password"
              name="password"
              placeholder="Your password"
              error={form.formState.errors.password?.message?.toString()}
            />
            <Button type="submit" className="btn">
              {isSignIn ? "Sign in" : "Creata an account"}
            </Button>
          </form>
        </Form>
        <p className="text-center py-3">
          {!isSignIn ? "Already have an account?" : "Create an account"}
          <Link
            href={!isSignIn ? "/sign-in" : "/sign-up"}
            className="font-bold text-user-primary ml-1"
          >
            {!isSignIn ? "Sign in" : "Sign up"}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
