/* eslint-disable no-unused-vars */
import { useState } from "react";
import { supabase } from "../../supabaseClient";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css'


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

  const [blog_title, setTitle] = useState('')
  const [summary, setSummary] = useState('')
  const [blog_content, setContent] = useState('')

  const navigate = useNavigate();

  const handleCreatePost = async (e) => {
    e.preventDefault();

    try {
      await supabase
        .from('blog_posts')
        .insert([{
          user_id: '56eabf9c-c68c-4251-9307-1ee438434a94',
          blog_title,
          summary,
          blog_content
        }])

      navigate('/');

    } catch (error) {
      console.log(error);
    }


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

      <input type="file" />

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
