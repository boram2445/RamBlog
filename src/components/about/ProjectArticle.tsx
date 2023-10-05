'use client';

import { Project } from '@/model/portfolio';
import Image from 'next/image';
import { useState } from 'react';
import ModalContainer from '../ui/ModalContainer';
import ProjectModal from './ProjectModal';
import DuringDate from './DuringDate';

type Props = {
  project: Project;
};

export default function ProjectArticle({ project }: Props) {
  const { name, image, startDate, endDate, holding } = project;
  const [openModal, setOpenModal] = useState(false);

  return (
    <>
      <article
        onClick={() => setOpenModal(true)}
        className='w-full h-60 tablet:h-56 laptop:h-52 shadow-md relative rounded-lg overflow-hidden hover:-translate-y-3 transition-transform ease-in-out duration-300 cursor-pointer'
      >
        <Image
          src={image as string}
          alt={name}
          width={300}
          height={200}
          className='w-full h-3/4 object-cover aspect-square'
        />
        <div className='py-1 px-3 h-1/4'>
          <h4 className='text-gray-700'>{name}</h4>
          <DuringDate
            holding={holding}
            startDate={startDate}
            endDate={endDate}
          />
        </div>
      </article>
      {openModal && (
        <ModalContainer
          onClose={() => setOpenModal(false)}
          className='overflow-y-auto bg-white rounded-2xl w-full max-w-[650px] tablet:w-3/4 min-h-[300px] tablet:h-3/4'
        >
          <ProjectModal project={project} />
        </ModalContainer>
      )}
    </>
  );
}
