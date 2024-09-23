import { useState } from "react";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.bubble.css';
import useUsers from "../context/User";
import Preview from '../components/Preview';


const Create = () => {

  const [title, setTitle] = useState('');
  const [blog_content, setBlog_content] = useState('');

  // const [user_id, setUserId] = useState('b8f2393b-d896-41e2-83b9-4248da0634b6');
  const { publish } = useUsers();

  return (

    <section className='w-[90%] md:w-[80%] lg:w-[60%] mx-auto py-14'>
      <input type="text"
        placeholder='Title'
        value={title}
        onChange={e => setTitle(e.target.value)}
        autoFocus
        className='text-4xl outline-none w-full bg-transparent' />

      <ReactQuill
        theme='bubble'
        value={blog_content}
        onChange={setBlog_content}
        placeholder='Write About Pour Post...'
        className='my-5 p-0 create' />

      <div className={`${publish ? 'visible opacity-100' : 'invisible opacity-0'} transition-all duration-200`}>
        <Preview title={title} blog_content={blog_content} />
      </div>
    </section>
  )
};

export default Create;
