/* eslint-disable react/no-unescaped-entities */
import { useCallback, useEffect, useRef, useState } from "react";
import { MdCamera } from "react-icons/md";
import { supabase } from "../../supabaseClient";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { ClimbingBoxLoader, ClipLoader } from "react-spinners";
import { v4 as uuidv4 } from 'uuid';
import { FaRegUser } from "react-icons/fa";
import { IoBookmarksOutline } from "react-icons/io5";
import useUsers from "../context/User";
import toast, { Toaster } from "react-hot-toast";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import PostDropDown from "../utils/PostDropDown";


const Profile = () => {

  const { user } = useUsers();
  const navigate = useNavigate();
  const tabs = [
    {
      id: 1,
      barName: "Account",
      icon: <FaRegUser />,
      card: <Account />
    },
    {
      id: 2,
      barName: "Saved Posts",
      icon: <IoBookmarksOutline />,
      card: <Bookmarks />
    }
  ];
  const [navi, setNavi] = useState(1);

  useEffect(() => {
    if (window.location.hash === "#bookmarks")
      setNavi(2)
  }, [])

  if (!user.id) navigate('/');

  return (
    <>
      <div className="container mx-auto mt-6">
        <div className="w-full h-[80vh] flex justify-center">

          {/*  */}
          <div className="w-[20%] bg-gray-500">
            {
              tabs.map((tab, _) => (
                <div key={_}
                  className={`flex items-center p-2 font-medium ${tab.id === navi ? "bg-gray-200" : "bg-white hover:bg-gray-100"} my-3 cursor-pointer`}
                  onClick={() => setNavi(tab.id)}>
                  <div
                    className="mx-2 w-10 rounded-full" >
                    {tab.icon}
                  </div>
                  <p className="text-xl">
                    {tab.barName}
                  </p>
                </div>
              ))
            }
          </div>

          {/*  */}
          <div className="w-[65%] bg-gray-200 p-3" >
            {tabs.map((tab, _) => (
              <span key={_}>
                {tab.id == navi && tab.card}
              </span>
            ))}
          </div>
        </div>
      </div >
    </>
  )
};

export default Profile;

const Account = () => {

  const { id } = useParams();

  const [changeName, setChangeName] = useState(false);
  const [changeBio, setChnageBio] = useState(false);
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [cur_user, setCur_user] = useState('');
  const [blog, setBlog] = useState([]);
  const [loading, setLoading] = useState(false);
  const [proLoading, setProtLoading] = useState(false);
  const [image_url, setImage_url] = useState('');
  const [curDrop, setCurDrop] = useState('');

  const imgRef = useRef(null);

  const handleNameChange = async (event, method) => {
    event.preventDefault();
    setChangeName(prev => !prev);
    if (method === "save") {
      await supabase
        .from('users')
        .update({
          name: name
        }).eq("username", id);
    }
  }

  const handleChangeBio = async (method) => {
    setChnageBio(prev => !prev);
    if (method === "save") {
      await supabase
        .from('users')
        .update({
          bio: bio
        }).eq("username", id);
    }
  }

  const fetchProfile = async () => {
    try {
      setProtLoading(true);
      const { data } = await supabase
        .from('users')
        .select()
        .eq("username", id);

      if (data) {
        setCur_user(data[0]);
        setName(data[0].name);
        setBio(data[0].bio);
        console.log(data[0]);
      }
      setProtLoading(false);
    } catch (error) {
      console.log(error);
      setProtLoading(false);
    }
  }

  const fetchposts = async () => {
    try {
      setLoading(true);
      const { data } = await supabase
        .from('posts')
        .select()
        .eq('username', id);
      if (data) {
        setBlog(data);
        console.log(data);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  const profileData = useCallback(fetchProfile, [image_url, bio, name]);

  useEffect(() => {
    profileData();
    fetchposts();
  }, [])

  const uploadImg = async (e) => {
    try {
      const file = e.target.files[0];
      const { data } = await supabase
        .storage
        .from('img_posts')
        .upload(uuidv4() + "/" + uuidv4(), file);

      if (data) {
        const url = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/${data.fullPath}`;
        setImage_url(url);
        await supabase
          .from('users')
          .update({
            avatar_url: url
          }).eq("username", id);
        toast(() => {
          return <span className="text-xl">
            Profile Pic Updated
          </span>
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  const deletePost = async (postId) => {
    try {
      await supabase
        .from('posts')
        .delete()
        .eq('id', postId);
      toast('Post Deleted', {
        duration: 1000,
        position: 'top-right',

        // Styling
        style: { padding: '1rem 1.5rem' },
        className: 'font-bold',

        // Custom Icon
        icon: '✅',

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
      fetchposts();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="transition-opacity duration-200">

      <div className="flex items-center m-3">
        <div className="relative group hover:opacity-60" onClick={() => imgRef.current.click()}>
          <div className="absolute inset-x-9 inset-y-7">
            <MdCamera className="group-hover:block hidden text-2xl text-white" />
          </div>
          <img src={cur_user?.avatar_url || "/blank-avatar.webp"}
            className="rounded-full cursor-pointer mx-2 w-20 h-20 object-cover border-black border"
            alt="profile" />
        </div>
        <input type="file"
          ref={imgRef}
          onChange={uploadImg}
          accept="image/png, image/jpeg"
          hidden />

        <form className="flex flex-col items-start mx-3" onSubmit={(event) => handleNameChange(event, "save")}>
          {
            changeName ?
              <input type="text"
                className="text-3xl font-semibold bg-transparent"
                value={name}
                autoFocus
                onChange={e => setName(e.target.value)} />
              :
              (proLoading ? (
                <div className="flex items-center">
                  <ClipLoader />
                </div>
              ) : <p className="text-3xl font-semibold">
                {name}
              </p>)
          }
          {changeName ?
            (<button className="text-xs my-1 text-blue-500 font-medium"
              onClick={(event) => handleNameChange(event, "save")}>Save</button>) :
            (<button className="text-xs my-1 text-blue-500 font-medium"
              onClick={(event) => handleNameChange(event, "change")}>Edit Name</button>)}
        </form>
      </div>

      <div className="my-10 mx-5">
        <div className="flex items-center my-2">
          <p className="text-2xl font-medium">Username: </p>
          <p className="text-xl font-light mx-2">{cur_user?.username}</p>
        </div>

        <div className="flex items-center my-2">
          <p className="text-2xl font-medium">Email: </p>
          <p className="text-xl font-light mx-2">{cur_user?.email}</p>
        </div>

        <div className="flex items-center my-2">
          <p className="text-2xl font-medium">Account Created : </p>
          <p className="text-xl font-light mx-2">
            {new Date(cur_user?.created_at)?.toLocaleString("en", {
              year: "numeric", month: "short", day: "2-digit"
            })}
          </p>
        </div>

        <div className="my-2">
          <p className="text-2xl font-medium">About Me</p>
          <div className="flex flex-col items-start my-0.5">
            {
              changeBio ?
                <textarea type="text"
                  className="text-2xl bg-transparent w-full outline-none border-b resize-none"
                  value={bio}
                  autoFocus
                  onChange={e => setBio(e.target.value)} />
                : (bio ?
                  <p className="text-2xl">
                    {bio}
                  </p> :
                  <p className="text-gray-400">
                    Introduce Your self
                  </p>)
            }
            {changeBio ?
              (<button className="text-xs my-1 text-blue-500 font-medium"
                onClick={() => handleChangeBio("save")}>Save</button>) :
              (<button className="text-xs my-1 text-blue-500 font-medium"
                onClick={() => handleChangeBio("change")}>Edit</button>)}
          </div>
        </div>

        {/* Your Blogs */}
        <div className="my-5">
          <p className="text-2xl font-light p-2">
            {'->'} All Blogs
          </p>

          <div className="flex overflow-x-scroll scroll-smooth"
            style={{ scrollbarWidth: "none" }}>
            <div className={`flex flex-nowrap ms-0.5 ${loading && 'items-center justify-center'}`}>
              {loading && (<p className="text-center">
                <ClimbingBoxLoader />
              </p>)}
              {blog?.length !== 0 ?
                (blog?.map((post, _) => (
                  <div className="border-r p-2 bg-white mr-1 drop-shadow-lg rounded-lg cursor-auto" key={_} >
                    <div className="w-96 max-w-xs overflow-hidden transition-shadow duration-300 ease-in-out">
                      <NavLink to={`/post/${post?.id}`} className="">
                        <img src={post?.image_url}
                          className="object-cover w-full rounded-xl h-[25vh]"
                          alt={post?.blog_title} />
                      </NavLink>
                      <div className="p-2 flex justify-between">
                        <p className="text-pretty">
                          {post?.blog_title}
                        </p>
                        <div className="relative ms-3">
                          <button
                            className="absolute right-0"
                            onClick={() => setCurDrop(post.id)}>
                            <BiDotsHorizontalRounded className="text-3xl" />
                            {
                              curDrop === post.id && <PostDropDown curPost={curDrop}
                                postid={post.id}
                                setCurPost={setCurDrop} size={"w-[10rem]"}>
                                <button onClick={() => {
                                  deletePost(post.id);
                                  setCurDrop('');
                                }}>
                                  Delete
                                </button>
                              </PostDropDown>
                            }
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )))
                : loading || (<p className="text-xl">You haven't written any blogs yet</p>)}

            </div>
          </div>

        </div>
      </div>
    </div>
  )

};

const Bookmarks = () => {

  const { id } = useParams()
  const [bookMarks, setBookMarks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [curDrop, setCurDrop] = useState('');

  const AllBookmarks = async () => {
    try {
      setLoading(true);
      const { data } = await supabase
        .from('bookmarks')
        .select()
        .eq('username', id);
      setLoading(false);
      console.log(data);
      if (data)
        setBookMarks(data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    AllBookmarks();
  }, [])

  const deleteBookmark = async (postId) => {
    console.log(postId);
    await supabase
      .from('bookmarks')
      .delete()
      .eq('post_id', postId);
    toast('Bookmark Deleted', {
      duration: 100,
      position: 'top-right',

      // Styling
      style: { padding: '1rem 1.5rem' },
      className: 'font-bold',

      // Custom Icon
      icon: '✅',

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
    AllBookmarks();
  }

  return (
    <div className="p-3">
      <p className="text-4xl font-semibold">Saved Posts</p>
      <div className="my-5 flex w-full">
        <div className="relative flex overflow-y-scroll scroll-smooth w-full"
          style={{ scrollbarWidth: "none" }}>
          {
            loading &&
            // Loading
            <div className="absolute bg-transparent bg-opacity-60 h-full w-full z-10 flex items-center justify-center">
              <ClipLoader />
            </div>
          }
          <div className="">
            {
              bookMarks?.length === 0 ?
                (loading || <p className="text-xl">You haven't Saved any posts</p>)
                // : <div className={`grid grid-cols-2 grid-rows-7 gap-4 ms-0.5 w-full`}>
                : <div className={`flex flex-nowrap ms-0.5`}>                  {
                  (bookMarks?.map((post, _) => (
                    <div key={_}
                      className="border-r p-2 bg-white drop-shadow-lg rounded-lg cursor-pointer w-full gap-3">
                      <div className="max-w-xs overflow-hidden transition-shadow duration-300 ease-in-out">
                        <NavLink to={`/post/${post?.post_id}`}>
                          <img src={post?.cover_img}
                            className="object-cover w-full rounded-xl h-[25vh]"
                            alt={post?.blog_title} />
                        </NavLink>
                        <div className="pt-2 px-2 flex justify-between items-start">
                          <p className="text-pretty font-semibold text-black">
                            {post?.blog_title}
                          </p>
                          <div className="relative ms-3">
                            <button
                              className="absolute right-0"
                              onClick={() => setCurDrop(post.id)}>
                              <BiDotsHorizontalRounded className="text-3xl" />
                              {
                                curDrop === post.id && <PostDropDown curPost={curDrop}
                                  postid={post?.id} setCurPost={setCurDrop} size={"w-[8rem]"}>
                                  <button onClick={() => {
                                    deleteBookmark(post.post_id);
                                    setCurDrop('');
                                  }
                                  }>
                                    Delete
                                  </button>
                                </PostDropDown>
                              }
                            </button>
                          </div>
                        </div>
                        <div className="px-2"
                          dangerouslySetInnerHTML={{ __html: (post.summary).substring(0, 80) + "..." }} />
                      </div>
                    </div>
                  )))
                }
                </div>
            }
          </div>
        </div>
      </div>
    </div >
  )

}
