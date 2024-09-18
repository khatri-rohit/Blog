import { useEffect, useState } from "react";
import { MdCamera } from "react-icons/md";
import { supabase } from "../../supabaseClient";
import useUsers from "../context/User";


const Profile = () => {
  const { user } = useUsers();

  const [changeName, setChangeName] = useState(false);
  const [name, setName] = useState('user');
  const [cur_user, setCur_user] = useState('');

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

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('users')
        .select()
        .eq("id", user.id);

      if (data)
        console.log(data[0]);
      setCur_user(data[0]);
      setName(data[0].name);
    })()
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
          <div className="w-[65%] rounded-lg bg-gray-300 p-3">
            
            <div className="flex items-center m-3">
              
              <div className="relative group hover:opacity-60">
                <div className="absolute inset-x-11 inset-y-9">
                  <MdCamera className="group-hover:block hidden text-2xl text-white" />
                </div>
                <img src={user?.user_metadata?.avatar_url}
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
                  {new Date(cur_user?.created_at).toLocaleString("en", {
                    year: "numeric", month: "short", day: "2-digit"
                  })}
                </p>
              </div>

                  

            </div>
          </div>
        </div>
      </div >
    </>
  )
};

export default Profile;