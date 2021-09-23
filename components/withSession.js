import { useSession } from "next-auth/client";

const withSession = Component => props => {
  const [session, loading] = useSession();

  // if the component has a render property, we are good
  if (Component.prototype.render) {
    return <Component session={session} {...props} />;
  }

  // if the passed component is a function component, there is no need for this wrapper
  throw new Error(["You passed a function component, `withSession` is not needed.", "You can `useSession` directly in your component."].join("\n"));
};

export default withSession;
