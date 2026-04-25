export default function InstructionsList({ instructions }) {
    //TODO: make a functionality to move the steps up and down to reorder.
    return(
        <ol>
          {instructions.map((ins, j) => (
            <li style={{ display: 'flex' }} key={j}>{j + 1}.-{ins}</li >
          ))}
        </ol>
    )
}