/* eslint-disable no-unused-vars */
import date from 'date-and-time';
import { useState } from "react";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.bubble.css';
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
import { supabase } from "../../supabaseClient";
import useUsers from "../context/User";
import Preview from '../components/Preview';


const modules = {
  toolbar: [
    [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
    [{ size: [] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{ 'list': 'ordered' }, { 'list': 'bullet' },
    { 'indent': '-1' }, { 'indent': '+1' }],
  ],
};

const formats = [
  'header', 'font', 'size',
  'bold', 'italic', 'underline', 'strike', 'blockquote',
  'list', 'bullet', 'indent',
]

const Create = () => {

  const [title, setTitle] = useState('');
  const [value, setValue] = useState('');
  const [image_url, setImageURL] = useState('');
  const [view, setView] = useState(false);

  // const [user_id, setUserId] = useState('b8f2393b-d896-41e2-83b9-4248da0634b6');
  const { user, publish } = useUsers();

  const navigate = useNavigate();

  const handleCreatePost = async (e) => {
    e.preventDefault();
    try {
      const now = new Date();
      const formated_time = date.format(now, 'ddd, MMM DD YYYY');
      const id = uuidv4();

      await supabase
        .from('blog_posts')
        .insert([{
          id: id,
          user_id: user.id,
          blog_title,
          summary,
          blog_content,
          formated_time,
          image_url
        }]);

      await supabase
        .from('likes')
        .insert([{
          post_id: id,
          like: 0
        }]);

      await supabase
        .from('comments')
        .insert([{
          post_id: id,
          content: [],
          user: []
        }]);

      navigate('/');

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
      console.log(uuidv4());

      if (data) {
        console.log(data);
        setImageURL(
          `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/${data.fullPath}`
        )
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (

    <section className='w-[90%] md:w-[80%] lg:w-[60%] mx-auto py-14'>
      <input type="text"
        placeholder='Title'
        value={title}
        onChange={e => setTitle(e.target.value)}
        className='text-4xl outline-none w-full bg-transparent' />

      <ReactQuill
        theme='bubble'
        value={value}
        onChange={setValue}
        placeholder='Write About Pour Post...'
        className='my-5 p-0 create' />

      <div className="">
        {publish && <Preview />}
      </div>
    </section>

    // <form className="p-4 flex flex-col" 
    // onSubmit={handleCreatePost}>
    //   <input
    //     type="text"
    //     placeholder="Title"
    //     className="my-1 border-2 p-2"
    //     value={blog_title}
    //     onChange={e => setTitle(e.target.value)} />

    //   <input
    //     type="text"
    //     placeholder="Summary"
    //     className="my-1 border-2 p-2"
    //     value={summary}
    //     onChange={e => setSummary(e.target.value)} />

    //   <input type="file"
    //     accept="image/png, image/jpeg, image/webp"
    //     onChange={e => uploadImg(e)} />

    //   <ReactQuill
    //     className="mt-2 h-[36em]"
    //     value={blog_content}
    //     onChange={newValue => setContent(newValue)}
    //     modules={modules}
    //     formats={formats} />

    //   <button
    //     className="text-left my-14 bg-slate-500 text-white p-2 w-fit text-2xl"
    //     onSubmit={handleCreatePost}>
    //     Publish
    //   </button>

    // </form>
  )
};

export default Create;
