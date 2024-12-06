import { Footer as FooterFlowbite} from 'flowbite-react';
import { React } from 'react';
import { useParams } from 'react-router-dom';
import DramaList from '../components/DramaList';
import Footer from '../components/Footer';
import Sidenav from '../components/Sidenav';

const SearchResult = () => {
  const { '*': input } = useParams();
  return (
    <>
        <div>
            <div className="flex">
                <main className="w-full p-20 bg-neutral-200">
                    <div>
                        <div className="flex space-x-60 mb-6 items-center justify-between">
                            <a href="/">
                                <h1 className="mb-4 p-2 text-center text-4xl font-extrabold leading-none tracking-tight text-yellow-900 md:text-5xl lg:text-6xl">DramaKu</h1>
                            </a>
                        </div>
                        {/* <h2 className="text-2xl">Search Query: {input}</h2> Menampilkan input */}
                        <DramaList searchTerm={input}/>
                    </div>
                </main>
                <Sidenav />
            </div>
            <Footer />
        </div>
    </>
  );
};

export default SearchResult;
