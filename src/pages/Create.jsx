import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.bubble.css';
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import Preview from '../components/Preview';
import useTheme from "../context/theme";
import useUsers from "../context/User";


const Create = () => {

  const [title, setTitle] = useState('');
  const [blog_content, setBlog_content] = useState('');
  const [usrename, setUsername] = useState('');
  const navigate = useNavigate();

  const { publish } = useUsers(); // Context API
  const { themeMode } = useTheme(); // Context APT
  const { user } = useUsers(); // Context API

  const handleChange = e => {
    var input = e.target.value;
    if (title.trim().length <= 100) {
      setTitle(input);
    } else {
      setTitle(input.substring(0, 101));
      toast('Title Should Be Less than 100 Words', {
        duration: 900,
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

  useEffect(() => {
    ; (async () => {
      const { data } = await supabase
        .from('users')
        .select()
        .eq("id", user.id);
      setUsername(data[0].username);
    })()
  }, [])

  if (!user.id) navigate('/');

  return (
    <section className='w-[90%] md:w-[80%] lg:w-[60%] mx-auto py-14'>
      <input type="text"
        placeholder='Title'
        value={title}
        onChange={handleChange}
        autoFocus
        className='dark:text-white text-4xl outline-none w-full bg-transparent' />

      <ReactQuill
        theme='bubble'
        value={blog_content}
        onChange={setBlog_content}
        placeholder='Write About Pour Post...'
        className={`my-5 p-0 create ${themeMode === "dark" && 'create-dark'}`} />

      <div className={`${publish ? 'visible opacity-100' : 'invisible opacity-0'} transition-all duration-200`}>
        <Preview title={title} usrename={usrename} blog_content={blog_content} />
      </div>
    </section>
  )
};

export default Create;
