import { Typography } from "antd";
import * as React from "react";
const {} = Typography;
import { SharedLayout } from "@app/components";
import { useSharedQuery } from "@app/graphql";
import { NextPage } from "next";

const Home: NextPage = () => {
  const query = useSharedQuery();
  return (
    <SharedLayout title="" query={query}>
      Application to creating organizations
    </SharedLayout>
  );
};

export default Home;
