import { GetServerSideProps } from "next";

const Page = () => <></>;

export const getServerSideProps: GetServerSideProps = async () => ({
  redirect: { destination: "/", permanent: false },
});

export default Page;
