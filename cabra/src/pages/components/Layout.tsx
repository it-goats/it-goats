import tw, { styled } from 'twin.macro';

const Layout = styled.div`
  ${tw`flex flex-col items-center h-screen py-10 overflow-auto max-h-screen`}
  ${tw`bg-gradient-to-b from-blue-700 to-fuchsia-500`}
`;

export default Layout;