export default function ShowStepsList({ instructions }) {
    return(
        <ol>
          {instructions.map((ins, j) => (
            <li style={{ display: 'flex' }} key={j}>{j + 1}.-{ins}</li >
          ))}
        </ol>
    )
}