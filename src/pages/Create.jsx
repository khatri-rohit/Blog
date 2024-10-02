import { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.bubble.css';
import useUsers from "../context/User";
import Preview from '../components/Preview';
import { supabase } from "../../supabaseClient";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";


const Create = () => {

  const [title, setTitle] = useState('');
  const [blog_content, setBlog_content] = useState('');
  const { user } = useUsers();
  const [usrename, setUsername] = useState('');
  const { publish } = useUsers();

  const navigate = useNavigate();

  useEffect(() => {
    ; (async () => {
      const { data } = await supabase
        .from('users')
        .select()
        .eq("id", user.id);
      console.log(data[0].username);
      setUsername(data[0].username);
    })()
  }, [])

  if (!user.id) navigate('/');

  const handleChange = e => {
    var input = e.target.value;
    if (title.trim().length <= 100) {
      setTitle(input);
    } else {
      setTitle(input.substring(0, 101));
      toast('Title Should Be Less than 100 Words', {
        duration: 800,
        position: 'top-right',

        // Styling
        style: { padding: '1rem 1.5rem' },
        className: 'font-bold',

        // Custom Icon
        icon: '🤚🏻',

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
      e.target.autoFocus = true;
    }
  }


  return (

    <section className='w-[90%] md:w-[80%] lg:w-[60%] mx-auto py-14'>
      <Toaster
        position="top-right"
      />
      <input type="text"
        placeholder='Title'
        value={title}
        onChange={handleChange}
        autoFocus
        className='text-4xl outline-none w-full bg-transparent' />

      <ReactQuill
        theme='bubble'
        value={blog_content}
        onChange={setBlog_content}
        placeholder='Write About Pour Post...'
        className='my-5 p-0 create' />

      <div className={`${publish ? 'visible opacity-100' : 'invisible opacity-0'} transition-all duration-200`}>
        <Preview title={title} usrename={usrename} blog_content={blog_content} />
      </div>
    </section>
  )
};

export default Create;
