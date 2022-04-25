import tw, { styled } from "twin.macro";

const Layout = styled.div`
  ${tw`flex flex-col items-center h-screen py-10 overflow-auto max-h-screen gap-4`}
  ${tw`bg-tertiary`}
`;

export default Layout;
