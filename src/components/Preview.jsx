import { useRef, useState } from "react";
import { LiaTimesSolid } from "react-icons/lia";
import ReactQuill from "react-quill";
import TagsInput from 'react-tagsinput'
import 'react-tagsinput/react-tagsinput.css'
import useUsers from "../context/User";

const Preview = () => {
    const imageRef = useRef(null);
    const [imageURL, setImageURL] = useState('');
    const [tags, setTags] = useState([]);

    const { user, changePublish } = useUsers();

    const handleClick = () => {
        imageRef.current.click();
    }

    return (
        <section className="absolute inset-0 bg-white z-10">
            <div className="my-8 size">
                <span className="absolute right-4 md:right-20 top-12 text-2xl cursor-pointer"
                    onClick={changePublish}>
                    <LiaTimesSolid />
                </span>

                <div className="mt-32 flex flex-col md:flex-row">
                    <div className="flex-[1] p-7 border">
                        <p className="text-xl my-2">Story Preview</p>
                        <div
                            style={{ backgroundImage: `url(${imageURL})` }}
                            onClick={handleClick}
                            className="w-[90%] mx-auto grid place-items-center h-72 bg-gray-100 object-cover cursor-pointer bg-cover bg-no-repeat my-7">
                            {!imageURL && 'Add Image'}
                        </div>
                        <input
                            ref={imageRef} type="file"
                            onChange={e => setImageURL(URL.createObjectURL(e.target.files[0]))}
                            hidden
                        />
                        <input type="text"
                            placeholder='Preview Title...'
                            // value={title}
                            // onChange={e => setTitle(e.target.value)}
                            className='outline-none w-full bg-transparent text-xl border-b py-2' />

                        <ReactQuill
                            theme='bubble'
                            // value={value}
                            // onChange={setValue}
                            placeholder='Preview Text...'
                            className='my-2 border-b pb-2' />

                        <div className="my-5 flex items-center text-gray-500 text-sm">
                            <span className="font-bold">Note: </span>
                            <p className="mx-1">The Changes here will affect how your blog appears in public.</p>
                        </div>

                    </div>
                    <div className="flex-[1] p-7 flex flex-col gap-4 mb-5 border">
                        <p className="text-3xl">Publishing to: <span className="font-medium">
                            {user?.user_metadata?.full_name}
                        </span>
                        </p>
                        <p>Add or change topics up to 5 so readers know what your story is about</p>
                        <TagsInput value={tags} onChange={setTags} />
                        <button
                            className="px-5 w-fit py-1 bg-green-700 rounded-full text-white mx-3 text-xl">
                            Publish Now
                        </button>
                    </div>
                </div>

            </div>
        </section>
    )
};

export default Preview;
