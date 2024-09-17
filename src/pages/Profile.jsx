import useUsers from "../context/User";

const Profile = () => {
  const { user } = useUsers();

  console.log({ ...user });

  return (
    <div className="border w-[50%] p-3 container mx-auto m-2">
      <div className="">
        <img src={user?.user_metadata?.avatar_url}
          className="rounded-full"
          alt="profile pic" />
      </div>
      <div className="">
        <p className="text-2xl dark:text-white">{user?.user_metadata?.full_name}</p>
      </div>
    </div>
  )
};

export default Profile;
