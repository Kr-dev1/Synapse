import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import GithubButton from "./GithubButton";
import GoogleButton from "./GoogleButton";
import Image from "next/image";

const LoginPage = () => {
  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <Card className="w-full max-w-md md:max-w-lg">
        <CardHeader>
          <div className="flex flex-col items-center text-center gap-3 w-full">
            <div className="flex items-center justify-center">
              <Image src={"/logo.svg"} alt="Logo" width={102} height={102} />
            </div>
            <div className="text-left">
              <CardTitle className="text-2xl">Sign in</CardTitle>
              <CardDescription className="text-sm text-neutral-400">
                Choose one of the options below to access your workspace.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <GoogleButton />
            <GithubButton />
          </div>
        </CardContent>
      </Card>
    </main>
  );
};

export default LoginPage;
