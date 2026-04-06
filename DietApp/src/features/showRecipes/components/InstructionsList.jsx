export default function InstructionsList({ instructions }) {
    //TODO: change to a numbered list format
    return(
        <ul>
          {instructions.map((ins, j) => (
            <li key={j}>{ins}</li>
          ))}
        </ul>
    )
}