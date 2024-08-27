/* eslint-disable no-unused-vars */
import { useState } from "react";
import { supabase } from "../../supabaseClient";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import { v4 as uuidv4 } from 'uuid';


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
  const [blog_img, setImageURL] = useState('');
  const [user_id, setUserId] = useState('b8f2393b-d896-41e2-83b9-4248da0634b6');

  const navigate = useNavigate();

  const handleCreatePost = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .insert([{
          user_id,
          blog_title,
          summary,
          blog_content,
          blog_img
        }]);

      console.log(data);
      console.log(error);
      navigate('/');

    } catch (error) {
      console.log(error);
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
      setImageURL(`https://kvgueljvvnnrbfjsohnf.supabase.co/storage/v1/object/public/${data.fullPath}`)
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
        className="mt-2 h-96"
        value={blog_content}
        onChange={newValue => setContent(newValue)}
        modules={modules}
        formats={formats} />

      <button
        className="text-left my-14 bg-slate-500 text-white p-2 w-fit text-2xl" onSubmit={handleCreatePost}>
        Publish
      </button>

    </form>
  )
};

export default Create;
