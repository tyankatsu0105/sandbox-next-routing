import { useRouter } from "next/router";

const User = () => {
  const router = useRouter();

  console.log({ router });

  return (
    <>
      <p>user </p>
      <p>query params userCategory: {router.query.userCategory}</p>
      <p>query params userStatus: {router.query.userStatus}</p>
      <p>path params: {router.query.userID}</p>
    </>
  );
};

export default User;
