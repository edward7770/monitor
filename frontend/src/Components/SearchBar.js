export default function SearchBar(props) {
    const { searchValue, onChangeInput, className, label} = props;

    return (
        <>
            <form className={`max-w-md mr-5 ${className}`}>
                <label htmlFor="default-search" className="mb-2 text-sm text-gray-400 sr-only dark:text-white">{label}</label>
                <div className="relative">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                        <svg className="sm:w-4 sm:h-4 w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                        </svg>
                    </div>
                    <input value={searchValue} onChange={onChangeInput} type="search" id="default-search" className="block outline-none bg-[#f4f7fd] font-light rounded-lg w-full p-2 focus:ring-blue-500 focus:border-blue-500 ps-14 sm:text-md text-md" placeholder={`${label}...`} required />
                </div>
            </form>
        </>
    )
}
