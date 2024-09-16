
const Redirect = () => {
    return (
        <>
            <form
                className="input-feild flex mx-1 items-center bg-slate-200  rounded-xl"
                onSubmit={() => { }}
            >
                <div className="mx-1" onSubmit={() => { }}>
                    {/* <BiSearch className="text-2xl mx-2" /> */}
                </div>
                <input type="text"
                    className="bg-slate-200 p-2 rounded-xl outline-none placeholder:dark:text-black"
                    placeholder="Search"
                // value={search}
                // onChange={e => handleSearch(e)}
                />
            </form>
        </>
    )
};

export default Redirect;
