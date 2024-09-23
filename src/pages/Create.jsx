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
