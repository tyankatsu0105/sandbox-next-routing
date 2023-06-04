import { useRouter } from "next/router";
import { getTypedQuery, Routing } from "../../routing";

const User = () => {
  const router = useRouter();
  const { query } = getTypedQuery<(typeof Routing)["USER"]>(router);

  return (
    <>
      <p>user </p>
      <p>query params userCategory: {query.userCategory}</p>
      <p>query params userStatus: {query.userStatus}</p>
      <p>path params: {query.userID}</p>
    </>
  );
};

export default User;
