/* eslint-disable react/no-unescaped-entities */
import { useCallback, useEffect, useRef, useState } from "react";
import { MdCamera } from "react-icons/md";
import { supabase } from "../../supabaseClient";
import {  NavLink, useNavigate, useParams } from "react-router-dom";
import { ClimbingBoxLoader, ClipLoader } from "react-spinners";
import { v4 as uuidv4 } from 'uuid';
import { FaRegUser } from "react-icons/fa";
import { IoBookmarksOutline } from "react-icons/io5";
import useUsers from "../context/User";



const Profile = () => {

  const { user } = useUsers();
  const mavigate = useNavigate();
  const tabs = [
    {
      id: 1,
      barName: "Account",
      icon: <FaRegUser />,
      card: <Account />
    },
    {
      id: 2,
      barName: "Bookmarks",
      icon: <IoBookmarksOutline />,
      card: <Bookmarks />
    }
  ];
  const [navi, setNavi] = useState(1);

  if (!user.id) {
    return (
      <div className="p-5 container mx-auto flex flex-col items-center">
        <p className="text-3xl text-center">You are not logged In</p>
        <button
          onClick={() => mavigate('/')}
          className="my-3 rounded-xl px-3 py-2 bg-gray-400 text-xl text-white">
          Home Page
        </button>

      </div>
    )
  }

  return (
    <>
      <div className="container mx-auto mt-6">
        <div className="w-full h-[80vh] flex justify-center">

          {/*  */}
          <div className="w-[20%] bg-gray-600">
            {
              tabs.map((tab, _) => (
                <div key={_}
                  className={`flex items-center p-2 font-medium ${tab.id === navi ? "bg-gray-200" : "bg-white"} my-3 cursor-pointer`}
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
            {tabs.map((tab) => (
              <>{tab.id == navi && tab.card}</>
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
  console.log(id);
  const [changeName, setChangeName] = useState(false);
  const [name, setName] = useState('');
  const [cur_user, setCur_user] = useState('');
  const [blog, setBlog] = useState([]);
  const [loading, setLoading] = useState(false);
  const [proLoading, setProtLoading] = useState(false);
  const [image_url, setImage_url] = useState('');
  const imgRef = useRef(null);

  const handleChange = async (event, method) => {
    event.preventDefault();
    setChangeName(prev => !prev);
    if (method === "save") {
      await supabase
        .from('users')
        .update({
          name: name
        }).eq("id", id);
      console.log("Name Changed");
    }
  }

  const fetchProfile = async () => {
    try {
      setProtLoading(true);
      const { data } = await supabase
        .from('users')
        .select()
        .eq("id", id);

      if (data) {
        setCur_user(data[0]);
        setName(data[0].name);
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
      const response = await supabase
        .from('posts')
        .select()
        .eq('user_id', id);
      setBlog(response.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }



  const profileData = useCallback(fetchProfile, [image_url]);

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
        console.log(data);
        const url = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/${data.fullPath}`;
        setImage_url(url);
        await supabase
          .from('users')
          .update({
            avatar_url: url
          }).eq("id", id);
        console.log("Profile Changed");
      }
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
            className="rounded-full cursor-pointer mx-2 w-20 border-black border"
            alt="profile" />
        </div>
        <input type="file"
          ref={imgRef}
          onChange={uploadImg}
          accept="image/png, image/jpeg"
          hidden />

        <form className="flex flex-col items-start mx-3" onSubmit={(event) => handleChange(event, "save")}>
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
              onClick={() => handleChange("save")}>Save Name</button>) :
            (<button className="text-xs my-1 text-blue-500 font-medium"
              onClick={() => handleChange("change")}>Change Name</button>)}
        </form>
      </div>

      <div className="my-16 mx-5">
        <div className="flex items-center">
          <p className="text-xl font-medium">Email: </p>
          <p className="text-2xl font-light mx-1">{cur_user?.email}</p>
        </div>

        <div className="flex items-center">
          <p className="text-xl font-medium">Account Created : </p>
          <p className="text-2xl font-light mx-1">
            {new Date(cur_user?.created_at)?.toLocaleString("en", {
              year: "numeric", month: "short", day: "2-digit"
            })}
          </p>
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
                  <NavLink to={`/post/${post?.id}`} className="border-r p-2 bg-white mr-1 drop-shadow-lg rounded-lg cursor-auto" key={_} >
                    <div className="w-96 max-w-xs overflow-hidden transition-shadow duration-300 ease-in-out">
                      <div className="ml-1">
                        <img src={post?.image_url}
                          className="object-cover w-full rounded-xl h-[25vh]"
                          alt={post?.blog_title} />
                      </div>
                      <div className="p-2">
                        <p className="text-pretty">
                          {post?.blog_title}
                        </p>
                      </div>
                    </div>
                  </NavLink>
                )))
                : loading ? '' : (<p className="text-xl">You haven't written any blogs yet</p>)}

            </div>

          </div>
        </div>
      </div>
    </div>
  )

};

const Bookmarks = () => {
  return (
    <>
      <p className="text-xl">BookMark</p>
    </>
  )

}
