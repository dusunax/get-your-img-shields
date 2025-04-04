import GetYourImgShields from "./Components/GetYourImgShields";
import { ThemeToggle } from "./Components/ThemeToggle";
import Title from "./Components/Title";
import { GithubIcon, GlobeIcon } from "lucide-react";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen px-8 pb-20 gap-16 sm:p-20">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <main className="flex flex-col max-w-2xl gap-[32px] row-start-2 items-center sm:items-start">
        <Title />
        <GetYourImgShields />
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://github.com/dusunax/get-your-img-shields"
          target="_blank"
          rel="noopener noreferrer"
        >
          <GithubIcon className="w-4 h-4" />
          Source Code
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://img.shields.io"
          target="_blank"
          rel="noopener noreferrer"
        >
          <GlobeIcon className="w-4 h-4" />
          Go to img.shields.io
        </a>

        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://simpleicons.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          <GlobeIcon className="w-4 h-4" />
          Go to Simple Icons
        </a>
      </footer>
    </div>
  );
}
