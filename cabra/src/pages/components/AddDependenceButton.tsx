import tw, { styled } from "twin.macro";

// const AddDependenceButton = styled.button(
//   tw`flex items-center gap-2 font-bold p-2 rounded transform transition-transform hover:scale-105`
// );

const AddDependenceButton = styled.button(
  tw`rounded-lg flex flex-row items-start h-5 py-1 px-4 static w-16 background-color[rgba(190, 204, 239, 1)] font-family[Inter] font-style[normal] font-weight[700] font-size[10px] line-height[12px] letter-spacing[0.015em] color[rgba(120, 125, 171, 1)]`
);

export default AddDependenceButton;
