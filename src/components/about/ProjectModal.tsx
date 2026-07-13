import Image from "next/image";
import { Project } from "@/model/portfolio";
import DuringDate from "./DuringDate";

type Props = {
  project: Project;
};

export default function ProjectModal({ project }: Props) {
  const { name, image, startDate, endDate, holding, content, link } = project;

  return (
    <div className="p-4 w-full h-full">
      <h2 className="mb-3 mt-2 pb-1 border-b border-slate-200 text-xl font-semibold text-gray-800">
        {name}
      </h2>
      <DuringDate startDate={startDate} endDate={endDate} holding={holding} />
      <p className="w-full whitespace-pre-line break-all my-3">{content}</p>
      {link && (
        <a href={link} target="_blank">
          {`👉🏻 `}
          <span className="text-indigo-500 underline hover:text-indigo-200">
            {name} 바로가기
          </span>
        </a>
      )}
      <div className="mt-4 relative w-full h-1/2 min-h-[300px]">
        <Image
          src={image as string}
          alt={name}
          fill
          className="object-cover aspect-square"
          sizes="(min-width: 867px) 650px, (min-width: 640px) 75vw, 100vw"
        />
      </div>
    </div>
  );
}
