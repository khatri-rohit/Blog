/* eslint-disable no-unused-vars */
import { memo, useEffect, useMemo, useState } from "react";
import { MdCamera } from "react-icons/md";
import { supabase } from "../../supabaseClient";
import useUsers from "../context/User";
import { NavLink } from "react-router-dom";
import { SyncLoader } from "react-spinners";


const Profile = () => {
  const { user } = useUsers();

  const [changeName, setChangeName] = useState(false);
  const [name, setName] = useState('user');
  const [cur_user, setCur_user] = useState('');
  const [blog, setBlog] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = async (method) => {
    setChangeName(prev => !prev);
    if (method === "save") {
      await supabase
        .from('users')
        .update({
          name: name
        }).eq("id", user.id);
      console.log("Name Changed");
    }
  }

  // const userProfile = memo(function fetchProfile({ user }) {
  //   console.log(user);
  // }, user.id);

  const fetchProfile = async (id) => {
    try {
      setLoading(true);
      const { data } = await supabase
        .from('users')
        .select()
        .eq("id", user.id);

      console.log(user.id);


      if (data) {
        console.log(data[0]);
        setCur_user(data[0]);
        setName(data[0].name);
      }

      const response = await supabase
        .from('blog_posts')
        .select()
        .eq('user_id', user.id);
      setBlog(response.data);
      console.log(response.data);

      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProfile(user.id);
  }, [])


  return (
    <>
      <div className="container mx-auto mt-6">
        <div className="w-full h-[80vh] flex justify-center">

          {/*  */}
          <div className="rounded-lg w-[20%] bg-gray-600">
            <div className="flex items-center p-2 font-medium bg-slate-300 mt-9 cursor-pointer">
              <img src="/blank-avatar.webp"
                className="mx-2 w-10 rounded-full border-black border-2" />
              <p className="text-xl">
                Accounts
              </p>
            </div>
          </div>

          {/*  */}
          <div className="w-[65%] rounded-lg bg-gray-300 p-3 cursor-pointer">

            <div className="flex items-center m-3">

              <div className="relative group hover:opacity-60">
                <div className="absolute inset-x-11 inset-y-9">
                  <MdCamera className="group-hover:block hidden text-2xl text-white" />
                </div>
                <img src={cur_user.avatar_url ? cur_user?.avatar_url : '/blank-avtar.webp'}
                  className="rounded-full cursor-pointer mx-2 w-22 border-black border"
                  alt="profile" />
              </div>

              <div className="flex flex-col items-start mx-3">
                {
                  changeName ?
                    <input type="text"
                      className="text-3xl font-semibold bg-transparent"
                      value={name}
                      autoFocus
                      onChange={e => setName(e.target.value)} /> :
                    (<p className="text-3xl font-semibold">
                      {name}
                    </p>)
                }
                {changeName ?
                  (<button className="text-xs my-1 text-blue-500 font-medium"
                    onClick={() => handleChange("save")}>Save Name</button>) :
                  (<button className="text-xs my-1 text-blue-500 font-medium"
                    onClick={() => handleChange("change")}>Change Name</button>)}
              </div>
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
                <p className="text-3xl font-light p-2">
                  {'->'} All Blogs
                </p>
                <div className="flex overflow-x-scroll scroll-smooth"
                  style={{ scrollbarWidth: "none" }}>
                  <div className={`flex flex-nowrap ms-0.5 ${loading && 'items-center justify-center'}`}>
                    {loading && (<p className="text-center">
                      <SyncLoader />
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
                      : loading ? '' : (<p className="text-xl">No Data</p>)}

                    {/* <div className="inline-block px-3">
                      <div
                        className="w-64 h-64 max-w-xs overflow-hidden rounded-lg shadow-md bg-white hover:shadow-xl transition-shadow duration-300 ease-in-out"
                      ></div>
                    </div> */}

                  </div>

                </div>
              </div>
              {/* <div className="flex flex-wrap items-center">
                  {blog?.length !== 0 ?
                    (blog?.map((post, _) => (
                      <div className="inline-block px-3" key={_}>
                        <div className="max-w-xs overflow-hidden rounded-lg shadow-md bg-white hover:shadow-xl transition-shadow duration-300 ease-in-out">
                          <div className="ml-2">
                            <img src={post?.image_url}
                              className="object-cover w-full rounded-xl m-1 h-[25vh]"
                              alt={post?.blog_title} />
                          </div>
                        </div>
                      </div>
                    )))
                    : (<p className="text-xl">No Data</p>)}
                </div> */}
              {/* </div> */}

            </div>
          </div>
        </div>
      </div >
    </>
  )
};

export default Profile;