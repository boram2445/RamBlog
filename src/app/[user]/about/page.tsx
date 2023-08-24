import { Metadata } from 'next';
import Profile from '@/components/home/Hero';
import ProjectArticle from '@/components/about/ProjectArticle';
import ExperienceArticle from '@/components/about/ExperienceArticle';

export const metadata: Metadata = {
  title: 'About Me',
  description: 'Boram의 커리어 소개',
};

export default function AboutPage() {
  return (
    <>
      <Profile />
      <div className='mx-auto max-w-screen-lg p-2 tablet:p-5 laptop:px-8'>
        <section className='mb-12 pb-12 border-b border-light-gray'>
          <h3 className='my-3 text-2xl font-semibold text-black'>Values</h3>
          <p className='text-black'>
            제가 생각하는 개발의 중요한 세가지는 다음과 같습니다.
          </p>
        </section>
        <section className='mb-12 pb-12 border-b border-light-gray'>
          <h3 className='my-3 text-2xl font-semibold text-black'>Projects</h3>
          <p className='text-black'>개발을 진행하며 수행한 프로젝트 입니다.</p>
          <div className='mt-5 grid  grid-cols-2 gap-x-4 gap-y-8 text-black'>
            {projects.map((project, index) => (
              <ProjectArticle project={project} key={index} />
            ))}
          </div>
        </section>
        <section className='mb-12 pb-12 border-b border-light-gray'>
          <h3 className='my-3 text-2xl font-semibold text-black'>Skills</h3>
          <p className='text-black'>현재 공부중인 스택들 입니다.</p>
        </section>
        <section className='mb-12'>
          <h3 className='my-8 text-2xl font-semibold text-black'>Experience</h3>
          <div className='p-5'>
            {experiences.map((experience, index) => (
              <ExperienceArticle experience={experience} key={index} />
            ))}
          </div>
        </section>
      </div>
    </>
  );
}

const projects = [
  {
    title: 'RamBlog',
    image: '/images/profile.jpg',
    type: '개인 프로젝트',
    date: '2023-07-12 ~ ',
    description: `포토폴리오
      및 블로그 웹 애플리케이션`,
    link: '',
  },
  {
    title: 'Unicorn Market',
    image: '/images/about/unicorn-market.png',
    type: '개인 프로젝트',
    date: '2022-08-06 ~ ',
    description: `누구나 상점 주인이 될 수 있는
      오픈 마켓 프로젝트`,
    link: 'https://github.com/boram2445/UnicornShop',
  },
  {
    title: 'GameUs',
    image: '/images/about/feeasy404.png',
    type: '팀 프로젝트',
    date: '2022-07-06 ~ 2022-08-01',
    description: '게임 물품 중고거래 커뮤니티',
    link: 'https://github.com/FEeasy404/GameUs',
  },
];

const experiences = [
  {
    title: '한국외국어대학교 서울캠퍼스',
    description: '한국외국어대학교 노어과, 융복합소프트웨어 졸업',
    date: '2018-03-02 ~ 2023-08-18',
    image: '/images/about/hufs.png',
  },
  {
    title: '멋쟁이사자처럼 프론트엔드스쿨 2기',
    description:
      '멋쟁이사자처럼에서 운영하는 부트캠프 프론트엔트 스쿨 과정 수료',
    date: '2022-03-02 ~ 2022-07-18',
    image: '/images/about/lion.png',
  },
];
