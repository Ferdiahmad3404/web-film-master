import Footer from "../components/Footer";
import Sidenav from "../components/Sidenav";
import Home from "../components/Home";
import DramaList from "../components/DramaList";

const Dashboard = () => {
    console.log('token', sessionStorage.getItem('token'));

    return (
    <div>
        <div className="flex bg-neutral-200 w-full">
            <div className="flex space-x-0 w-full">
                <div id="home" className="w-full">
                    <Home />
                    <div className="p-14 w-full space-y-10">
                        {/* <FiltersAndSorting /> */}

                            <DramaList />
                            <div className="w-full h-20 flex flex-auto justify-center">
                                <a href="#home" className="px-3 py-3 text-base font-medium text-center bg-transparent rounded-full flex items-center justify-center">
                                    <svg className="animate-bounce w-20 h-20 justify-center stroke-current stroke-5 text-yellow-900" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m16 17-4-4-4 4m8-6-4-4-4 4"/>
                                    </svg>
                                </a>
                            </div>
                        </div>                
                    </div>
                    <Sidenav />
                </div>
            </div>
            <Footer />
        </div>

    
    );
};

export default Dashboard;
