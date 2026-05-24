export default function ShowStepsList({ instructions }) {
    const normalizedInstructions = Array.isArray(instructions)
      ? instructions.join('\n')
      : (instructions || '');

    return (
        <div style={{ whiteSpace: 'pre-line' }}>
          {normalizedInstructions}
        </div>
    )
}