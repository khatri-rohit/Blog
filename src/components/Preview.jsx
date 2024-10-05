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
import Confetti from 'react-confetti'
import { useWindowSize } from 'react-use'
import { ClipLoader, FadeLoader } from 'react-spinners';
import useFetch from '../hooks/User';


const Preview = ({ title, blog_content, usrename }) => {

    const imageRef = useRef(null);
    const [tags, setTags] = useState([]);
    const [summary, setSummary] = useState('');
    const [image_url, setImageURL] = useState('')
    const [preview, setPreview] = useState({
        _title: "",
        imageURL: ""
    });

    const [showConfetti, setShowConfetti] = useState(false);
    const { width, height } = useWindowSize();
    const [imgLoading, setImgLoading] = useState(false);

    const { user, changePublish } = useUsers();
    const [cur_user] = useFetch(user.id);


    const handleClick = () => {
        imageRef.current.click();
    }

    const navigate = useNavigate();

    const handleCreatePost = async () => {
        setShowConfetti(true);
        try {
            const now = new Date();
            const formated_time = date.format(now, 'ddd, MMM DD');
            const id = uuidv4();

            if (title.trim().length !== 0 && image_url.length !== 0
                && summary.length !== 0 && tags.length !== 0) {
                const tag = tags.map((hashtags) => hashtags.toLowerCase());
                
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
                        tag
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

                setTimeout(() => {
                    setShowConfetti(false);
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
                }, 2500);
            } else {
                setShowConfetti(false);

                if (title.trim().length === 0) {
                    toast('Enter Title', {
                        duration: 1500,
                        position: 'top-center',

                        // Styling
                        style: { padding: '1rem 1.5rem' },
                        className: 'font-bold',

                        // Custom Icon
                        icon: '⚠️',

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
                    changePublish(false);
                } else if (blog_content.trim().length === 0) {
                    toast("Can't Post Empty Blog", {
                        duration: 1500,
                        position: 'top-center',

                        // Styling
                        style: { padding: '1rem 1.5rem' },
                        className: 'font-bold',

                        // Custom Icon
                        icon: '⚠️',

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
                    changePublish(false);
                } else if (image_url.length === 0) {
                    toast('Cover Image is Compalsary', {
                        duration: 1000,
                        position: 'top-center',

                        // Styling
                        style: { padding: '1rem 1.5rem' },
                        className: 'font-bold',

                        // Custom Icon
                        icon: '⚠️',

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
                } else if (summary.trim().length === 0) {
                    toast('Preview Summary is Important', {
                        duration: 1000,
                        position: 'top-center',

                        // Styling
                        style: { padding: '1rem 1.5rem' },
                        className: 'font-bold',

                        // Custom Icon
                        icon: '⚠️',

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
                } else if (tags.length === 0) {
                    toast(() => {
                        return <span className='text-[1rem]'>
                            Enter Related Tags For Recommendation
                        </span>
                    })
                }
            }
        } catch (error) {
            console.log("Can't Create Post\n", error);
        }
    }

    const uploadImg = async (e) => {
        try {
            setImgLoading(true);
            const maxSize = 5 * 1024 * 1024; // 10MB
            const file = e.target.files[0];
            if (file.size > maxSize) {
                alert('File size exceeds the maximum allowed limit');
                setImgLoading(false);
                return;
            }
            const { data } = await supabase
                .storage
                .from('img_posts')
                .upload(uuidv4() + "/" + uuidv4(), file);

            if (data) {
                setImageURL(`${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/${data.fullPath}`);
                setPreview({ ...preview, imageURL: URL.createObjectURL(e.target.files[0]) });
                setImgLoading(false);
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        setPreview({ ...preview, _title: title });
    }, [blog_content, title])

    return (
        <section className="absolute inset-0 bg-white dark:bg-[#222831] z-10">
            {showConfetti && <Confetti width={width} height={height} />}
            {showConfetti && (
                <div className="absolute left-[50%] top-[20%] z-20 dark:text-white">
                    <ClipLoader className='dark:text-white' />
                </div>
            )}
            <div className="my-8 size">
                <span className="absolute right-4 md:right-20 top-12 text-2xl cursor-pointer"
                    onClick={() => changePublish(false)}>
                    <LiaTimesSolid className='dark:text-white' />
                </span>

                <div className="lg:mt-32 md:mt-52 flex flex-col md:flex-row">
                    <div className="flex-[1] p-7">
                        <p className="text-xl my-2 dark:text-white">Story Preview</p>
                        <div
                            style={{ backgroundImage: `url(${preview.imageURL})` }}
                            onClick={handleClick}
                            className="w-[90%] mx-auto grid place-items-center h-72 dark:text-white bg-gray-100
                            dark:bg-slate-500 object-cover cursor-pointer bg-cover bg-no-repeat my-7 relative">
                            {!preview.imageURL && !imgLoading && 'Add Image'}
                            {imgLoading && <FadeLoader
                                color="white"
                                height={15}
                                width={1}
                            />}
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
                            className='outline-none w-full bg-transparent text-xl border-b py-2  dark:text-white' />

                        <ReactQuill
                            theme='bubble'
                            value={summary}
                            onChange={setSummary}
                            placeholder='Preview Text...'
                            className='my-2 border-b pb-2  dark:text-white' />

                        <div className="my-5 flex items-st text-gray-500 text-sm">
                            <span className="font-bold">Note: </span>
                            <p className="mx-1">The Changes here will affect how your blog appears in public.</p>
                        </div>

                    </div>
                    <div className="flex-[1] md:p-7 p-5  flex flex-col gap-4 mb-5">
                        <p className="text-3xl dark:text-white">
                            Publishing to: <span className="font-medium">{cur_user?.name}</span>
                        </p>
                        <p className='dark:text-white'>Add or change topics up to 5 so readers know what your story is about</p>
                        <TagsInput
                            value={tags}
                            onChange={setTags} />
                        <button
                            onClick={handleCreatePost}
                            disabled={showConfetti}
                            className="px-5 w-fit py-1 bg-[#1E3E62] hover:bg-[#1E3E62]/80 duration-200 transition-all rounded-full text-white md:mx-3 text-xl disabled:bg-[#1E3E62]/50">
                            Post Blog
                        </button>
                    </div>
                </div>
            </div>
        </section>
    )
};

export default Preview;
