import { GetStaticProps } from "next";

const Page = () => <></>;

export const getStaticProps: GetStaticProps = () => ({
  redirect: { destination: "/", permanent: false },
});

export default Page;
