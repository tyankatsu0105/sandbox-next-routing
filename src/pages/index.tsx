import Link from "next/link";
import { Routing } from "../libs/routing";

export default function Home() {
  return (
    <>
      <div>
        <Link href={Routing.USERS}>users</Link>
      </div>

      <div>
        <Link href="/users/100">user 100</Link>
      </div>

      <div>
        <Link
          href={Routing.USER.generatePath({
            path: {
              userID: "100",
            },
            query: {
              userCategory: "admin",
              userStatus: "active",
            },
          })}
        >
          user 100 query parameter userCategory userStatus
        </Link>
      </div>

      <div>
        <Link href="/users/100?userCategory=admin">
          user 100 query parameter userCategory
        </Link>
      </div>

      {/* 使わない */}
      <div>
        <Link
          href={{
            pathname: "/users/[userID]",
            query: { userID: "100" },
          }}
        >
          user 100
        </Link>
      </div>
    </>
  );
}
