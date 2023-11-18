import React from 'react';
import { FaGamepad } from 'react-icons/fa';

type Category = {
  title: string;
  description: string;
  icon: JSX.Element;
};

const categories: Category[] = [
  {
    title: 'Games',
    description: 'Sell and Play...',
    icon: <FaGamepad />,
  },
  {
    title: 'Games',
    description: 'Sell and Play...',
    icon: <FaGamepad />,
  },
  {
    title: 'Games',
    description: 'Sell and Play...',
    icon: <FaGamepad />,
  },
  {
    title: 'Games',
    description: 'Sell and Play...',
    icon: <FaGamepad />,
  },  {
    title: 'Games',
    description: 'Sell and Play...',
    icon: <FaGamepad />,
  },

];

const Categorys: React.FC = () => {
  return (
    <div>
        <div className=" flex max-w-max rounded-lg mt-5 bg-[#EB5353]">
            <nav className=" flex text-xl items-center gap-4 text-white px-5 py-2 my-auto ">
            <FaGamepad className=""/>
            <nav>Categories</nav>
            </nav>
        </div>
        <div className=" grid-cols-5 grid-rows-1 gap-2 grid justify-center items-center">
        {categories.map((category, index) => (
            <div
            key={index}
            className={`border-2 shadow-sm shadow-[#EB5353] border-[#EB5353]/10 hover:border-white bg-[#EB5353] duration-300 ease-linear w-full rounded-xl mx-auto mt-2 group`}
            >
            <div className="flex flex-col gap-5 mb-6">
                <div className="mx-auto text-[10rem] duration-300 ease-linear opacity-70 group-hover:opacity-100">
                {category.icon}
                </div>
                <div className="ml-8 flex gap-4">
                <div className="text-4xl opacity-70 group-hover:opacity-100">
                    {category.icon}
                </div>
                <div>
                    <h1 className="font-bold ">{category.title}</h1>
                    <h4 className="text-black/60">{category.description}</h4>
                </div>
                </div>
            </div>
            </div>
        ))}
        </div>
    </div>

  );
};

export default Categorys;
