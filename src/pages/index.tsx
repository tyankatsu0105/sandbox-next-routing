import Link from "next/link";

export default function Home() {
  return (
    <>
      <div>
        <Link href="/users">users</Link>
      </div>
      <div>
        <Link href="/users/100">user 100</Link>
      </div>

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
