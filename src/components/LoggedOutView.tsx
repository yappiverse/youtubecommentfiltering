"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { oauthSchema } from "@/schemas/oauthSchema";

type Status = { type: "error" | "success"; message: string } | null;

export default function LoggedOutView() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<Status>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = event.target.files?.[0] ?? null;
      setFile(selectedFile);
      setStatus(null);
    },
    []
  );

  const validateFileType = (file: File) => {
    if (!file.name.toLowerCase().endsWith(".json")) {
      const msg = "Please upload a file with a .json extension.";
      setStatus({ type: "error", message: msg });
      toast.error("Invalid file type. Only .json files are accepted.");
      return false;
    }
    return true;
  };

  const readFileAsync = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error("Error reading file"));
      reader.readAsText(file);
    });
  };

  const parseAndValidateJsonFile = useCallback(async (file: File) => {
    if (!validateFileType(file)) return;

    setIsProcessing(true);
    setStatus(null);

    try {
      const content = await readFileAsync(file);
      const json = JSON.parse(content);
      const parseResult = oauthSchema.safeParse(json);

      if (!parseResult.success) {
        const zodError = parseResult.error.errors[0];
        const message = zodError.message || "Invalid JSON schema.";
        setStatus({ type: "error", message });
        toast.error(`The selected file is not a valid Google OAuth JSON file`);
        setIsProcessing(false);

        return;
      }
      localStorage.setItem("isLogin", "true");
      localStorage.setItem("oauthData", JSON.stringify(parseResult.data));

      setStatus({ type: "success", message: "JSON validated successfully." });
      toast.success("Successfully parsed JSON file.");
      window.dispatchEvent(new Event("localStorageChange"));
    } catch (error) {
      const msg = "The selected file is not a valid Google OAuth JSON file.";
      console.error(error);
      setStatus({ type: "error", message: msg });
      toast.error(msg);
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const handleLoginClick = useCallback(() => {
    if (!file) {
      const msg = "Please select a JSON file first.";
      setStatus({ type: "error", message: msg });
      toast(msg, { description: msg });
      return;
    }
    parseAndValidateJsonFile(file);
  }, [file, parseAndValidateJsonFile]);

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md shadow-xl rounded-2xl">
        <CardHeader className="text-center px-6 pt-8">
          <CardTitle className="text-3xl font-bold">Welcome Back</CardTitle>
          <CardDescription className="text-muted-foreground mt-2">
            Upload your OAuth 2.0 client JSON to continue.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 px-6 pb-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="json-upload" className="text-sm font-medium">
              JSON File
            </Label>
            <Input
              id="json-upload"
              type="file"
              accept=".json,application/json"
              onChange={handleFileChange}
              aria-invalid={status?.type === "error"}
              aria-describedby={status ? "file-status" : undefined}
              className={`cursor-pointer border min-h-12 border-border bg-background hover:border-primary focus-visible:ring-1 focus-visible:ring-primary ${
                status?.type === "error"
                  ? "border-red-500 focus-visible:ring-red-500"
                  : ""
              }`}
              disabled={isProcessing}
            />
            {status && (
              <p
                id="file-status"
                role={status.type === "error" ? "alert" : undefined}
                className={`text-sm ${
                  status.type === "error" ? "text-red-500" : "text-green-600"
                }`}
              >
                {status.message}
              </p>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-4 px-6 pb-8">
          <Button
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
            onClick={handleLoginClick}
            disabled={!file || isProcessing}
            aria-disabled={!file || isProcessing}
          >
            {isProcessing ? "Processing..." : "Login with Google"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
