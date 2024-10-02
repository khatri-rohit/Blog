/* eslint-disable react/prop-types */
import date from 'date-and-time';
import { useEffect, useRef, useState } from "react";
import { LiaTimesSolid } from "react-icons/lia";
import ReactQuill from "react-quill";
import TagsInput from 'react-tagsinput'
import 'react-tagsinput/react-tagsinput.css';
import useUsers from "../context/User";
import { v4 as uuidv4 } from 'uuid';
import { supabase } from "../../supabaseClient";
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';


const Preview = ({ title, blog_content, usrename }) => {

    const imageRef = useRef(null);
    const [tags, setTags] = useState([]);
    const [summary, setSummary] = useState('');
    const [image_url, setImageURL] = useState('')
    const [preview, setPreview] = useState({
        _title: "",
        imageURL: ""
    });

    const { user, changePublish } = useUsers();

    const handleClick = () => {
        imageRef.current.click();
    }

    const navigate = useNavigate();

    const handleCreatePost = async () => {
        try {
            const now = new Date();
            const formated_time = date.format(now, 'ddd, MMM DD');
            const id = uuidv4();

            await supabase
                .from('posts')
                .insert([{
                    id: id,
                    user_id: user.id,
                    username: usrename,
                    blog_title: title,
                    summary,
                    blog_content,
                    formated_time,
                    image_url,
                    preview,
                    tags
                }]);

            await supabase
                .from('likes')
                .insert([{
                    post_id: id,
                    like: 0,
                    liked_users: []
                }]);

            await supabase
                .from('comments')
                .insert([{
                    post_id: id,
                    content: [],
                    user: []
                }]);

            navigate('/');
            toast('Blog Created', {
                duration: 1000,
                position: 'top-center',

                // Styling
                style: { padding: '1rem 1.5rem' },
                className: 'font-bold',

                // Custom Icon
                icon: '🎊',

                // Change colors of success/error/loading icon
                iconTheme: {
                    primary: '#000',
                    secondary: '#fff',
                },

                // Aria
                ariaProps: {
                    role: 'alert',
                    'aria-live': 'polite',
                },
            });
        } catch (error) {
            console.log("Can't Create Post\n", error);
        }
    }

    const uploadImg = async (e) => {
        try {
            const file = e.target.files[0];
            const { data } = await supabase
                .storage
                .from('img_posts')
                .upload(uuidv4() + "/" + uuidv4(), file);

            if (data) {
                console.log(data);
                console.log("Image Uploaded");
                setImageURL(`${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/${data.fullPath}`);
            }
            setPreview({ ...preview, imageURL: URL.createObjectURL(e.target.files[0]) });
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        setPreview({ ...preview, _title: title });
    }, [blog_content, title])

    return (
        <section className="absolute inset-0 bg-white z-10">
            <div className="my-8 size">
                <span className="absolute right-4 md:right-20 top-12 text-2xl cursor-pointer"
                    onClick={() => changePublish(false)}>
                    <LiaTimesSolid />
                </span>

                <div className="mt-32 flex flex-col md:flex-row">
                    <div className="flex-[1] p-7">
                        <p className="text-xl my-2">Story Preview</p>
                        <div
                            style={{ backgroundImage: `url(${preview.imageURL})` }}
                            onClick={handleClick}
                            className="w-[90%] mx-auto grid place-items-center h-72 bg-gray-100 object-cover cursor-pointer bg-cover bg-no-repeat my-7">
                            {!preview.imageURL && 'Add Image'}
                        </div>
                        <input
                            type="file"
                            ref={imageRef}
                            accept="image/png, image/jpeg, image/jpg"
                            onChange={uploadImg}
                            hidden
                        />
                        <input type="text"
                            placeholder='Preview Title...'
                            value={preview._title}
                            onChange={e => setPreview({ ...preview, _title: e.target.value })}
                            className='outline-none w-full bg-transparent text-xl border-b py-2' />

                        <ReactQuill
                            theme='bubble'
                            value={summary}
                            onChange={setSummary}
                            placeholder='Preview Text...'
                            className='my-2 border-b pb-2' />

                        <div className="my-5 flex items-center text-gray-500 text-sm">
                            <span className="font-bold">Note: </span>
                            <p className="mx-1">The Changes here will affect how your blog appears in public.</p>
                        </div>

                    </div>
                    <div className="flex-[1] p-7 flex flex-col gap-4 mb-5">
                        <p className="text-3xl">
                            Publishing to: <span className="font-medium">{user?.user_metadata?.full_name}</span>
                        </p>
                        <p>Add or change topics up to 5 so readers know what your story is about</p>
                        <TagsInput
                            value={tags}
                            onChange={setTags} />
                        <button
                            onClick={handleCreatePost}
                            className="px-5 w-fit py-1 bg-[#2c2f44] rounded-full text-white mx-3 text-xl">
                            Post Blog
                        </button>
                    </div>
                </div>

            </div>
        </section>
    )
};

export default Preview;
