"use client";
import { useCallback, useEffect, useState } from "react";
import { cn } from "@/utils/cn";
import { copyToClipboardOnClient } from "@/utils/copy-to-clipboard-on-client";
import Instruction from "./Instruction";
import Button from "./ui/Button";
import Toast from "./ui/Toast";

const GetYourImgShields = () => {
  const [skill, setSkill] = useState("");
  const [imgShield, setImgShield] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    if (skill) {
      setIsLoading(true);
      fetchShield(skill);
    }
  };

  const fetchShield = useCallback(async (lib: string) => {
    try {
      const response = await fetch(
        `/api/get-shield?lib=${encodeURIComponent(lib)}`
      );
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      setImgShield(data.markdown);
      setError("");
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error fetching img shield:", error.message);
        setError(error.message);
      } else {
        console.error("Error fetching img shield:", error);
        setError("An unknown error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!skill) {
      setError("");
    }
  }, [skill]);

  return (
    <form onSubmit={onSubmit} className="w-full flex flex-col gap-8">
      <div className="w-full flex flex-col sm:flex-row gap-3 items-center sm:items-start -mx-1">
        <input
          type="text"
          placeholder="Enter the name of the skill"
          className="flex-1 min-w-0 w-full max-w-sm sm:max-w-md px-4 py-2 border border-gray-300 rounded-md"
          value={skill}
          onChange={(e) => setSkill(e.target.value)}
        />
        <div
          className={cn(
            isLoading ? "animate-pulse" : "",
            "flex justify-center"
          )}
        >
          <Button type="submit" disabled={!skill || isLoading}>
            {isLoading ? "Loading..." : skill ? "Get Img Shield" : "🤔"}
          </Button>
        </div>
      </div>

      <Instruction />

      {error && (
        <p className="mt-2 text-sm text-center text-red-500">{error}</p>
      )}
      {imgShield && (
        <div className="flex flex-col m-6 p-8 shadow-md rounded-md border border-gray-300 gap-8">
          <a
            className="flex items-center justify-center"
            href={imgShield.split("(")[1].split(")")[0]}
            target="_blank"
            type="button"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imgShield.split("(")[1].split(")")[0]}
              alt="Skill Shield"
            />
          </a>

          <div className="flex gap-2">
            <div className="text-xs flex-1 bg-gray-100 dark:bg-gray-800 flex justify-center items-center rounded-md p-4 break-all">
              {imgShield}
            </div>
            <Button
              disabled={isCopied}
              onClick={() => {
                copyToClipboardOnClient(imgShield);
                setIsCopied(true);
              }}
              type="button"
            >
              Copy
            </Button>
          </div>
        </div>
      )}

      <Toast
        title="Copied!"
        message="You can now paste it anywhere you want."
        isOpen={isCopied}
        setIsOpen={setIsCopied}
        type="success"
      />
    </form>
  );
};

export default GetYourImgShields;
