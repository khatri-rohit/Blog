/* eslint-disable no-unused-vars */
import { useState } from "react";
import { supabase } from "../../supabaseClient";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import { v4 as uuidv4 } from 'uuid';
import date from 'date-and-time';
import useUsers from "../context/User";


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

  const [blog_title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [blog_content, setContent] = useState('');
  // const [user_id, setUserId] = useState('b8f2393b-d896-41e2-83b9-4248da0634b6');
  const [image_url, setImageURL] = useState('');

  const { user } = useUsers();

  const navigate = useNavigate();

  const handleCreatePost = async (e) => {
    e.preventDefault();
    try {
      const now = new Date();
      const formated_time = date.format(now, 'ddd, MMM DD YYYY');

      const { data, error } = await supabase
        .from('blog_posts')
        .insert([{
          user_id: user.id,
          blog_title,
          summary,
          blog_content,
          formated_time,
          image_url
        }]);
      if (data)
        console.log(data);
      else
        console.log("Error\n", error);
      navigate('/');

    } catch (error) {
      console.log("Can't Create Post\n", error);
    }
  }

  const uploadImg = async (e) => {
    const file = e.target.files[0];
    console.log(file);

    const { data, error } = await supabase
      .storage
      .from('img_posts')
      .upload(uuidv4() + "/" + uuidv4(), file);

    if (!error) {
      console.log(data);
      setImageURL(
        `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/${data.fullPath}`
      )
    }
    else console.log(error);
  }

  return (
    <form className="p-4 flex flex-col" onSubmit={handleCreatePost}>
      <input
        type="text"
        placeholder="Title"
        className="my-1 border-2 p-2"
        value={blog_title}
        onChange={e => setTitle(e.target.value)} />

      <input
        type="text"
        placeholder="Summary"
        className="my-1 border-2 p-2"
        value={summary}
        onChange={e => setSummary(e.target.value)} />

      <input type="file"
        accept="image/png, image/jpeg, image/webp"
        onChange={e => uploadImg(e)} />

      <ReactQuill
        className="mt-2 h-[36em]"
        value={blog_content}
        onChange={newValue => setContent(newValue)}
        modules={modules}
        formats={formats} />

      <button
        className="text-left my-14 bg-slate-500 text-white p-2 w-fit text-2xl"
        onSubmit={handleCreatePost}>
        Publish
      </button>

    </form>
  )
};

export default Create;
