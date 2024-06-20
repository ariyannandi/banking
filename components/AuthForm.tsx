"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import FormFields from "./FormFields";
import { authFormSchema } from "@/lib/utils";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { getLoggedInUser, signIn, signUp } from "@/lib/actions/user.actions";

const AuthForm = ({ type }: { type: string }) => {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const formSchema = authFormSchema(type);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      // Sign Up with Appwrite and create a plaid token

      if (type === "sign-up") {
        const newUser = await signUp(data);
        setUser(newUser);
      }

      if (type === "sign-in") {
        const res = await signIn({
          email: data.email,
          password: data.password,
        });
        if (res) {
          router.push("/");
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="auth-form">
      <header className="flex flex-col gap-5 md:gap-8">
        <Link href="/" className="flex cursor-pointer items-center gap-1 ">
          <Image
            src="/icons/logo.svg"
            width={34}
            height={34}
            alt=" Horizon logo"
          />
          <h1 className="text-26 font-ibm-plex-serif font-bold">Horizon</h1>
        </Link>
        <div className="flex flex-col gap-1 md:gap-3">
          <h1 className="text-24 lg:text-36 font-semibold text-gray-900">
            {user ? "Link Account" : type === "sign-in" ? "Sign-in" : "Sign-up"}
            <p className="text-16 font-normal text-gray-600">
              {user
                ? "Link your account to get started"
                : "Please enter your details"}
            </p>
          </h1>
        </div>
      </header>
      {user ? (
        <div className="flex flex-col gap-4">{/* PlaidLink */}</div>
      ) : (
        <>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {type === "sign-up" && (
                <>
                  <div className="flex gap-4">
                    <FormFields
                      control={form.control}
                      name="firstName"
                      label="First Name"
                      placeholder="ex: Sundar"
                    />
                    <FormFields
                      control={form.control}
                      name="lastName"
                      label="Last Name"
                      placeholder="ex: Das"
                    />
                  </div>

                  <FormFields
                    control={form.control}
                    name="address1"
                    label="Address"
                    placeholder="Enter your address"
                  />

                  <FormFields
                    control={form.control}
                    name="city"
                    label="City"
                    placeholder="ex: Silchar"
                  />

                  <div className="flex gap-4">
                    <FormFields
                      control={form.control}
                      name="state"
                      label="State"
                      placeholder="ex: Assam"
                    />
                    <FormFields
                      control={form.control}
                      name="postalCode"
                      label="Postal Code"
                      placeholder="788001"
                    />
                  </div>

                  <div className="flex gap-4">
                    <FormFields
                      control={form.control}
                      name="dateOfBirth"
                      label="Date Of Birth"
                      placeholder="yyyy-mm-dd"
                    />
                    <FormFields
                      control={form.control}
                      name="ssn"
                      label="SSN"
                      placeholder="ex: 1234"
                    />
                  </div>
                </>
              )}

              <FormFields
                control={form.control}
                name="email"
                label="Email"
                placeholder="Enter your email"
              />
              <FormFields
                control={form.control}
                name="password"
                label="Password"
                placeholder="Enter your password"
              />

              <div className="flex flex-col gap-4">
                <Button type="submit" disabled={isLoading} className="form-btn">
                  {isLoading ? (
                    <>
                      <Loader size={20} className="animate-spin" />
                    </>
                  ) : type === "sign-in" ? (
                    "Sign In"
                  ) : (
                    "Sign up"
                  )}
                </Button>
              </div>
            </form>
          </Form>
          <footer className="flex justify-center gap-1">
            <p className="text-14 font-normal text-gray-600">
              {type === "sign-in"
                ? "Don't have an account?"
                : "Already have an account?"}
            </p>
            <Link
              href={type === "sign-in" ? "/sign-up" : "sign-in"}
              className="form-link"
            >
              {type === "sign-in" ? "Sign Up" : "Sign In"}
            </Link>
          </footer>
        </>
      )}
    </section>
  );
};

export default AuthForm;
