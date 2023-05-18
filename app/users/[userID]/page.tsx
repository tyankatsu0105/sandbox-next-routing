import ClientComponent from "./ClientComponent";
import ServerComponent from "./ServerComponent";

const User = (props: any) => {
  return (
    <ClientComponent>
      <ServerComponent userID={props.params.userID} />
    </ClientComponent>
  );
};

export default User;
