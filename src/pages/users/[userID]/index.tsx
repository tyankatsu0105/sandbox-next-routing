import { useRouter } from "next/router";

const User = () => {
  const router = useRouter();

  console.log({ router });

  return (
    <>
      <p>user </p>
      <p>query params: {router.query.userCategory}</p>
      <p>path params: {router.query.userID}</p>
    </>
  );
};

export default User;
