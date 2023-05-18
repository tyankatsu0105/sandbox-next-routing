import ClientComponent from "./ClientComponent";
import ServerComponent from "./ServerComponent";

const Users = (props: any) => {
  return (
    <ClientComponent>
      <ServerComponent />
    </ClientComponent>
  );
};

export default Users;
