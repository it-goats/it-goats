import tw from "twin.macro";

const CheckBoxStyle = tw`ml-auto flex items-center gap-2 p-2 rounded checked:bg-blue-500 checked:border-blue-500`

const CheckBox = (isDone: boolean) => {
    if (isDone)
        return (
            <input type="checkbox" css={CheckBoxStyle} defaultChecked/>
        );
    return (
        <input type="checkbox" css={CheckBoxStyle} />
    );
}

export default CheckBox;
