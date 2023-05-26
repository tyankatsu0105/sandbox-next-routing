import Link from "next/link";
import { URL } from "./routing";

export default function Home() {
  return (
    <>
      <div>
        <Link href={URL.USERS}>users</Link>
      </div>
      <div>
        <Link href="/users/100">user 100</Link>
      </div>
      <div>
        <Link href="/users/100?userCategory=hogehoge">
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
